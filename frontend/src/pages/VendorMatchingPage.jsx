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
    <div className="min-h-screen bg-[#F6F8FD] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="font-sans text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            AI Vendor Matching
          </h1>
          <p className="text-sm text-slate-500">
            Describe what you need and let AI find the best-matched vendors for you.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder="e.g. Need 10,000 cotton T-shirts manufactured in Pakistan"
            className="flex-1 min-h-[44px] bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl px-4 outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="min-h-[44px] px-6 bg-[#6C5CE7] hover:bg-[#5A4AD1] text-white font-semibold rounded-xl shadow-card hover:shadow-hover transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? 'Searching...' : 'Find Vendors'}
          </button>
        </form>

        {loading && (
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <span className="inline-block w-3.5 h-3.5 border-2 border-[#6C5CE7] border-t-transparent rounded-full animate-spin" />
            Finding the best vendor matches...
          </div>
        )}

        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {!loading && searched && results.length === 0 && !error && (
          <div className="px-4 py-3 rounded-xl bg-white border border-slate-200/80 text-slate-500 text-sm">
            No vendors found for this requirement. Try adjusting your search.
          </div>
        )}

        {!loading && results.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
              {results.length} {results.length === 1 ? 'Match' : 'Matches'} Found
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((vendor) => (
                <MatchScoreCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}