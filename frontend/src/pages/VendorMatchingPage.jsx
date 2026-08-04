import { useState } from 'react'
import MatchScoreCard from '../components/matching/MatchScoreCard'

export default function VendorMatchingPage() {
  const [requirement, setRequirement] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirement }),
      })

      if (!res.ok) throw new Error('Match request failed')

      const data = await res.json()
      setResults(data.results || [])
      setSearched(true)
    } catch (err) {
      console.error(err)
      setError('Could not fetch vendor matches. Please try again.')
    } finally {
      setLoading(false)
    }
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

      {loading && (
        <p className="text-slate-500 dark:text-slate-400 text-sm">Finding the best vendor matches...</p>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {!loading && searched && results.length === 0 && !error && (
        <p className="text-slate-500 dark:text-slate-400 text-sm">No vendors found for this requirement.</p>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
          {results.map((vendor) => (
            <MatchScoreCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      )}
    </div>
  )
}