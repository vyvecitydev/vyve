export interface LocationState {
  location: {
    latitude: number
    longitude: number
  } | null
  setLocation: (lat: number, lng: number) => void
}