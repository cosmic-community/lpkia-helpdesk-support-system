import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

// Database path
const dbDir = path.join(process.cwd(), 'data')
const dbPath = path.join(dbDir, 'helpdesk.db')

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// Initialize database
const db = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Initialize database schema
export function initDatabase() {
  // Users table (for BAU, BAA, MIS team members)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      department TEXT NOT NULL CHECK(department IN ('BAU', 'BAA', 'MIS')),
      role TEXT NOT NULL,
      status TEXT DEFAULT 'Active' CHECK(status IN ('Active', 'Inactive')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Tickets table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_number TEXT UNIQUE NOT NULL,
      student_name TEXT NOT NULL,
      student_email TEXT NOT NULL,
      student_phone TEXT,
      category TEXT NOT NULL CHECK(category IN ('BAU', 'BAA', 'MIS')),
      subject TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT DEFAULT 'Open' CHECK(status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
      priority TEXT DEFAULT 'Medium' CHECK(priority IN ('Low', 'Medium', 'High', 'Urgent')),
      assigned_to INTEGER,
      resolved_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assigned_to) REFERENCES users(id)
    )
  `)

  // Messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id INTEGER NOT NULL,
      sender_name TEXT NOT NULL,
      sender_type TEXT NOT NULL CHECK(sender_type IN ('Student', 'BAU', 'BAA', 'MIS')),
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
    )
  `)

  // Insert default team members if table is empty
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }
  
  if (userCount.count === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (username, full_name, email, department, role)
      VALUES (?, ?, ?, ?, ?)
    `)

    // BAU Team
    insertUser.run('bau.admin', 'Admin BAU', 'admin.bau@lpkia.ac.id', 'BAU', 'Administrator')
    insertUser.run('bau.staff1', 'Staff BAU 1', 'staff1.bau@lpkia.ac.id', 'BAU', 'Staff')
    insertUser.run('bau.staff2', 'Staff BAU 2', 'staff2.bau@lpkia.ac.id', 'BAU', 'Staff')

    // BAA Team
    insertUser.run('baa.admin', 'Admin BAA', 'admin.baa@lpkia.ac.id', 'BAA', 'Administrator')
    insertUser.run('baa.staff1', 'Staff BAA 1', 'staff1.baa@lpkia.ac.id', 'BAA', 'Staff')
    insertUser.run('baa.staff2', 'Staff BAA 2', 'staff2.baa@lpkia.ac.id', 'BAA', 'Staff')

    // MIS Team
    insertUser.run('mis.admin', 'Admin MIS', 'admin.mis@lpkia.ac.id', 'MIS', 'Administrator')
    insertUser.run('mis.staff1', 'Staff MIS 1', 'staff1.mis@lpkia.ac.id', 'MIS', 'Staff')
    insertUser.run('mis.staff2', 'Staff MIS 2', 'staff2.mis@lpkia.ac.id', 'MIS', 'Staff')

    console.log('✅ Default team members created')
  }

  console.log('✅ Database initialized successfully')
}

// User operations
export const userQueries = {
  // Get user by username
  getByUsername: (username: string) => {
    return db.prepare('SELECT * FROM users WHERE username = ? AND status = ?').get(username, 'Active')
  },

  // Get all users by department
  getByDepartment: (department: string) => {
    return db.prepare('SELECT * FROM users WHERE department = ? AND status = ?').all(department, 'Active')
  },

  // Get all users
  getAll: () => {
    return db.prepare('SELECT * FROM users WHERE status = ? ORDER BY department, full_name').all('Active')
  },

  // Create new user
  create: (userData: {
    username: string
    full_name: string
    email: string
    department: string
    role: string
  }) => {
    const insert = db.prepare(`
      INSERT INTO users (username, full_name, email, department, role)
      VALUES (?, ?, ?, ?, ?)
    `)
    return insert.run(
      userData.username,
      userData.full_name,
      userData.email,
      userData.department,
      userData.role
    )
  },
}

// Ticket operations
export const ticketQueries = {
  // Create ticket
  create: (ticketData: {
    ticket_number: string
    student_name: string
    student_email: string
    student_phone?: string
    category: string
    subject: string
    description: string
    priority?: string
  }) => {
    const insert = db.prepare(`
      INSERT INTO tickets (ticket_number, student_name, student_email, student_phone, category, subject, description, priority)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    return insert.run(
      ticketData.ticket_number,
      ticketData.student_name,
      ticketData.student_email,
      ticketData.student_phone || '',
      ticketData.category,
      ticketData.subject,
      ticketData.description,
      ticketData.priority || 'Medium'
    )
  },

  // Get ticket by ticket number
  getByTicketNumber: (ticketNumber: string) => {
    return db.prepare(`
      SELECT t.*, u.username as assigned_username, u.full_name as assigned_name
      FROM tickets t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.ticket_number = ?
    `).get(ticketNumber)
  },

  // Get all tickets
  getAll: () => {
    return db.prepare(`
      SELECT t.*, u.username as assigned_username, u.full_name as assigned_name
      FROM tickets t
      LEFT JOIN users u ON t.assigned_to = u.id
      ORDER BY t.created_at DESC
    `).all()
  },

  // Get tickets by category
  getByCategory: (category: string) => {
    return db.prepare(`
      SELECT t.*, u.username as assigned_username, u.full_name as assigned_name
      FROM tickets t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.category = ?
      ORDER BY t.created_at DESC
    `).all(category)
  },

  // Get tickets by status
  getByStatus: (status: string) => {
    return db.prepare(`
      SELECT t.*, u.username as assigned_username, u.full_name as assigned_name
      FROM tickets t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.status = ?
      ORDER BY t.created_at DESC
    `).all(status)
  },

  // Update ticket status
  updateStatus: (ticketNumber: string, status: string) => {
    const update = db.prepare(`
      UPDATE tickets 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE ticket_number = ?
    `)
    return update.run(status, ticketNumber)
  },

  // Update ticket priority
  updatePriority: (ticketNumber: string, priority: string) => {
    const update = db.prepare(`
      UPDATE tickets 
      SET priority = ?, updated_at = CURRENT_TIMESTAMP
      WHERE ticket_number = ?
    `)
    return update.run(priority, ticketNumber)
  },

  // Assign ticket to user
  assignTo: (ticketNumber: string, userId: number) => {
    const update = db.prepare(`
      UPDATE tickets 
      SET assigned_to = ?, updated_at = CURRENT_TIMESTAMP
      WHERE ticket_number = ?
    `)
    return update.run(userId, ticketNumber)
  },
}

// Message operations
export const messageQueries = {
  // Create message
  create: (messageData: {
    ticket_id: number
    sender_name: string
    sender_type: string
    message: string
  }) => {
    const insert = db.prepare(`
      INSERT INTO messages (ticket_id, sender_name, sender_type, message)
      VALUES (?, ?, ?, ?)
    `)
    return insert.run(
      messageData.ticket_id,
      messageData.sender_name,
      messageData.sender_type,
      messageData.message
    )
  },

  // Get messages by ticket ID
  getByTicketId: (ticketId: number) => {
    return db.prepare(`
      SELECT * FROM messages
      WHERE ticket_id = ?
      ORDER BY created_at ASC
    `).all(ticketId)
  },

  // Get messages by ticket number
  getByTicketNumber: (ticketNumber: string) => {
    return db.prepare(`
      SELECT m.* FROM messages m
      JOIN tickets t ON m.ticket_id = t.id
      WHERE t.ticket_number = ?
      ORDER BY m.created_at ASC
    `).all(ticketNumber)
  },
}

export default db