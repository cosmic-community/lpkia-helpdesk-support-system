import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, messageQueries } from '@/lib/db'

// Initialize database on first request
initDatabase()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ticketNumber = searchParams.get('ticket_number')

    if (!ticketNumber) {
      return NextResponse.json(
        { success: false, error: 'Ticket number required' },
        { status: 400 }
      )
    }

    const messages = messageQueries.getByTicketNumber(ticketNumber)

    return NextResponse.json({
      success: true,
      messages,
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}