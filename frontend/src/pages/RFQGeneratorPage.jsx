import RFQForm from '../components/rfq/RFQForm'

export default function RFQGeneratorPage() {
  return (
    <div className="min-h-screen bg-[#F6F8FD] dark:bg-[#0B1021] p-6 sm:p-10">
      <h1 className="font-sans text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
        RFQ Generator
      </h1>
      <RFQForm />
    </div>
  )
}