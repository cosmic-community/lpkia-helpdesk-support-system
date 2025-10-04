import { NextRequest, NextResponse } from 'next/server'
import { userQueries } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()

    if (!username || username.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Username required' },
        { status: 400 }
      )
    }

    // Get user by username
    const user = userQueries.getByUsername(username.trim())

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found or inactive' },
        { status: 404 }
      )
    }

    // Return user data (no password needed)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        department: user.department,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
}