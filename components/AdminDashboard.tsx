'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDate, getStatusColor, getPriorityColor, getDepartmentColor } from '@/lib/utils'

interface Ticket {
  id: number
  ticket_number: string
  student_name: string
  student_email: string
  student_phone?: string
  category: string
  subject: string
  description: string
  status: string
  priority: string
  assigned_username?: string
  assigned_name?: string
  created_at: string
  updated_at: string
}

interface AdminDashboardProps {
  tickets: Ticket[]
  currentUser: {
    id: number
    username: string
    full_name: string
    email: string
    department: string
    role: string
  }
  onLogout: () => void
  onRefresh: () => void
}

export default function AdminDashboard({ tickets, currentUser, onLogout, onRefresh }: AdminDashboardProps) {
  const [filterStatus, setFilterStatus] = useState<string>('All')
  const [filterCategory, setFilterCategory] = useState<string>('All')

  // Filter tickets by user's department
  const departmentTickets = tickets.filter((ticket) => 
    filterCategory === 'All' || ticket.category === filterCategory
  )

  const filteredTickets = departmentTickets.filter((ticket) => {
    if (filterStatus !== 'All' && ticket.status !== filterStatus) {
      return false
    }
    return true
  })

  const stats = {
    total: departmentTickets.length,
    open: departmentTickets.filter((t) => t.status === 'Open').length,
    inProgress: departmentTickets.filter((t) => t.status === 'In Progress').length,
    resolved: departmentTickets.filter((t) => t.status === 'Resolved').length,
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                Logged in as: <span className="font-medium">{currentUser.full_name}</span>
                {' '}(<span className={`badge ${getDepartmentColor(currentUser.department)}`}>
                  {currentUser.department}
                </span>)
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={onRefresh}
                className="btn-secondary"
              >
                🔄 Refresh
              </button>
              <button 
                onClick={onLogout}
                className="btn-secondary"
              >
                Logout
              </button>
              <Link href="/" className="btn-secondary">
                Kembali ke Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="text-sm text-gray-500 mb-1">Total Tiket</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-500 mb-1">Terbuka</div>
            <div className="text-3xl font-bold text-blue-600">{stats.open}</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-500 mb-1">Dalam Progress</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.inProgress}</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-500 mb-1">Selesai</div>
            <div className="text-3xl font-bold text-green-600">{stats.resolved}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Status
              </label>
              <select
                className="input-field"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">Semua Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Kategori
              </label>
              <select
                className="input-field"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="All">Semua Kategori</option>
                <option value="BAU">BAU</option>
                <option value="BAA">BAA</option>
                <option value="MIS">MIS</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mahasiswa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subjek
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioritas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dibuat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      Tidak ada tiket ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-mono text-sm font-medium text-gray-900">
                          {ticket.ticket_number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{ticket.student_name}</div>
                        <div className="text-xs text-gray-500">{ticket.student_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {ticket.subject}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${getDepartmentColor(ticket.category)}`}>
                          {ticket.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(ticket.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/ticket/${ticket.ticket_number}`}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          Lihat Detail
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}