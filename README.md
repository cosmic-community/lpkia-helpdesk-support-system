# LPKIA Helpdesk Support System

![App Preview](https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=300&fit=crop&auto=format)

Sistem helpdesk real-time yang memungkinkan mahasiswa LPKIA mendapatkan bantuan dari tim BAU, BAA, dan MIS tanpa perlu login. Dilengkapi dengan notifikasi real-time dan live chat untuk komunikasi yang efektif.

## Features

- ✅ **No-Login System** - Mahasiswa dapat membuat tiket tanpa registrasi
- 🔔 **Real-Time Notifications** - Notifikasi instant menggunakan Pusher
- 💬 **Live Chat** - Komunikasi real-time antara mahasiswa dan tim support
- 🎫 **Ticket Tracking** - Lacak status tiket dengan Ticket ID unik
- 👥 **Multi-Department** - Support dari tim BAU, BAA, dan MIS
- 📊 **Admin Dashboard** - Panel lengkap untuk manajemen tiket
- 🏷️ **Auto-Routing** - Tiket otomatis diarahkan ke departemen yang sesuai
- 📈 **Statistics** - Laporan dan statistik tiket real-time
- 🔍 **Search & Filter** - Cari dan filter tiket berdasarkan berbagai kriteria
- 📱 **Responsive Design** - Bekerja sempurna di desktop dan mobile

## Clone this Project

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=68e0a4ee260d9dd939d1ba72&clone_repository=68e0a770260d9dd939d1ba78)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> No content model prompt provided - app built from existing content structure

### Code Generation Prompt

> buatkan aplikasi helpdesk untuk lpkia yang role orang-orangnya terdapat BAU,BAA,MIS dan juga mahasiswa yang membutuhkan pertolongan dan tim BAU,BAA,MIS juga bisa membantu mahasiswa yang bermasalah ini ketika meminta bantuan lewat aplikasi helpdesk support tanpa harus login terlebih dahulu dan harus real time dan terdapat notif realtime juga dari mahasiswa balasannya maupun dari tim BAA,BAU,dan juga MIS notif balasannya

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Cosmic for content management
- **Real-Time**: Pusher for real-time notifications and chat
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Cosmic account with bucket
- Pusher account for real-time features

### Installation

1. Clone the repository
2. Install dependencies:

```bash
bun install
```

3. Set up environment variables (see Environment Variables section below)

4. Run the development server:

```bash
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Cosmic SDK Examples

### Fetching Support Tickets

```typescript
import { cosmic } from '@/lib/cosmic'

// Get all tickets
const tickets = await cosmic.objects
  .find({ type: 'support-tickets' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

// Get ticket by ID
const ticket = await cosmic.objects
  .findOne({ type: 'support-tickets', slug: 'ticket-id' })
  .depth(1)
```

### Creating a New Ticket

```typescript
// Create ticket without login
const newTicket = await cosmic.objects.insertOne({
  type: 'support-tickets',
  title: `Ticket from ${studentName}`,
  slug: ticketId,
  metadata: {
    student_name: studentName,
    student_email: studentEmail,
    category: category, // BAU, BAA, or MIS
    subject: subject,
    description: description,
    status: 'Open',
    priority: 'Medium',
    ticket_number: ticketId
  }
})
```

### Real-Time Message Updates

```typescript
// Send message to ticket
const message = await cosmic.objects.insertOne({
  type: 'ticket-messages',
  title: `Message for ${ticketId}`,
  metadata: {
    ticket: ticketObject,
    sender_name: senderName,
    sender_type: 'Student', // or 'BAU', 'BAA', 'MIS'
    message: messageContent,
    timestamp: new Date().toISOString()
  }
})
```

## Cosmic CMS Integration

This application uses Cosmic CMS with the following Object Types:

### Support Tickets
- **Type**: `support-tickets`
- **Metafields**:
  - `student_name` (text) - Nama mahasiswa
  - `student_email` (text) - Email mahasiswa
  - `student_phone` (text) - Nomor telepon (optional)
  - `category` (select) - BAU, BAA, or MIS
  - `subject` (text) - Judul masalah
  - `description` (textarea) - Detail masalah
  - `status` (select) - Open, In Progress, Resolved, Closed
  - `priority` (select) - Low, Medium, High, Urgent
  - `ticket_number` (text) - Unique ticket ID
  - `assigned_to` (object) - Team member assigned
  - `resolved_at` (date) - Resolution timestamp

### Ticket Messages
- **Type**: `ticket-messages`
- **Metafields**:
  - `ticket` (object) - Related support ticket
  - `sender_name` (text) - Nama pengirim
  - `sender_type` (select) - Student, BAU, BAA, MIS
  - `message` (textarea) - Isi pesan
  - `timestamp` (datetime) - Waktu pengiriman
  - `attachments` (file) - File lampiran (optional)

### Team Members
- **Type**: `team-members`
- **Metafields**:
  - `full_name` (text) - Nama lengkap
  - `email` (text) - Email
  - `department` (select) - BAU, BAA, MIS
  - `role` (text) - Jabatan
  - `photo` (file) - Foto profil
  - `status` (select) - Active, Inactive
  - `specialties` (textarea) - Keahlian khusus

### Categories
- **Type**: `support-categories`
- **Metafields**:
  - `category_name` (text) - Nama kategori
  - `department` (select) - BAU, BAA, MIS
  - `description` (textarea) - Deskripsi
  - `icon` (text) - Icon identifier
  - `color` (text) - Warna kategori

## Deployment Options

### Deploy to Vercel

1. Push your code to GitHub
2. Import repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables Setup

Add these in your Vercel project settings:
- `COSMIC_BUCKET_SLUG`
- `COSMIC_READ_KEY`
- `COSMIC_WRITE_KEY`
- `NEXT_PUBLIC_PUSHER_APP_KEY`
- `NEXT_PUBLIC_PUSHER_CLUSTER`
- `PUSHER_APP_ID`
- `PUSHER_APP_SECRET`

<!-- README_END -->