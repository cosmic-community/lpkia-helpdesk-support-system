'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDate, getStatusColor, getPriorityColor, getDepartmentColor } from '@/lib/utils'
import type { SupportTicket, TeamMember, TicketStatus, TicketCategory } from '@/types'

interface AdminDashboardProps {
  tickets: SupportTicket[]
  teamMembers: TeamMember[]
}

export default function AdminDashboard({ tickets, teamMembers }: AdminDashboardProps) {
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'All'>('All')
  const [filterCategory, setFilterCategory] = useState<TicketCategory | 'All'>('All')

  const filteredTickets = tickets.filter((ticket) => {
    if (!ticket.metadata) return false
    
    if (filterStatus !== 'All' && ticket.metadata.status !== filterStatus) {
      return false
    }
    if (filterCategory !== 'All' && ticket.metadata.category !== filterCategory) {
      return false
    }
    return true
  })

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.metadata?.status === 'Open').length,
    inProgress: tickets.filter((t) => t.metadata?.status === 'In Progress').length,
    resolved: tickets.filter((t) => t.metadata?.status === 'Resolved').length,
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <Link href="/" className="btn-secondary">
              Kembali ke Home
            </Link>
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
                onChange={(e) => setFilterStatus(e.target.value as TicketStatus | 'All')}
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
                onChange={(e) => setFilterCategory(e.target.value as TicketCategory | 'All')}
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
                  filteredTickets.map((ticket) => {
                    if (!ticket.metadata) return null
                    
                    return (
                      <tr key={ticket.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-mono text-sm font-medium text-gray-900">
                            {ticket.metadata.ticket_number}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{ticket.metadata.student_name}</div>
                          <div className="text-xs text-gray-500">{ticket.metadata.student_email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {ticket.metadata.subject}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`badge ${getDepartmentColor(ticket.metadata.category)}`}>
                            {ticket.metadata.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`badge ${getStatusColor(ticket.metadata.status)}`}>
                            {ticket.metadata.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`badge ${getPriorityColor(ticket.metadata.priority)}`}>
                            {ticket.metadata.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(ticket.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            href={`/ticket/${ticket.slug}`}
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                          >
                            Lihat Detail
                          </Link>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}