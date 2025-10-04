import { NextRequest, NextResponse } from 'next/server'
import { getTicketMessages } from '@/lib/cosmic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ticketId = searchParams.get('ticket_id')

    if (!ticketId) {
      return NextResponse.json(
        { success: false, error: 'Ticket ID required' },
        { status: 400 }
      )
    }

    const messages = await getTicketMessages(ticketId)

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