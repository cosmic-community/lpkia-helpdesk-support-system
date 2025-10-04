import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'
import { triggerNotification } from '@/lib/pusher'
import { notifyNewMessage, getSupportTeamPhone } from '@/lib/whatsapp'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { ticket_id, sender_name, sender_type, message } = data

    // Get ticket object
    const ticketResponse = await cosmic.objects.findOne({
      type: 'support-tickets',
      slug: ticket_id,
    })

    const ticket = ticketResponse.object

    // Create message
    const response = await cosmic.objects.insertOne({
      type: 'ticket-messages',
      title: `Message for ${ticket_id}`,
      metadata: {
        ticket: ticket,
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

    // Send WhatsApp notifications
    try {
      if (sender_type === 'Student') {
        // Student sent a message - notify support team
        const supportPhone = getSupportTeamPhone(ticket.metadata.category)
        
        if (supportPhone) {
          await notifyNewMessage(supportPhone, {
            ticketNumber: ticket_id,
            senderName: sender_name,
            senderType: sender_type,
            message,
            recipientType: 'support',
          })
          console.log('WhatsApp notification sent to support team:', supportPhone)
        }
      } else {
        // Support team sent a message - notify student
        const studentPhone = ticket.metadata.student_phone
        
        if (studentPhone) {
          await notifyNewMessage(studentPhone, {
            ticketNumber: ticket_id,
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
      // Don't fail the message creation if WhatsApp fails
    }

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