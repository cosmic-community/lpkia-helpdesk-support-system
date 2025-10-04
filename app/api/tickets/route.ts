import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, ticketQueries } from '@/lib/db'

// Initialize database on first request
initDatabase()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const ticketNumber = searchParams.get('ticket_number')

    let tickets

    if (ticketNumber) {
      const ticket = ticketQueries.getByTicketNumber(ticketNumber)
      tickets = ticket ? [ticket] : []
    } else if (category) {
      tickets = ticketQueries.getByCategory(category)
    } else if (status) {
      tickets = ticketQueries.getByStatus(status)
    } else {
      tickets = ticketQueries.getAll()
    }

    return NextResponse.json({
      success: true,
      tickets,
    })
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
}