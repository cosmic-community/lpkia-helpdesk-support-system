import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, messageQueries, ticketQueries } from '@/lib/db'
import { triggerNotification } from '@/lib/pusher'
import { notifyNewMessage, getSupportTeamPhone } from '@/lib/whatsapp'

// Initialize database on first request
initDatabase()

export async function POST(request: NextRequest) {
  try {
    // Check if request has a body
    const text = await request.text()
    if (!text || text.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Request body is required' },
        { status: 400 }
      )
    }

    // Parse JSON safely
    let data
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { ticket_number, sender_name, sender_type, message } = data

    // Validate required fields
    if (!ticket_number || !sender_name || !sender_type || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get ticket
    const ticket = ticketQueries.getByTicketNumber(ticket_number)

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      )
    }

    // Create message
    const result = messageQueries.create({
      ticket_id: ticket.id,
      sender_name,
      sender_type,
      message,
    })

    // Trigger real-time notification
    await triggerNotification(`ticket-${ticket_number}`, 'new-message', {
      message_id: result.lastInsertRowid,
      sender_name,
      sender_type,
      message,
      timestamp: new Date().toISOString(),
    })

    // Send WhatsApp notifications
    try {
      if (sender_type === 'Student') {
        // Student sent a message - notify support team
        const supportPhone = getSupportTeamPhone(ticket.category)
        
        if (supportPhone) {
          await notifyNewMessage(supportPhone, {
            ticketNumber: ticket_number,
            senderName: sender_name,
            senderType: sender_type,
            message,
            recipientType: 'support',
          })
          console.log('WhatsApp notification sent to support team:', supportPhone)
        }
      } else {
        // Support team sent a message - notify student
        const studentPhone = ticket.student_phone
        
        if (studentPhone) {
          await notifyNewMessage(studentPhone, {
            ticketNumber: ticket_number,
            senderName: sender_name,
            senderType: sender_type,
            message,
            recipientType: 'student',
          })
          console.log('WhatsApp notification sent to student:', studentPhone)
        }
      }
    } catch (error) {
      console.error('Failed to send WhatsApp notification:', error)
    }

    return NextResponse.json({
      success: true,
      message_id: result.lastInsertRowid,
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}