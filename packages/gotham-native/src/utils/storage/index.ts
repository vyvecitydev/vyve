import AsyncStorage from '@react-native-async-storage/async-storage'

export const setItem = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    console.warn(`Error setting item ${key}:`, e)
  }
}

export const getItem = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key)
  } catch (e) {
    console.warn(`Error getting item ${key}:`, e)
    return null
  }
}
export const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key)
  } catch (e) {
    console.warn(`Error removing item ${key}:`, e)
  }
}
export const clearStorage = async () => {
  try {
    await AsyncStorage.clear()
  } catch (e) {
    console.warn('Error clearing storage:', e)
  }
}
