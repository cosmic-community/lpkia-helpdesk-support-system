'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { TicketCategory } from '@/types'

export default function NewTicketForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    student_name: '',
    student_email: '',
    student_phone: '',
    category: 'BAU' as TicketCategory,
    subject: '',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/tickets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        const hasPhone = formData.student_phone.trim() !== ''
        const phoneMessage = hasPhone 
          ? '\n\n📱 Notifikasi WhatsApp telah dikirim ke nomor Anda!' 
          : '\n\n💡 Tip: Tambahkan nomor WhatsApp untuk menerima notifikasi otomatis!'
        
        alert(`✅ Tiket berhasil dibuat!${phoneMessage}\n\n🎫 Ticket ID: ${result.ticket_id}\n\nSimpan ID ini untuk melacak tiket Anda.`)
        router.push(`/ticket/${result.ticket_id}`)
      } else {
        alert('❌ Gagal membuat tiket. Silakan coba lagi.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Lengkap *
          </label>
          <input
            type="text"
            required
            className="input-field"
            value={formData.student_name}
            onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
            placeholder="Masukkan nama lengkap Anda"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            required
            className="input-field"
            value={formData.student_email}
            onChange={(e) => setFormData({ ...formData, student_email: e.target.value })}
            placeholder="nama@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nomor WhatsApp (Untuk Notifikasi Otomatis) *
          </label>
          <input
            type="tel"
            required
            className="input-field"
            value={formData.student_phone}
            onChange={(e) => setFormData({ ...formData, student_phone: e.target.value })}
            placeholder="08xxxxxxxxxx atau 628xxxxxxxxxx"
          />
          <p className="mt-1 text-sm text-gray-500">
            📱 Anda akan menerima notifikasi WhatsApp untuk update tiket
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori / Departemen *
          </label>
          <select
            required
            className="input-field"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as TicketCategory })}
          >
            <option value="BAU">BAU - Biro Administrasi Umum</option>
            <option value="BAA">BAA - Biro Administrasi Akademik</option>
            <option value="MIS">MIS - Management Information System</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subjek / Judul Masalah *
          </label>
          <input
            type="text"
            required
            className="input-field"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Ringkasan singkat masalah Anda"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi Masalah *
          </label>
          <textarea
            required
            rows={6}
            className="input-field"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Jelaskan masalah Anda secara detail..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Membuat Tiket...' : '✅ Buat Tiket'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="btn-secondary"
          >
            Batal
          </button>
        </div>
      </div>
    </form>
  )
}