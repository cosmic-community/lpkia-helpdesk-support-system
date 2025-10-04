interface WhatsAppMessage {
  target: string // Phone number with country code (e.g., "6281234567890")
  message: string
}

interface TicketCreatedNotification {
  ticketNumber: string
  studentName: string
  category: string
  subject: string
  description: string
}

interface MessageNotification {
  ticketNumber: string
  senderName: string
  senderType: string
  message: string
  recipientType: 'student' | 'support'
}

/**
 * Send WhatsApp message using Fonnte API
 */
export async function sendWhatsAppMessage(
  phoneNumber: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  const FONNTE_TOKEN = process.env.FONNTE_API_TOKEN

  if (!FONNTE_TOKEN) {
    console.error('FONNTE_API_TOKEN not configured')
    return { success: false, error: 'WhatsApp service not configured' }
  }

  // Clean phone number (remove spaces, dashes, plus signs)
  const cleanPhone = phoneNumber.replace(/[\s\-+]/g, '')
  
  // Ensure phone starts with country code (62 for Indonesia)
  const targetPhone = cleanPhone.startsWith('62') 
    ? cleanPhone 
    : cleanPhone.startsWith('0')
    ? '62' + cleanPhone.substring(1)
    : '62' + cleanPhone

  try {
    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': FONNTE_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target: targetPhone,
        message: message,
        countryCode: '62', // Indonesia
      }),
    })

    const result = await response.json()

    if (result.status === true || response.ok) {
      console.log('WhatsApp message sent successfully to', targetPhone)
      return { success: true }
    } else {
      console.error('Failed to send WhatsApp message:', result)
      return { success: false, error: result.reason || 'Unknown error' }
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    return { success: false, error: 'Network error' }
  }
}

/**
 * Send ticket creation notification to student
 */
export async function notifyTicketCreated(
  phoneNumber: string,
  data: TicketCreatedNotification
): Promise<void> {
  const message = `
🎫 *Tiket Support LPKIA Berhasil Dibuat*

Halo ${data.studentName},

Tiket support Anda telah berhasil dibuat dengan detail:

📋 *Nomor Tiket:* ${data.ticketNumber}
🏢 *Kategori:* ${data.category}
📝 *Subjek:* ${data.subject}

Simpan nomor tiket ini untuk melacak status tiket Anda.

Tim ${data.category} akan segera menangani masalah Anda. Anda akan menerima notifikasi WhatsApp saat ada update.

Terima kasih,
*LPKIA Helpdesk Support System*
  `.trim()

  await sendWhatsAppMessage(phoneNumber, message)
}

/**
 * Send message notification (reply from support team or student)
 */
export async function notifyNewMessage(
  phoneNumber: string,
  data: MessageNotification
): Promise<void> {
  let message: string

  if (data.recipientType === 'student') {
    // Notification for student (reply from support team)
    message = `
💬 *Balasan Baru dari Tim ${data.senderType}*

Tiket: ${data.ticketNumber}
Dari: ${data.senderName} (Tim ${data.senderType})

${data.message}

---
Balas pesan ini melalui website:
https://lpkia-helpdesk.vercel.app/ticket/${data.ticketNumber}

*LPKIA Helpdesk Support System*
    `.trim()
  } else {
    // Notification for support team (message from student)
    message = `
📨 *Pesan Baru dari Mahasiswa*

Tiket: ${data.ticketNumber}
Dari: ${data.senderName}

${data.message}

---
Balas melalui dashboard admin:
https://lpkia-helpdesk.vercel.app/ticket/${data.ticketNumber}

*LPKIA Helpdesk Support System*
    `.trim()
  }

  await sendWhatsAppMessage(phoneNumber, message)
}

/**
 * Get support team phone numbers by category
 */
export function getSupportTeamPhone(category: string): string | null {
  const phones = {
    BAU: process.env.WHATSAPP_BAU_PHONE || null,
    BAA: process.env.WHATSAPP_BAA_PHONE || null,
    MIS: process.env.WHATSAPP_MIS_PHONE || null,
  }

  return phones[category as keyof typeof phones] || null
}