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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setSubmitStatus(null)

    try {
      const payload = {
        product: form.product,
        quantity: Number(form.quantity),
        material: form.material,
        budget: form.budget ? Number(form.budget) : undefined,
        deliveryDate: form.deliveryDate,
        paymentTerms: form.paymentTerms,
        shippingMethod: form.shippingMethod,
      }

      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to submit RFQ')

      const data = await res.json()
      console.log('RFQ saved:', data)
      setSubmitStatus('success')
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

  const inputBase =
    'w-full min-h-[44px] bg-white dark:bg-[#0B1021]/80 border text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl px-4 py-2.5 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#6C5CE7]/20'

  const inputNormal = `${inputBase} border-slate-200 dark:border-slate-800 focus:border-[#6C5CE7] dark:focus:border-[#6C5CE7]`
  const inputError = `${inputBase} border-red-500 focus:ring-red-500/20 focus:border-red-500`

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white dark:bg-[#151D30] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-card"
    >
      <h2 className="font-sans text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Create RFQ
      </h2>

      {submitStatus === 'success' && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 text-green-700 text-sm font-medium">
          RFQ submitted successfully!
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
          Something went wrong. Please try again.
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Product</label>
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
        <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Quantity</label>
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
          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Material</label>
          <input className={inputNormal} type="text" name="material" value={form.material} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Budget</label>
          <input className={inputNormal} type="number" name="budget" value={form.budget} onChange={handleChange} placeholder="$" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Delivery Date</label>
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
        <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Payment Terms</label>
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
        <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Shipping Method</label>
        <select className={inputNormal} name="shippingMethod" value={form.shippingMethod} onChange={handleChange}>
          <option value="">Select shipping method</option>
          <option value="sea">Sea Freight</option>
          <option value="air">Air Freight</option>
          <option value="land">Land</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Attachments</label>
        <input
          className="w-full text-sm text-slate-600 dark:text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#F0EBFE] file:text-[#6C5CE7] file:font-semibold hover:file:bg-[#E4DAFC] file:cursor-pointer"
          type="file"
          onChange={handleFileChange}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full min-h-[44px] bg-[#6C5CE7] hover:bg-[#5A4AD1] text-white font-semibold px-5 py-2.5 rounded-xl shadow-card hover:shadow-hover transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting...' : 'Submit RFQ'}
      </button>
    </form>
  )
}