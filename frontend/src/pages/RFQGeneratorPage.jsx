import RFQForm from '../components/rfq/RFQForm'

export default function RFQGeneratorPage() {
  return (
    <div className="min-h-screen bg-[#F6F8FD] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-10 text-center">
          <h1 className="font-sans text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            RFQ Generator
          </h1>
          <p className="text-sm text-slate-500">
            Fill in your requirements and let AI draft a professional RFQ for you.
          </p>
        </div>

        <RFQForm />
      </div>
    </div>
  )
}