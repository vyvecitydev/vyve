import Geolocation from '@react-native-community/geolocation'

const GOOGLE_MAPS_API_KEY = 'AIzaSyA3P6A8wCkgr_slFmIz5dcatbmfRYY7YBA'

export function getUserLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    )
  })
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=tr&key=${GOOGLE_MAPS_API_KEY}`,
    )

    const json = await res.json()

    if (json.results?.length) {
      return json.results[0].formatted_address
    }

    return null
  } catch (e) {
    console.error('Reverse geocode failed', e)
    return null
  }
}
