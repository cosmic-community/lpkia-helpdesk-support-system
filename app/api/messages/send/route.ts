import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'
import { triggerNotification } from '@/lib/pusher'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { ticket_id, sender_name, sender_type, message } = data

    // Get ticket object
    const ticketResponse = await cosmic.objects.findOne({
      type: 'support-tickets',
      slug: ticket_id,
    })

    // Create message
    const response = await cosmic.objects.insertOne({
      type: 'ticket-messages',
      title: `Message for ${ticket_id}`,
      metadata: {
        ticket: ticketResponse.object,
        sender_name,
        sender_type,
        message,
        timestamp: new Date().toISOString(),
      },
    })

    // Trigger real-time notification
    await triggerNotification(`ticket-${ticket_id}`, 'new-message', {
      message_id: response.object.id,
      sender_name,
      sender_type,
      message,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: response.object,
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}