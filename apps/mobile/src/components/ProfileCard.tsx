import React, { useState } from 'react'
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
import { Text, useTheme, LocalPush } from '@vyve/ui-native'
import CameraIcon from '../assets/icons/camera.svg'
import { useAuthStore, User } from '../store'
import { uploadAvatar } from '../services/profile'
import { API_URL } from '../services/api'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import SettingsIcon from '../assets/icons/settings.svg'
import InstagramIcon from '../assets/icons/instagram.svg'
import HeartIcon from '../assets/icons/heart.svg'
import TiktokIcon from '../assets/icons/tiktok.svg'
import { useNavigation } from '@react-navigation/native'
import NoptificationIcon from '../assets/icons/notification.svg'
import FollowIcon from '../assets/icons/follow.svg'
import UnFollowIcon from '../assets/icons/unfollow.svg'
import { CustomHeader, HEADER_HEIGHT } from './CustomHeader'
import { colorWithOpacity } from '@vyve/gotham'

type Props = {
  profileUser: User | null
}

export const ProfileCard = ({ profileUser }: Props) => {
  const navigation = useNavigation<any>()
  const { theme } = useTheme()
  const { user, setAuth, accessToken, refreshToken } = useAuthStore()
  const insets = useSafeAreaInsets()

  const [loading, setLoading] = useState(false)
  const [pushVisible, setPushVisible] = useState(false)
  const [pushMessage, setPushMessage] = useState('')
  const [pushType, setPushType] = useState<'success' | 'error' | 'warning' | 'info'>('info')

  const isMyProfile = user?.id === profileUser?.id

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

      // Backend'e gönderilecek form-data objesi
      const file = {
        uri: asset.uri!,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || 'avatar.jpg',
      }

      const data = await uploadAvatar(file)

      // AuthStore güncelle
      setAuth({
        user: {
          ...user!,
          picture: data.url,
        },
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

  const profileImageUri = profileUser?.picture
    ? `${API_URL}${profileUser?.picture}`
    : 'https://via.placeholder.com/150'

  return (
    <View
      style={[
        styles.root,
        {
          display: 'flex',
          flexDirection: 'column',
          // backgroundColor: theme.colors.background,
        },
      ]}
    >
      <LocalPush
        visible={pushVisible}
        message={pushMessage}
        type={pushType}
        duration={2500}
        onClose={() => setPushVisible(false)}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',

          gap: theme.spacing.lg,
          marginHorizontal: theme.spacing.lg,
          marginTop: insets.top + theme.spacing.lg,
        }}
      >
        {/* Avatar + Camera */}
        <View style={[styles.left]}>
          <View style={[styles.avatarWrapper]}>
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

        {/* Name + Email */}
        <View style={[styles.right, { gap: theme.spacing.xs }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
            <Text variant="h5">{profileUser?.name}</Text>
            <TouchableOpacity>
              <InstagramIcon width={28} height={28} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity>
              <TiktokIcon width={28} height={28} color={theme.colors.text} />
            </TouchableOpacity>
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Settings')}
                hitSlop={8}
                activeOpacity={0.7}
                style={{ alignSelf: 'flex-end' }}
              >
                <SettingsIcon color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            <View
              style={{
                width: 6,
                height: 6,
                backgroundColor: theme.colors.text,
                borderRadius: 3,
                alignSelf: 'center',
              }}
            ></View>
            <Text variant="body2">{profileUser?.followersCount || 0} Arkadaşlar</Text>
          </View>
          {isMyProfile && (
            <View style={[{ marginTop: theme.spacing.sm }]}>
              <TouchableOpacity
                style={[
                  {
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingVertical: theme.spacing.xs,
                    backgroundColor: colorWithOpacity(theme.colors.primary, 0.3),
                  },
                  styles.buttonContainer,
                ]}
              >
                {/* <FollowIcon width={16} height={16} color={theme.colors.text} /> */}
                <Text variant="body2" style={[{ color: theme.colors.text }]}>
                  Takip Et
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

const SIZE = 72
const BUTTON_SIZE = 32

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    // paddingVertical: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },

  left: {
    alignItems: 'center',
  },

  avatarWrapper: {
    width: SIZE,
    height: SIZE,
  },

  right: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
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

  buttonContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    shadowColor: '#8C52FF',
    shadowRadius: 10,
  },
  followButton: {
    backgroundColor: '#8C52FF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
})
