'use client'

import { useState, useEffect, useRef } from 'react'
import { pusherClient } from '@/lib/pusher'
import { formatDate } from '@/lib/utils'
import type { SupportTicket, TicketMessage, SenderType } from '@/types'

interface TicketChatProps {
  ticket: SupportTicket
  initialMessages: TicketMessage[]
}

export default function TicketChat({ ticket, initialMessages }: TicketChatProps) {
  const [messages, setMessages] = useState<TicketMessage[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [senderName, setSenderName] = useState('')
  const [senderType, setSenderType] = useState<SenderType>('Student')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Subscribe to real-time updates
    const channel = pusherClient.subscribe(`ticket-${ticket.slug}`)
    
    channel.bind('new-message', (data: any) => {
      // Refresh messages
      fetchMessages()
    })

    return () => {
      pusherClient.unsubscribe(`ticket-${ticket.slug}`)
    }
  }, [ticket.slug])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?ticket_id=${ticket.slug}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !senderName.trim()) {
      alert('Mohon isi nama dan pesan')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: ticket.slug,
          sender_name: senderName,
          sender_type: senderType,
          message: newMessage,
        }),
      })

      if (response.ok) {
        setNewMessage('')
        await fetchMessages()
      } else {
        alert('Gagal mengirim pesan')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const getSenderColor = (type: string) => {
    switch (type) {
      case 'BAU': return 'bg-bau-light text-bau-dark'
      case 'BAA': return 'bg-baa-light text-baa-dark'
      case 'MIS': return 'bg-mis-light text-mis-dark'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="card h-[600px] flex flex-col">
      <h2 className="text-xl font-bold mb-4">Percakapan</h2>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Belum ada percakapan. Kirim pesan pertama!
          </div>
        ) : (
          messages.map((message) => {
            if (!message.metadata) return null
            
            const isSupport = message.metadata.sender_type !== 'Student'
            
            return (
              <div
                key={message.id}
                className={`flex ${isSupport ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[70%] ${isSupport ? '' : 'text-right'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge text-xs ${getSenderColor(message.metadata.sender_type)}`}>
                      {message.metadata.sender_type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {message.metadata.sender_name}
                    </span>
                  </div>
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      isSupport
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.metadata.message}</p>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDate(message.metadata.timestamp || message.created_at)}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 pt-4">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <input
            type="text"
            placeholder="Nama Anda"
            className="input-field text-sm"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            required
          />
          <select
            className="input-field text-sm"
            value={senderType}
            onChange={(e) => setSenderType(e.target.value as SenderType)}
          >
            <option value="Student">Mahasiswa</option>
            <option value="BAU">Tim BAU</option>
            <option value="BAA">Tim BAA</option>
            <option value="MIS">Tim MIS</option>
          </select>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ketik pesan..."
            className="input-field flex-1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Mengirim...' : 'Kirim'}
          </button>
        </div>
      </form>
    </div>
  )
}