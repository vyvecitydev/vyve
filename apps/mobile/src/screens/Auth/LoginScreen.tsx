import React, { useState } from 'react'
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import {
  Button,
  Divider,
  TextInput,
  useTheme,
  Text,
  LocalPush,
} from '@vyve/ui-native'
import EyeIcon from '../../assets/icons/eye.svg'
import EyeOffIcon from '../../assets/icons/eye-off.svg'
import Vyve from '../../assets/icons/vyve.svg'
import AppleIcon from '../../assets/icons/apple.svg'
import GoogleIcon from '../../assets/icons/google.svg'
import FacebookIcon from '../../assets/icons/facebook.svg'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { t } from '@vyve/gotham-native'
import { googleLogin, login } from '../../services/auth'
import { useAuthStore } from '../../store/auth/useAuthStore'
import { signInWithGoogle } from '../../services/googleAuth'

export const LoginScreen = () => {
  const navigation = useNavigation<any>()
  const { theme } = useTheme()
  const { setAuth } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [loading, setLoading] = useState(false)

  const [pushVisible, setPushVisible] = useState(false)
  const [pushMessage, setPushMessage] = useState('')
  const [pushType, setPushType] =
    useState<'success' | 'error' | 'warning' | 'info'>('info')

  const isFormValid =
    email.trim().length > 0 &&
    password.trim().length >= 6 &&
    !emailError &&
    !passwordError

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (value.trim().length === 0) {
      setEmailError(false)
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setEmailError(!emailRegex.test(value))
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setPasswordError(value.length > 0 && value.length < 6)
  }

  const handleLogin = async () => {
    try {
      setLoading(true)
      const data = await login({ email, password })

      setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })

      navigation.reset({
        index: 0,
        routes: [{ name: 'Profile' }],
      })
    } catch {
      setPushType('error')
      setPushMessage('Kullanıcı adı veya şifre hatalı')
      setPushVisible(true)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const userInfo = await signInWithGoogle()
      if (!userInfo.data?.idToken) throw new Error()

      const data = await googleLogin({
        provider: 'google',
        idToken: userInfo.data.idToken,
      })

      setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })

      navigation.reset({
        index: 0,
        routes: [{ name: 'Profile' }],
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <LocalPush
        visible={pushVisible}
        message={pushMessage}
        type={pushType}
        duration={3000}
        onClose={() => setPushVisible(false)}
      />

      {/* Background */}
      <Image
        source={require('../../assets/images/bg.png')}
        style={[
          StyleSheet.absoluteFill,
          {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
          },
        ]}
      />

      <SafeAreaView style={{ flex: 1, paddingHorizontal: theme.spacing.lg }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAwareScrollView
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            extraScrollHeight={Platform.OS === 'ios' ? 40 : 20}
          >
            <Vyve
              color={theme.colors.primary}
              width={120}
              height={120}
              style={{
                alignSelf: 'center',
                marginVertical: theme.spacing.xl,
              }}
            />

            <View style={{ gap: theme.spacing.sm }}>
              <Text variant="h2">{t('login')}</Text>

              <TextInput
                placeholder={t('email')}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={handleEmailChange}
                isError={emailError}
                helperText={emailError ? t('invalid_email') : undefined}
              />

              <TextInput
                placeholder={t('password')}
                secureTextEntry
                secureToggle
                value={password}
                onChangeText={handlePasswordChange}
                isError={passwordError}
                helperText={passwordError ? t('invalid_password') : undefined}
                eyeIcon={<EyeIcon color={theme.colors.text} />}
                eyeOffIcon={<EyeOffIcon color={theme.colors.text} />}
              />
            </View>

            <Button
              title={t('forgot_password')}
              variant="primary"
              type="text"
              style={{ marginVertical: theme.spacing.md }}
            />

            <View style={{ gap: theme.spacing.sm }}>
              <Button
                title={t('login')}
                onPress={handleLogin}
                disabled={!isFormValid}
                loading={loading}
              />

              <Divider text={t('or')} style={{ marginVertical: theme.spacing.sm }} />

              <Button
                title={t('google_login')}
                variant="primary"
                type="outlined"
                onPress={handleGoogleLogin}
                style={{ borderColor: theme.colors.border }}
                textStyle={{ color: theme.colors.text }}
                iconLeft={<GoogleIcon width={16} height={16} color={theme.colors.text} />}
              />

              <Button
                title={t('facebook_login')}
                variant="primary"
                type="outlined"
                style={{ borderColor: theme.colors.border }}
                textStyle={{ color: theme.colors.text }}
                iconLeft={<FacebookIcon width={16} height={16} color={theme.colors.text} />}
              />

              <Button
                title={t('apple_login')}
                variant="primary"
                type="outlined"
                style={{ borderColor: theme.colors.border }}
                textStyle={{ color: theme.colors.text }}
                iconLeft={<AppleIcon width={16} height={16} color={theme.colors.text} />}
              />
            </View>

            <Button
              title={t('dont_have_account')}
              variant="primary"
              type="text"
              style={{ marginTop: theme.spacing.lg }}
              onPress={() => navigation.navigate('Signup')}
            />
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </View>
  )
}
