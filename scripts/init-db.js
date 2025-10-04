const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

const dbDir = path.join(process.cwd(), 'data')
const dbPath = path.join(dbDir, 'helpdesk.db')

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

console.log('🚀 Initializing LPKIA Helpdesk Database...')

const db = new Database(dbPath)
db.pragma('foreign_keys = ON')

try {
  // Users table
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

  console.log('✅ Tables created successfully')

  // Check if users exist
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get()
  
  if (userCount.count === 0) {
    console.log('📝 Inserting default team members...')
    
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

    console.log('✅ Default team members created:')
    console.log('   - BAU: bau.admin, bau.staff1, bau.staff2')
    console.log('   - BAA: baa.admin, baa.staff1, baa.staff2')
    console.log('   - MIS: mis.admin, mis.staff1, mis.staff2')
  } else {
    console.log('ℹ️  Users already exist, skipping seed data')
  }

  console.log('\n🎉 Database initialization complete!')
  console.log(`📁 Database location: ${dbPath}`)
  console.log('\n💡 To reset the database, delete the data/helpdesk.db file and run this script again')

} catch (error) {
  console.error('❌ Error initializing database:', error)
  process.exit(1)
} finally {
  db.close()
}