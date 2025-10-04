import { format } from 'date-fns'

// Generate unique ticket ID
export function generateTicketId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 7)
  return `TKT-${timestamp}-${random}`.toUpperCase()
}

// Format date for display
export function formatDate(date: string | Date): string {
  try {
    return format(new Date(date), 'MMM dd, yyyy HH:mm')
  } catch (error) {
    return 'Invalid date'
  }
}

// Get status color
export function getStatusColor(status: string): string {
  switch (status) {
    case 'Open':
      return 'bg-blue-100 text-blue-800'
    case 'In Progress':
      return 'bg-yellow-100 text-yellow-800'
    case 'Resolved':
      return 'bg-green-100 text-green-800'
    case 'Closed':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Get priority color
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'Low':
      return 'bg-gray-100 text-gray-800'
    case 'Medium':
      return 'bg-blue-100 text-blue-800'
    case 'High':
      return 'bg-orange-100 text-orange-800'
    case 'Urgent':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Get department color
export function getDepartmentColor(department: string): string {
  switch (department) {
    case 'BAU':
      return 'bg-bau text-white'
    case 'BAA':
      return 'bg-baa text-white'
    case 'MIS':
      return 'bg-mis text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}