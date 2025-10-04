# LPKIA Helpdesk Support System

A modern, real-time helpdesk support system built with Next.js 15, SQLite database, and WhatsApp integration. This system allows students to create support tickets without login and receive real-time updates via WhatsApp notifications. Support team members can easily respond using username-only authentication.

## ✨ Features

- 📝 **No-Login Ticket Creation** - Students can create tickets without authentication
- 🔍 **Ticket Tracking** - Track tickets using unique ticket ID
- 💬 **Real-time Chat** - Live messaging between students and support teams using Pusher
- 📱 **WhatsApp Notifications** - Automatic WhatsApp notifications for ticket updates
- 🏢 **Multi-Department Support** - BAU, BAA, and MIS departments
- 👤 **Username-Only Authentication** - Support team logs in with username only (no password)
- 📊 **Admin Dashboard** - Manage all tickets and respond to students
- 💾 **Local SQLite Database** - All data stored locally in SQLite
- 🎨 **Modern UI** - Clean, responsive interface with Tailwind CSS
- ⚡ **Real-time Updates** - Instant notifications using Pusher

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: SQLite with better-sqlite3
- **Real-time**: Pusher (WebSocket-based real-time updates)
- **WhatsApp**: Fonnte API (WhatsApp Business API)
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety
- **Package Manager**: Bun

## 📋 Prerequisites

- Node.js 18+ or Bun
- Pusher account ([pusher.com](https://pusher.com)) - Optional for real-time features
- Fonnte account ([fonnte.com](https://fonnte.com)) - For WhatsApp notifications

## 🔧 Setup Instructions

### 1. Clone the Repository