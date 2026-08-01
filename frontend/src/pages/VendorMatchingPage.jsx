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
  const [loading, setLoading] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setResults(scoreVendors(mockVendors))
      setLoading(false)
    }, 600)
  }

  return (
    <div className="min-h-screen bg-[#F6F8FD] dark:bg-[#0B1021] p-6 sm:p-10">
      <h1 className="font-sans text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
        AI Vendor Matching
      </h1>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8 max-w-2xl">
        <input
          type="text"
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          placeholder="e.g. Need 10,000 cotton T-shirts manufactured in Pakistan"
          className="flex-1 min-h-[44px] bg-white dark:bg-[#0B1021]/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl px-4 outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 transition-all"
        />
        <button
          type="submit"
          disabled={loading}
          className="min-h-[44px] px-6 bg-[#6C5CE7] hover:bg-[#5A4AD1] text-white font-semibold rounded-xl shadow-card hover:shadow-hover transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Searching...' : 'Find Vendors'}
        </button>
      </form>

      {loading ? (
        <p className="text-slate-500 dark:text-slate-400 text-sm">Finding the best vendor matches...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
          {results.map((vendor) => (
            <MatchScoreCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      )}
    </div>
  )
}