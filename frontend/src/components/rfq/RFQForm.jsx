import { useState } from 'react'

export default function RFQForm() {
  const [form, setForm] = useState({
    product: '',
    quantity: '',
    material: '',
    budget: '',
    deliveryDate: '',
    paymentTerms: '',
    shippingMethod: '',
    attachments: null,
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null
  const [attachmentWarning, setAttachmentWarning] = useState(null)
  const [lastSubmitted, setLastSubmitted] = useState(null)
  const [exportingPdf, setExportingPdf] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, attachments: e.target.files[0] }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.product.trim()) newErrors.product = 'Product is required'
    if (!form.quantity || form.quantity <= 0) newErrors.quantity = 'Enter a valid quantity'
    if (!form.deliveryDate) newErrors.deliveryDate = 'Delivery date is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const uploadAttachment = async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData, // NOTE: no Content-Type header — browser sets multipart boundary automatically
    })

    if (!res.ok) throw new Error('File upload failed')

    const data = await res.json()
    return data.url
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setSubmitStatus(null)
    setAttachmentWarning(null)

    // Try to upload the attachment, but never let a failed upload block RFQ submission.
    let attachmentUrls = []
if (form.attachments) {
  try {
    const url = await uploadAttachment(form.attachments)
    attachmentUrls = [url]
  } catch (err) {
    console.error('Attachment upload failed, continuing without it:', err)
       
  }
}

    try {
      const payload = {
        product: form.product,
        quantity: Number(form.quantity),
        material: form.material,
        budget: form.budget ? Number(form.budget) : undefined,
        deliveryDate: form.deliveryDate,
        paymentTerms: form.paymentTerms,
        shippingMethod: form.shippingMethod,
        attachments: attachmentUrls,
      }

      // NOTE: change 'token' below if your login stores it under a different key
      const token = localStorage.getItem('token')

      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to submit RFQ')

      const data = await res.json()
      console.log('RFQ saved:', data)
      setSubmitStatus('success')
      setLastSubmitted(payload)
      setForm({
        product: '', quantity: '', material: '', budget: '',
        deliveryDate: '', paymentTerms: '', shippingMethod: '', attachments: null,
      })
    } catch (err) {
      console.error(err)
      setSubmitStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleExportPdf = async () => {
    if (!lastSubmitted) return
    setExportingPdf(true)

    try {
      const res = await fetch('/api/rfq/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lastSubmitted),
      })

      if (!res.ok) throw new Error('Failed to generate PDF')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `RFQ-${lastSubmitted.product || 'export'}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Could not generate PDF. Please try again.')
    } finally {
      setExportingPdf(false)
    }
  }

  const inputBase =
    'w-full min-h-[44px] bg-white border text-slate-900 placeholder-slate-400 rounded-xl px-4 py-2.5 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#6C5CE7]/20'

  const inputNormal = `${inputBase} border-slate-200 focus:border-[#6C5CE7]`
  const inputError = `${inputBase} border-red-500 focus:ring-red-500/20 focus:border-red-500`

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-card"
    >
      <h2 className="font-sans text-xl sm:text-2xl font-bold text-slate-900 mb-6 text-center">
        Create RFQ
      </h2>

      {submitStatus === 'success' && (
        <div className="mb-4 space-y-2">
          <div className="px-4 py-3 rounded-xl bg-green-50 flex items-center justify-between gap-3 flex-wrap">
            <span className="text-green-700 text-sm font-medium">RFQ submitted successfully!</span>
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={exportingPdf}
              className="text-xs font-semibold text-[#6C5CE7] bg-white border border-[#6C5CE7]/30 hover:bg-[#F0EBFE] px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {exportingPdf ? 'Generating PDF...' : 'Download PDF'}
            </button>
          </div>
          {attachmentWarning && (
            <div className="px-4 py-2 rounded-xl bg-amber-50 text-amber-700 text-xs font-medium">
              {attachmentWarning}
            </div>
          )}
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
          Something went wrong. Please try again.
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-600 mb-1.5">Product</label>
        <input
          className={errors.product ? inputError : inputNormal}
          type="text"
          name="product"
          value={form.product}
          onChange={handleChange}
          placeholder="e.g. Cotton T-shirts"
        />
        {errors.product && <p className="text-red-500 text-xs mt-1">{errors.product}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-600 mb-1.5">Quantity</label>
        <input
          className={errors.quantity ? inputError : inputNormal}
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          placeholder="e.g. 10000"
        />
        {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1.5">Material</label>
          <input className={inputNormal} type="text" name="material" value={form.material} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1.5">Budget</label>
          <input className={inputNormal} type="number" name="budget" value={form.budget} onChange={handleChange} placeholder="$" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-600 mb-1.5">Delivery Date</label>
        <input
          className={errors.deliveryDate ? inputError : inputNormal}
          type="date"
          name="deliveryDate"
          value={form.deliveryDate}
          onChange={handleChange}
        />
        {errors.deliveryDate && <p className="text-red-500 text-xs mt-1">{errors.deliveryDate}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-600 mb-1.5">Payment Terms</label>
        <input
          className={inputNormal}
          type="text"
          name="paymentTerms"
          value={form.paymentTerms}
          onChange={handleChange}
          placeholder="e.g. 50% advance, 50% on delivery"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-600 mb-1.5">Shipping Method</label>
        <select className={inputNormal} name="shippingMethod" value={form.shippingMethod} onChange={handleChange}>
          <option value="">Select shipping method</option>
          <option value="sea">Sea Freight</option>
          <option value="air">Air Freight</option>
          <option value="land">Land</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-600 mb-1.5">Attachments</label>
        <input
          className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#F0EBFE] file:text-[#6C5CE7] file:font-semibold hover:file:bg-[#E4DAFC] file:cursor-pointer"
          type="file"
          onChange={handleFileChange}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full min-h-[44px] bg-[#6C5CE7] hover:bg-[#5A4AD1] text-white font-semibold px-5 py-2.5 rounded-xl shadow-card hover:shadow-hover transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (form.attachments ? 'Uploading & Submitting...' : 'Submitting...') : 'Submit RFQ'}
      </button>
    </form>
  )
}