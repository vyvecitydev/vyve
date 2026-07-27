import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  FlatList,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Text, Select, useTheme, Button } from '@vyve/ui-native'
import { useThemeModeStore } from '../../store/themeMode/useThemeModeStore'
import { useTranslation, getLanguage, setLanguage } from '@vyve/gotham-native'
import { useAuthStore } from '../../store/auth/useAuthStore'
import BackIcon from '../../assets/icons/arrow-left2.svg'
import PlusIcon from '../../assets/icons/plus.svg'
import LocationIcon from '../../assets/icons/location.svg'
import HeartIcon from '../../assets/icons/heart.svg'
import Dart2con from '../../assets/icons/dart2.svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import CustomHeaderWithTitle from '../../components/CustomHeaderWithTitle'
import { api } from '../../services/api'
import { followUser, unfollowUser } from '../../services/user'

export const UserListScreen = () => {
  const { theme } = useTheme()
  const navigation = useNavigation<any>()
  const { user } = useAuthStore()

  const { t } = useTranslation()

  const insets = useSafeAreaInsets()

  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const getUsers = async (page = 1) => {
    const res = await api.get(`/api/user/?page=${page}`)
    return res.data
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)

      const data = await getUsers()

      setUsers(data)
    } catch (err) {
      console.error('User fetch error', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const toggleFollow = async (userItem: any) => {
    try {
      if (userItem.isFollowing) {
        await unfollowUser(userItem._id)
      } else {
        await followUser(userItem._id)
      }

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userItem._id ? { ...u, isFollowing: !userItem.isFollowing } : u,
        ),
      )
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <View>
      <Image
        source={require('../../assets/images/bg.png')}
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: theme.colors.background,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
          },
        ]}
      />
      {/* HEADER */}
      <CustomHeaderWithTitle title="User List" />
      <FlatList
        style={{ marginHorizontal: theme.spacing.lg }}
        data={users}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const isFollowing = item.isFollowing

          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: theme.spacing.md,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
              }}
            >
              {/* LEFT */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
                <Image
                  source={{ uri: item.picture }}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: '#DDD',
                  }}
                />

                <View>
                  <Text variant="body1" style={{ fontWeight: 'bold' }}>
                    {item.name}
                  </Text>

                  <Text variant="body2" style={{ color: theme.colors.textSecondary }}>
                    {item.followersCount} followers
                  </Text>
                </View>
              </View>

              {/* RIGHT */}
              <TouchableOpacity
                onPress={() => toggleFollow(item)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: isFollowing ? theme.colors.border : theme.colors.primary,
                }}
              >
                <Text
                  variant="body2"
                  style={{
                    color: isFollowing ? theme.colors.text : '#fff',
                    fontWeight: 'bold',
                  }}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
            </View>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  avatarWrapper: {
    width: 72,
    height: 72,
  },

  right: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#DDD',
  },

  button: {
    width: 24,
    height: 24,
    borderRadius: 24 / 2,
    position: 'absolute',
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
