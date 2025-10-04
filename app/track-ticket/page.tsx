import TrackTicketForm from '@/components/TrackTicketForm'

export default function TrackTicketPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lacak Tiket Support
          </h1>
          <p className="text-gray-600">
            Masukkan Ticket ID Anda untuk melihat status dan balasan
          </p>
        </div>
        
        <TrackTicketForm />
      </div>
    </div>
  )
}