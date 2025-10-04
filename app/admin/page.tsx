'use client'

import { useState, useEffect } from 'react'
import AdminLogin from '@/components/AdminLogin'
import AdminDashboard from '@/components/AdminDashboard'

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('support_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('support_user')
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (user) {
      fetchTickets()
    }
  }, [user])

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets')
      const result = await response.json()
      if (result.success) {
        setTickets(result.tickets)
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
    }
  }

  const handleLogin = (userData: any) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('support_user')
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return (
    <AdminDashboard 
      tickets={tickets} 
      currentUser={user}
      onLogout={handleLogout}
      onRefresh={fetchTickets}
    />
  )
}