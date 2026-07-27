import React, { useState } from 'react'
import {
  ActivityIndicator,
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
import CameraIcon from '../../assets/icons/camera.svg'
import Vyve from '../../assets/icons/vyve.svg'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { t } from '@vyve/gotham-native'
import { signup } from '../../services/auth'
import { useAuthStore } from '../../store/auth/useAuthStore'
import { launchImageLibrary } from 'react-native-image-picker'
import { updateProfile, uploadAvatar } from '../../services/profile'
import { API_URL } from '../../services/api'
import CustomHeaderWithTitle from '../../components/CustomHeaderWithTitle'

export const ProfileEditScreen = () => {
  const navigation = useNavigation<any>()
  const { theme } = useTheme()
  const { user, setAuth, accessToken, refreshToken } = useAuthStore()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState(false)

  const [pushVisible, setPushVisible] = useState(false)
  const [pushMessage, setPushMessage] = useState('')
  const [pushType, setPushType] = useState<'success' | 'error' | 'warning' | 'info'>('info')

  const isFormValid = name.trim().length > 0 && email.trim().length > 0 && !emailError

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

  /* ---------------- AVATAR PICKER ---------------- */
  const openImagePicker = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      })
      if (result.didCancel || !result.assets?.[0]) return
      const asset = result.assets[0]

      setLoading(true)
      const file = {
        uri: asset.uri!,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || 'avatar.jpg',
      }

      const data = await uploadAvatar(file)
      setAuth({
        user: { ...user!, picture: data.url },
        accessToken: accessToken!,
        refreshToken: refreshToken!,
      })

      setPushType('success')
      setPushMessage('Profil fotoğrafı güncellendi')
      setPushVisible(true)
    } catch (err) {
      console.error(err)
      setPushType('error')
      setPushMessage('Fotoğraf yüklenemedi')
      setPushVisible(true)
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- SUBMIT ---------------- */
  const handleUpdate = async () => {
    try {
      setLoading(true)
      const data = await updateProfile(name, email, user?.privacy || false)
      console.log('updateProfile', data)
      setAuth({
        user: data.user,
        accessToken: accessToken!,
        refreshToken: refreshToken!,
      })
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

  const profileImageUri = user?.picture
    ? `${API_URL}${user.picture}`
    : 'https://via.placeholder.com/150'

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
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
      <CustomHeaderWithTitle title={t('edit_profile')} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          extraScrollHeight={Platform.OS === 'ios' ? 40 : 20}
        >
          {/* <Text variant="h2">{t('edit_profile')}</Text> */}

          <View style={{ gap: theme.spacing.sm, paddingHorizontal: theme.spacing.lg }}>
            <View style={styles.top}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{
                    uri: profileImageUri,
                  }}
                  style={styles.avatar}
                />
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.colors.primary }]}
                  onPress={openImagePicker}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <CameraIcon width={16} height={16} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <TextInput placeholder={t('name_surname')} value={name} onChangeText={setName} />

            <TextInput
              placeholder={t('email')}
              value={email}
              onChangeText={handleEmailChange}
              autoCapitalize="none"
              keyboardType="email-address"
              isError={emailError}
              disabled={user?.provider !== 'local'}
              helperText={emailError ? t('invalid_email') : undefined}
            />
          </View>

          <View style={{ marginTop: theme.spacing.lg, paddingHorizontal: theme.spacing.lg }}>
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
