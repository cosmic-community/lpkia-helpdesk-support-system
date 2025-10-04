import { NextRequest, NextResponse } from 'next/server'
import { userQueries } from '@/lib/db'

// Get all users or filter by department
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')

    let users
    if (department) {
      users = userQueries.getByDepartment(department)
    } else {
      users = userQueries.getAll()
    }

    return NextResponse.json({
      success: true,
      users,
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// Create new user
export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    const { username, full_name, email, department, role } = userData

    // Validation
    if (!username || !full_name || !email || !department || !role) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Create user
    const result = userQueries.create({
      username,
      full_name,
      email,
      department,
      role,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: result.lastInsertRowid,
        username,
        full_name,
        email,
        department,
        role,
      },
    })
  } catch (error: any) {
    console.error('Error creating user:', error)
    
    // Check for unique constraint violation
    if (error.message?.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { success: false, error: 'Username already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    )
  }
}