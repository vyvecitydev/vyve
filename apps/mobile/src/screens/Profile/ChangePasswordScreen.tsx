import React, { useState } from 'react'
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Button, TextInput, useTheme, Text, LocalPush } from '@vyve/ui-native'
import EyeIcon from '../../assets/icons/eye.svg'
import EyeOffIcon from '../../assets/icons/eye-off.svg'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { t } from '@vyve/gotham-native'
import { useAuthStore } from '../../store/auth/useAuthStore'

import { changePassword } from '../../services/profile'

export const ChangePasswordScreen = () => {
  const navigation = useNavigation<any>()
  const { theme } = useTheme()
  const { user, setAuth, accessToken, refreshToken } = useAuthStore()
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [passwordRepeatError, setPasswordRepeatError] = useState(false)

  const [pushVisible, setPushVisible] = useState(false)
  const [pushMessage, setPushMessage] = useState('')
  const [pushType, setPushType] = useState<'success' | 'error' | 'warning' | 'info'>('info')

  const isFormValid =
    (!password || (password.length >= 6 && password === passwordRepeat)) &&
    !passwordError &&
    !passwordRepeatError

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
  const handleUpdate = async () => {
    try {
      setLoading(true)

      // Eğer password girilmişse, önce password değiştir
      if (password && user?.provider === 'local') {
        await changePassword(password)
      }

      navigation.reset({ index: 0, routes: [{ name: 'Profile' }] })
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
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.lg,
      }}
    >
      <LocalPush
        visible={pushVisible}
        message={pushMessage}
        type={pushType}
        duration={3000}
        onClose={() => setPushVisible(false)}
      />

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

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          extraScrollHeight={Platform.OS === 'ios' ? 40 : 20}
        >
          <Text variant="h2">{t('change_password')}</Text>
          <View style={{ gap: theme.spacing.sm, marginTop: theme.spacing.lg }}>
            {user?.provider === 'local' && (
              <>
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
              </>
            )}
          </View>

          <View style={{ marginTop: theme.spacing.lg }}>
            <Button
              title={t('save')}
              onPress={handleUpdate}
              disabled={!isFormValid}
              loading={loading}
            />
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </View>
  )
}

const SIZE = 90
const BUTTON_SIZE = 32

const styles = StyleSheet.create({
  top: {
    alignItems: 'center',
  },

  avatarWrapper: {
    width: SIZE,
    height: SIZE,
    marginVertical: 16,
  },

  avatar: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: '#DDD',
  },

  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    position: 'absolute',
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
