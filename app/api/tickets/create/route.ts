import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, ticketQueries } from '@/lib/db'
import { generateTicketId } from '@/lib/utils'
import { triggerNotification } from '@/lib/pusher'
import { notifyTicketCreated } from '@/lib/whatsapp'

// Initialize database on first request
initDatabase()

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      student_name,
      student_email,
      student_phone,
      category,
      subject,
      description,
    } = data

    // Generate unique ticket ID
    const ticketId = generateTicketId()

    // Create ticket in SQLite
    ticketQueries.create({
      ticket_number: ticketId,
      student_name,
      student_email,
      student_phone: student_phone || '',
      category,
      subject,
      description,
      priority: 'Medium',
    })

    // Get created ticket
    const ticket = ticketQueries.getByTicketNumber(ticketId)

    // Trigger real-time notification
    await triggerNotification('tickets', 'new-ticket', {
      ticket_id: ticketId,
      ticket_number: ticketId,
      category,
      student_name,
      subject,
      timestamp: new Date().toISOString(),
    })

    // Send WhatsApp notification to student
    if (student_phone) {
      try {
        await notifyTicketCreated(student_phone, {
          ticketNumber: ticketId,
          studentName: student_name,
          category,
          subject,
          description,
        })
        console.log('WhatsApp notification sent to student:', student_phone)
      } catch (error) {
        console.error('Failed to send WhatsApp to student:', error)
      }
    }

    return NextResponse.json({
      success: true,
      ticket_id: ticketId,
      ticket,
    })
  } catch (error) {
    console.error('Error creating ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create ticket' },
      { status: 500 }
    )
  }
}