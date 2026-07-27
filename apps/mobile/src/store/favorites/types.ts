export interface FavoriteOrg {
  _id: string
  text: string
  imageUrl?: string
  likeCount: number
  photos?: string[]
  percent?: number
  tags?: string[]
  address?: string
  description?: string
  phone?: string
  capacity?: number
  currentOccupancy?: number
  location?: {
    type: 'Point'
    coordinates: [number, number]
  }
}
