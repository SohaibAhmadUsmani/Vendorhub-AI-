import { useState } from 'react'
import MatchScoreCard from '../components/matching/MatchScoreCard'

const mockVendors = [
  { id: 1, name: 'Alpha Textiles Ltd.', price: 8, quality: 9, deliveryTime: 7, reviews: 9, location: 9, capacity: 8, certifications: 10, pastPerformance: 8 },
  { id: 2, name: 'Beta Manufacturing Co.', price: 6, quality: 8, deliveryTime: 9, reviews: 7, location: 6, capacity: 9, certifications: 7, pastPerformance: 9 },
  { id: 3, name: 'Gamma Global Suppliers', price: 9, quality: 6, deliveryTime: 6, reviews: 8, location: 7, capacity: 7, certifications: 6, pastPerformance: 7 },
]

const weights = {
  price: 0.15, quality: 0.2, deliveryTime: 0.15, reviews: 0.15,
  location: 0.1, capacity: 0.1, certifications: 0.1, pastPerformance: 0.05,
}

function scoreVendors(vendors) {
  return vendors
    .map((v) => {
      const score = Object.keys(weights).reduce((sum, key) => sum + v[key] * weights[key], 0)
      return { ...v, matchScore: Math.round(score * 10) }
    })
    .sort((a, b) => b.matchScore - a.matchScore)
}

export default function VendorMatchingPage() {
  const [requirement, setRequirement] = useState('')
  const [results, setResults] = useState(scoreVendors(mockVendors))

  const handleSearch = (e) => {
    e.preventDefault()
    // Day 2: still mock — real filtering/AI reasoning comes once backend + GROQ are ready
    setResults(scoreVendors(mockVendors))
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>AI Vendor Matching</h1>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          placeholder="e.g. Need 10,000 cotton T-shirts manufactured in Pakistan"
          style={{
            flex: 1,
            minHeight: '44px',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '0 0.85rem',
          }}
        />
        <button
          type="submit"
          style={{
            minHeight: '44px',
            padding: '0 1.5rem',
            backgroundColor: 'var(--primary-purple)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Find Vendors
        </button>
      </form>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {results.map((vendor) => (
          <MatchScoreCard key={vendor.id} vendor={vendor} />
        ))}
      </div>
    </div>
  )
}