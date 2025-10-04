import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'
import { generateTicketId } from '@/lib/utils'
import { triggerNotification } from '@/lib/pusher'

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

    // Create ticket in Cosmic
    const response = await cosmic.objects.insertOne({
      type: 'support-tickets',
      title: `${subject} - ${student_name}`,
      slug: ticketId,
      metadata: {
        student_name,
        student_email,
        student_phone: student_phone || '',
        category,
        subject,
        description,
        status: 'Open',
        priority: 'Medium',
        ticket_number: ticketId,
      },
    })

    // Trigger real-time notification
    await triggerNotification('tickets', 'new-ticket', {
      ticket_id: ticketId,
      ticket_number: ticketId,
      category,
      student_name,
      subject,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      ticket_id: ticketId,
      ticket: response.object,
    })
  } catch (error) {
    console.error('Error creating ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create ticket' },
      { status: 500 }
    )
  }
}