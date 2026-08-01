import RFQForm from '../components/rfq/RFQForm'

export default function RFQGeneratorPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)' }}>RFQ Generator</h1>
      <RFQForm />
    </div>
  )
}