import Link from 'next/link'
import { getSupportTickets } from '@/lib/cosmic'

export default async function HomePage() {
  const tickets = await getSupportTickets()
  const openTickets = tickets.filter((t: any) => t.metadata?.status === 'Open')
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              LPKIA Helpdesk Support
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Dapatkan bantuan dari tim BAU, BAA, dan MIS secara real-time
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/new-ticket" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
                Buat Tiket Baru
              </Link>
              <Link href="/track-ticket" className="btn-secondary bg-blue-700 text-white hover:bg-blue-600">
                Lacak Tiket
              </Link>
              <Link href="/admin" className="btn-secondary bg-blue-700 text-white hover:bg-blue-600">
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {openTickets.length}
            </div>
            <div className="text-gray-600">Tiket Terbuka</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {tickets.filter((t: any) => t.metadata?.status === 'Resolved').length}
            </div>
            <div className="text-gray-600">Tiket Selesai</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-gray-600 mb-2">
              {tickets.length}
            </div>
            <div className="text-gray-600">Total Tiket</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Departemen Support
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-bau rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">BAU</h3>
            <p className="text-gray-600">
              Biro Administrasi Umum - Fasilitas, infrastruktur, dan administrasi umum kampus
            </p>
          </div>
          
          <div className="card hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-baa rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">BAA</h3>
            <p className="text-gray-600">
              Biro Administrasi Akademik - Perkuliahan, nilai, jadwal, dan administrasi akademik
            </p>
          </div>
          
          <div className="card hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-mis rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">MIS</h3>
            <p className="text-gray-600">
              Management Information System - Sistem informasi, teknologi, dan layanan digital
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Cara Menggunakan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="font-bold mb-2">Buat Tiket</h3>
              <p className="text-gray-600 text-sm">
                Isi form tanpa perlu login
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="font-bold mb-2">Dapatkan ID</h3>
              <p className="text-gray-600 text-sm">
                Simpan Ticket ID Anda
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="font-bold mb-2">Tunggu Respon</h3>
              <p className="text-gray-600 text-sm">
                Tim akan membalas real-time
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="font-bold mb-2">Lacak Status</h3>
              <p className="text-gray-600 text-sm">
                Monitor progress tiket Anda
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}