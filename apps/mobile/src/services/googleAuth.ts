import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { Platform } from 'react-native'

GoogleSignin.configure({
  webClientId: '495645000798-0adpgdgpgmbn9b49bmbs2n3raoj2vltr.apps.googleusercontent.com', // Google Cloud Console web client ID
  offlineAccess: true,
  iosClientId: '495645000798-g0rmbg3hr3hpo8vc3fratqgg1q0oko17.apps.googleusercontent.com', // iOS için client ID
})

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices()
    const userInfo = await GoogleSignin.signIn()
    return userInfo
  } catch (error: any) {
    console.error('Google SignIn Error:', error)
    throw error
  }
}
