// gotham-native/src/permissions/permissionsService.ts
import { Platform } from 'react-native'
import {
  check,
  request,
  checkNotifications,
  requestNotifications,
  PERMISSIONS,
  RESULTS,
  PermissionStatus as RNPermissionStatus,
} from 'react-native-permissions'

export type PermissionKey = 'camera' | 'microphone' | 'location' | 'notifications' | 'motion'
export type PermissionStatus = 'unknown' | 'granted' | 'denied' | 'blocked'

const mapStatus = (status: RNPermissionStatus): PermissionStatus => {
  switch (status) {
    case RESULTS.GRANTED:
      return 'granted'
    case RESULTS.DENIED:
      return 'denied'
    case RESULTS.BLOCKED:
      return 'blocked'
    default:
      return 'unknown'
  }
}

const getNativePermission = (key: PermissionKey) => {
  switch (key) {
    case 'camera':
      return Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
      })!
    case 'microphone':
      return Platform.select({
        ios: PERMISSIONS.IOS.MICROPHONE,
        android: PERMISSIONS.ANDROID.RECORD_AUDIO,
      })!
    case 'location':
      return Platform.select({
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      })!
    case 'motion':
      return Platform.select({
        ios: PERMISSIONS.IOS.MOTION,
        android: null, // Android'de motion izni yok
      })!
    case 'notifications':
      return null // notifications ayrı API ile işlenecek
  }
}

// Mevcut izin durumunu kontrol et
export const checkPermission = async (key: PermissionKey): Promise<PermissionStatus> => {
  if (key === 'notifications') {
    const { status } = await checkNotifications()
    return mapStatus(status)
  }
  const nativePermission = getNativePermission(key)!
  const status = await check(nativePermission)
  return mapStatus(status)
}

// Kullanıcıdan izin isteme
export const requestPermission = async (key: PermissionKey): Promise<PermissionStatus> => {
  if (key === 'notifications') {
    const { status } = await requestNotifications(['alert', 'sound'])
    return mapStatus(status)
  }
  const nativePermission = getNativePermission(key)!
  const status = await request(nativePermission)
  return mapStatus(status)
}
