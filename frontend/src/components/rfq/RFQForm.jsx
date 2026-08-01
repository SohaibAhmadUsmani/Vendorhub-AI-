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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    console.log('RFQ Submitted (mock):', form)
    alert('RFQ ready to send!')
  }

  const inputStyle = {
    width: '100%',
    minHeight: '44px',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    padding: '0.6rem 0.85rem',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
    backgroundColor: 'var(--bg-card)',
    marginBottom: '1rem',
  }

  const errorInputStyle = {
    ...inputStyle,
    border: '1px solid #E74C3C',
    marginBottom: '0.35rem',
  }

  const labelStyle = {
    display: 'block',
    fontWeight: 600,
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.35rem',
  }

  const errorTextStyle = {
    color: '#E74C3C',
    fontSize: '0.75rem',
    marginTop: '-0.75rem',
    marginBottom: '0.75rem',
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel"
      style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>
        Create RFQ
      </h2>

      <label style={labelStyle}>Product</label>
      <input
        style={errors.product ? errorInputStyle : inputStyle}
        type="text"
        name="product"
        value={form.product}
        onChange={handleChange}
      />
      {errors.product && <p style={errorTextStyle}>{errors.product}</p>}

      <label style={labelStyle}>Quantity</label>
      <input
        style={errors.quantity ? errorInputStyle : inputStyle}
        type="number"
        name="quantity"
        value={form.quantity}
        onChange={handleChange}
      />
      {errors.quantity && <p style={errorTextStyle}>{errors.quantity}</p>}

      <label style={labelStyle}>Material</label>
      <input style={inputStyle} type="text" name="material" value={form.material} onChange={handleChange} />

      <label style={labelStyle}>Budget</label>
      <input style={inputStyle} type="number" name="budget" value={form.budget} onChange={handleChange} />

      <label style={labelStyle}>Delivery Date</label>
      <input
        style={errors.deliveryDate ? errorInputStyle : inputStyle}
        type="date"
        name="deliveryDate"
        value={form.deliveryDate}
        onChange={handleChange}
      />
      {errors.deliveryDate && <p style={errorTextStyle}>{errors.deliveryDate}</p>}

      <label style={labelStyle}>Payment Terms</label>
      <input
        style={inputStyle}
        type="text"
        name="paymentTerms"
        value={form.paymentTerms}
        onChange={handleChange}
        placeholder="e.g. 50% advance, 50% on delivery"
      />

      <label style={labelStyle}>Shipping Method</label>
      <select style={inputStyle} name="shippingMethod" value={form.shippingMethod} onChange={handleChange}>
        <option value="">Select shipping method</option>
        <option value="sea">Sea Freight</option>
        <option value="air">Air Freight</option>
        <option value="land">Land</option>
      </select>

      <label style={labelStyle}>Attachments</label>
      <input style={inputStyle} type="file" onChange={handleFileChange} />

      <button
        type="submit"
        className="btn-purple-primary"
        style={{
          width: '100%',
          minHeight: '44px',
          backgroundColor: 'var(--primary-purple)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontWeight: 700,
          marginTop: '0.5rem',
          cursor: 'pointer',
        }}
      >
        Submit RFQ
      </button>
    </form>
  )
}