import { createBucketClient } from '@cosmicjs/sdk'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Helper function for error handling
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Fetch all support tickets
export async function getSupportTickets() {
  try {
    const response = await cosmic.objects
      .find({ type: 'support-tickets' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1);
    
    const tickets = response.objects.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    });
    
    return tickets;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch support tickets');
  }
}

// Fetch ticket by slug/ID
export async function getTicketById(ticketId: string) {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'support-tickets', slug: ticketId })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1);
    
    return response.object;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch ticket');
  }
}

// Fetch messages for a ticket
export async function getTicketMessages(ticketId: string) {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'ticket-messages',
      })
      .props(['id', 'title', 'metadata', 'created_at'])
      .depth(1);
    
    // Filter messages by ticket slug on client side
    const messages = response.objects
      .filter((msg: any) => msg.metadata?.ticket?.slug === ticketId)
      .sort((a, b) => {
        const dateA = new Date(a.metadata?.timestamp || a.created_at).getTime();
        const dateB = new Date(b.metadata?.timestamp || b.created_at).getTime();
        return dateA - dateB;
      });
    
    return messages;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch messages');
  }
}

// Fetch team members by department
export async function getTeamMembers(department?: Department) {
  try {
    const query: Record<string, any> = { type: 'team-members' };
    
    const response = await cosmic.objects
      .find(query)
      .props(['id', 'title', 'metadata'])
      .depth(0);
    
    let members = response.objects;
    
    // Filter by department if provided
    if (department) {
      members = members.filter((member: any) => member.metadata?.department === department);
    }
    
    return members;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch team members');
  }
}

// Fetch support categories
export async function getSupportCategories() {
  try {
    const response = await cosmic.objects
      .find({ type: 'support-categories' })
      .props(['id', 'title', 'metadata'])
      .depth(0);
    
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch categories');
  }
}

// Import types
import type { Department } from '@/types'