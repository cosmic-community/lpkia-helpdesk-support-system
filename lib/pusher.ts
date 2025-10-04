import Pusher from 'pusher'
import PusherClient from 'pusher-js'

// Server-side Pusher instance - lazy initialization
let pusherServerInstance: Pusher | null = null

export const getPusherServer = () => {
  if (!pusherServerInstance) {
    pusherServerInstance = new Pusher({
      appId: process.env.PUSHER_APP_ID as string,
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
      secret: process.env.PUSHER_APP_SECRET as string,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
      useTLS: true,
    })
  }
  return pusherServerInstance
}

// Client-side Pusher instance - lazy initialization
let pusherClientInstance: PusherClient | null = null

export const getPusherClient = () => {
  if (typeof window === 'undefined') {
    throw new Error('Pusher client can only be initialized on the client side')
  }
  
  if (!pusherClientInstance) {
    const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER
    
    if (!key || !cluster) {
      throw new Error('Pusher configuration is missing')
    }
    
    pusherClientInstance = new PusherClient(key, {
      cluster: cluster,
    })
  }
  return pusherClientInstance
}

// Trigger notification
export async function triggerNotification(channel: string, event: string, data: any) {
  try {
    const pusherServer = getPusherServer()
    await pusherServer.trigger(channel, event, data)
  } catch (error) {
    console.error('Failed to trigger notification:', error)
  }
}