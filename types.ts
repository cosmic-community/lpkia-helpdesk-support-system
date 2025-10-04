// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Support Ticket interface
export interface SupportTicket extends CosmicObject {
  type: 'support-tickets';
  metadata: {
    student_name: string;
    student_email: string;
    student_phone?: string;
    category: TicketCategory;
    subject: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    ticket_number: string;
    assigned_to?: TeamMember;
    resolved_at?: string;
  };
}

// Ticket Message interface
export interface TicketMessage extends CosmicObject {
  type: 'ticket-messages';
  metadata: {
    ticket: SupportTicket;
    sender_name: string;
    sender_type: SenderType;
    message: string;
    timestamp: string;
    attachments?: {
      url: string;
      imgix_url: string;
    };
  };
}

// Team Member interface
export interface TeamMember extends CosmicObject {
  type: 'team-members';
  metadata: {
    full_name: string;
    email: string;
    department: Department;
    role: string;
    photo?: {
      url: string;
      imgix_url: string;
    };
    status: MemberStatus;
    specialties?: string;
  };
}

// Support Category interface
export interface SupportCategory extends CosmicObject {
  type: 'support-categories';
  metadata: {
    category_name: string;
    department: Department;
    description: string;
    icon?: string;
    color?: string;
  };
}

// Type literals
export type TicketCategory = 'BAU' | 'BAA' | 'MIS';
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type SenderType = 'Student' | 'BAU' | 'BAA' | 'MIS';
export type Department = 'BAU' | 'BAA' | 'MIS';
export type MemberStatus = 'Active' | 'Inactive';

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Form data types
export interface CreateTicketFormData {
  student_name: string;
  student_email: string;
  student_phone?: string;
  category: TicketCategory;
  subject: string;
  description: string;
}

export interface SendMessageFormData {
  ticket_id: string;
  sender_name: string;
  sender_type: SenderType;
  message: string;
}

// Notification types
export interface TicketNotification {
  type: 'new-ticket' | 'new-message' | 'status-change';
  ticket_id: string;
  ticket_number: string;
  message: string;
  timestamp: string;
}