'use client'

import { useState } from 'react'

interface AdminLoginProps {
  onLogin: (user: any) => void
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      })

      const result = await response.json()

      if (result.success) {
        // Store user in localStorage
        localStorage.setItem('support_user', JSON.stringify(result.user))
        onLogin(result.user)
      } else {
        setError(result.error || 'Login gagal')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Terjadi kesalahan saat login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            LPKIA Helpdesk Admin
          </h1>
          <p className="text-gray-600">Masuk sebagai Tim Support</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              required
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username Anda"
              autoFocus
            />
            <p className="mt-2 text-sm text-gray-500">
              Contoh: bau.admin, baa.staff1, mis.admin
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>

            <div className="text-center">
              <a href="/" className="text-sm text-blue-600 hover:text-blue-800">
                ← Kembali ke Home
              </a>
            </div>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Default User Accounts:
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>🏢 BAU:</span>
              <span className="font-mono text-xs">bau.admin, bau.staff1, bau.staff2</span>
            </div>
            <div className="flex items-center justify-between">
              <span>📚 BAA:</span>
              <span className="font-mono text-xs">baa.admin, baa.staff1, baa.staff2</span>
            </div>
            <div className="flex items-center justify-between">
              <span>💻 MIS:</span>
              <span className="font-mono text-xs">mis.admin, mis.staff1, mis.staff2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}