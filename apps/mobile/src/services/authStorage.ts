import * as Keychain from 'react-native-keychain'

export const saveToken = async (accessToken: string, refreshToken: string) => {
  await Keychain.setGenericPassword('auth', JSON.stringify({ accessToken, refreshToken }))
}

export const getToken = async () => {
  const result = await Keychain.getGenericPassword()
  if (!result) return null
  return JSON.parse(result.password)
}

export const clearToken = async () => {
  await Keychain.resetGenericPassword()
}
