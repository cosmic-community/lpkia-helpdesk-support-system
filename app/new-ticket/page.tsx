import NewTicketForm from '@/components/NewTicketForm'

export default function NewTicketPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Buat Tiket Support Baru
          </h1>
          <p className="text-gray-600">
            Isi form di bawah untuk membuat tiket support. Tidak perlu login!
          </p>
        </div>
        
        <NewTicketForm />
      </div>
    </div>
  )
}