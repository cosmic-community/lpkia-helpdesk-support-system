import { formatDate, getStatusColor, getPriorityColor, getDepartmentColor } from '@/lib/utils'
import type { SupportTicket } from '@/types'

interface TicketDetailsProps {
  ticket: SupportTicket
}

export default function TicketDetails({ ticket }: TicketDetailsProps) {
  if (!ticket || !ticket.metadata) {
    return (
      <div className="card">
        <p>Loading ticket details...</p>
      </div>
    )
  }

  const { metadata } = ticket

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Detail Tiket</h2>
      
      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-500 mb-1">Ticket ID</div>
          <div className="font-mono font-bold text-lg">
            {metadata.ticket_number}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-1">Status</div>
          <span className={`badge ${getStatusColor(metadata.status)}`}>
            {metadata.status}
          </span>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-1">Prioritas</div>
          <span className={`badge ${getPriorityColor(metadata.priority)}`}>
            {metadata.priority}
          </span>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-1">Kategori</div>
          <span className={`badge ${getDepartmentColor(metadata.category)}`}>
            {metadata.category}
          </span>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-1">Subjek</div>
          <div className="font-medium">{metadata.subject}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-1">Nama Mahasiswa</div>
          <div>{metadata.student_name}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-1">Email</div>
          <div className="text-sm">{metadata.student_email}</div>
        </div>

        {metadata.student_phone && (
          <div>
            <div className="text-sm text-gray-500 mb-1">Telepon</div>
            <div className="text-sm">{metadata.student_phone}</div>
          </div>
        )}

        <div>
          <div className="text-sm text-gray-500 mb-1">Dibuat</div>
          <div className="text-sm">{formatDate(ticket.created_at)}</div>
        </div>

        {metadata.assigned_to && (
          <div>
            <div className="text-sm text-gray-500 mb-1">Ditangani Oleh</div>
            <div className="text-sm font-medium">
              {metadata.assigned_to.metadata?.full_name || metadata.assigned_to.title}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-500 mb-2">Deskripsi Masalah</div>
        <div className="text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
          {metadata.description}
        </div>
      </div>
    </div>
  )
}