import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'
import { triggerNotification } from '@/lib/pusher'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { ticket_id, status, priority, assigned_to } = data

    // Get ticket
    const ticket = await cosmic.objects.findOne({
      type: 'support-tickets',
      slug: ticket_id,
    })

    // Update ticket - only include changed fields
    const updateData: any = {}
    
    if (status) {
      updateData.status = status
    }
    
    if (priority) {
      updateData.priority = priority
    }
    
    if (assigned_to) {
      const teamMember = await cosmic.objects.findOne({
        type: 'team-members',
        id: assigned_to,
      })
      updateData.assigned_to = teamMember.object
    }

    const response = await cosmic.objects.updateOne(ticket.object.id, {
      metadata: updateData,
    })

    // Trigger notification
    await triggerNotification(`ticket-${ticket_id}`, 'status-change', {
      ticket_id,
      status: status || ticket.object.metadata.status,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      ticket: response.object,
    })
  } catch (error) {
    console.error('Error updating ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update ticket' },
      { status: 500 }
    )
  }
}