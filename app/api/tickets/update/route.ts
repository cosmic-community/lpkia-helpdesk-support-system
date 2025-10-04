import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, ticketQueries } from '@/lib/db'
import { triggerNotification } from '@/lib/pusher'

// Initialize database on first request
initDatabase()

export async function PATCH(request: NextRequest) {
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

    const { ticket_number, status, priority, assigned_to } = data

    if (!ticket_number) {
      return NextResponse.json(
        { success: false, error: 'Ticket number required' },
        { status: 400 }
      )
    }

    // Update ticket
    if (status) {
      ticketQueries.updateStatus(ticket_number, status)
    }

    if (priority) {
      ticketQueries.updatePriority(ticket_number, priority)
    }

    if (assigned_to) {
      ticketQueries.assignTo(ticket_number, assigned_to)
    }

    // Get updated ticket
    const ticket = ticketQueries.getByTicketNumber(ticket_number)

    // Trigger real-time notification
    await triggerNotification('tickets', 'ticket-updated', {
      ticket_number,
      status: ticket?.status,
      priority: ticket?.priority,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      ticket,
    })
  } catch (error) {
    console.error('Error updating ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update ticket' },
      { status: 500 }
    )
  }
}