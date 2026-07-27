import React, { useState } from 'react'
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Button, TextInput, useTheme, Text, LocalPush } from '@vyve/ui-native'
import EyeIcon from '../../assets/icons/eye.svg'
import EyeOffIcon from '../../assets/icons/eye-off.svg'
import BackIcon from '../../assets/icons/arrow-left.svg'
import Vyve from '../../assets/icons/vyve.svg'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { t } from '@vyve/gotham-native'
import { signup } from '../../services/auth'
import { useAuthStore } from '../../store/auth/useAuthStore'

export const SignupScreen = () => {
  const navigation = useNavigation<any>()
  const { theme } = useTheme()
  const { setAuth } = useAuthStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [loading, setLoading] = useState(false)

  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [passwordRepeatError, setPasswordRepeatError] = useState(false)

  const [pushVisible, setPushVisible] = useState(false)
  const [pushMessage, setPushMessage] = useState('')
  const [pushType, setPushType] = useState<'success' | 'error' | 'warning' | 'info'>('info')

  const isFormValid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 6 &&
    password === passwordRepeat &&
    !emailError &&
    !passwordError &&
    !passwordRepeatError

  /* ---------------- VALIDATION HANDLERS ---------------- */

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

    if (passwordRepeat.length > 0) {
      setPasswordRepeatError(value !== passwordRepeat)
    }
  }

  const handlePasswordRepeatChange = (value: string) => {
    setPasswordRepeat(value)
    setPasswordRepeatError(password.length > 0 && value !== password)
  }

  /* ---------------- SUBMIT ---------------- */

  const handleSignup = async () => {
    try {
      setLoading(true)

      const data = await signup({
        provider: 'local',
        name,
        email,
        password,
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
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'unknown_error'
      setPushType('error')
      setPushMessage(t(message))
      setPushVisible(true)
    } finally {
      setLoading(false)
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
        {/* BACK BUTTON */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginBottom: theme.spacing.md }}
        >
          <BackIcon width={24} height={24} color={theme.colors.text} />
        </TouchableOpacity>

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
              <Text variant="h2">{t('signup')}</Text>

              <TextInput placeholder={t('name_surname')} value={name} onChangeText={setName} />

              <TextInput
                placeholder={t('email')}
                value={email}
                onChangeText={handleEmailChange}
                autoCapitalize="none"
                keyboardType="email-address"
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

              <TextInput
                placeholder={t('password_repeat')}
                secureTextEntry
                secureToggle
                value={passwordRepeat}
                onChangeText={handlePasswordRepeatChange}
                isError={passwordRepeatError}
                helperText={passwordRepeatError ? t('passwords_not_match') : undefined}
                eyeIcon={<EyeIcon color={theme.colors.text} />}
                eyeOffIcon={<EyeOffIcon color={theme.colors.text} />}
              />
            </View>

            <View style={{ marginTop: theme.spacing.lg }}>
              <Button
                title={t('signup')}
                onPress={handleSignup}
                disabled={!isFormValid}
                loading={loading}
              />
            </View>
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </View>
  )
}
