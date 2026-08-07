export default function MatchScoreCard({ vendor }) {
  const factors = [
    { label: 'Price', value: vendor.price },
    { label: 'Quality', value: vendor.quality },
    { label: 'Delivery', value: vendor.deliveryTime },
    { label: 'Reviews', value: vendor.reviews },
    { label: 'Location', value: vendor.location },
    { label: 'Capacity', value: vendor.capacity },
    { label: 'Certifications', value: vendor.certifications },
    { label: 'Past Performance', value: vendor.pastPerformance },
  ]

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-sans text-base sm:text-lg font-bold text-slate-900">
          {vendor.name}
        </h3>
        <span className="bg-[#F0EBFE] text-[#6C5CE7] font-mono font-bold text-xs sm:text-sm px-3 py-1 rounded-full whitespace-nowrap">
          {vendor.matchScore}% Match
        </span>
      </div>

      {vendor.explanation && (
        <p className="text-sm text-slate-600 italic mb-4">
          {vendor.explanation}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {factors.map((f) => (
          <div key={f.label}>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>{f.label}</span>
              <span className="font-mono">{f.value}/10</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6C5CE7] rounded-full transition-all duration-300"
                style={{ width: `${f.value * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}