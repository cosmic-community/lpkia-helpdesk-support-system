'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TrackTicketForm() {
  const router = useRouter()
  const [ticketId, setTicketId] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Just navigate to ticket page
      router.push(`/ticket/${ticketId}`)
    } catch (error) {
      console.error('Error:', error)
      alert('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ticket ID
          </label>
          <input
            type="text"
            required
            className="input-field"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value.toUpperCase())}
            placeholder="TKT-XXXXXXXXX"
          />
          <p className="mt-2 text-sm text-gray-500">
            Masukkan Ticket ID yang Anda terima saat membuat tiket
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !ticketId}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Mencari...' : 'Lacak Tiket'}
        </button>
      </form>
    </div>
  )
}