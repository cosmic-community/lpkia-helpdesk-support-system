import { getSupportTickets, getTeamMembers } from '@/lib/cosmic'
import AdminDashboard from '@/components/AdminDashboard'

export default async function AdminPage() {
  const tickets = await getSupportTickets()
  const teamMembers = await getTeamMembers()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboard tickets={tickets} teamMembers={teamMembers} />
    </div>
  )
}