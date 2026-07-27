export type NotificationType = 'follow' | 'checkin' | 'like'

export interface NotificationItem {
  id: string
  type: NotificationType
  actor: {
    _id: string
    name: string
    picture?: string
  }
  org?: {
    _id: string
    name: string
    image?: string
  }
  createdAt: string
}
