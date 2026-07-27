import React, { useState } from 'react'
import { View, FlatList, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Text, useTheme } from '@vyve/ui-native'
import { useAuthStore } from '../../store/auth/useAuthStore'
import BackIcon from '../../assets/icons/arrow-left2.svg'
import PlusIcon from '../../assets/icons/plus.svg'
import HeartIcon from '../../assets/icons/heart.svg'
import Dart2con from '../../assets/icons/dart2.svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNotificationsStore } from '../../store/notifications'

const dumyData = [
  { id: 1, name: 'Anıl Kerimoğlu', type: 1 },
  { id: 2, name: 'Ulaş Akbal', type: 2 },
  { id: 3, name: 'Serkan Aysan', type: 3 },
  { id: 1, name: 'Anıl Kerimoğlu', type: 1 },
  { id: 2, name: 'Ulaş Akbal', type: 2 },
  { id: 3, name: 'Serkan Aysan', type: 3 },
  { id: 1, name: 'Anıl Kerimoğlu', type: 1 },
  { id: 2, name: 'Ulaş Akbal', type: 2 },
  { id: 3, name: 'Serkan Aysan', type: 3 },
  { id: 1, name: 'Anıl Kerimoğlu', type: 1 },
  { id: 2, name: 'Ulaş Akbal', type: 2 },
  { id: 3, name: 'Serkan Aysan', type: 3 },
]

export const NotificationScreen = () => {
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const { theme } = useTheme()
  const navigation = useNavigation<any>()
  const { user } = useAuthStore()
  const notifications = useNotificationsStore((state) => state.notifications)

  console.log('notifications', notifications)

  const insets = useSafeAreaInsets()

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
      <View
        style={{
          backgroundColor: 'transparent',
          // position: 'absolute',
          zIndex: 2,
          height: 50,
          width: 50,
          marginTop: insets.top,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity onPress={navigation.goBack} hitSlop={8} activeOpacity={0.7}>
          <BackIcon color={theme.colors.text} height={20} width={20} />
        </TouchableOpacity>
      </View>
      <FlatList
        style={{ marginHorizontal: theme.spacing.lg }}
        data={notifications?.data}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <>
            {item.type === 'follow' ? (
              <View style={{ display: 'flex', flexDirection: 'row', gap: theme.spacing.lg }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <View style={[styles.avatarWrapper]}>
                    <Image
                      source={{
                        uri: 'https://picsum.photos/400/500?1',
                      }}
                      style={[styles.avatar, { borderColor: theme.colors.primary, borderWidth: 2 }]}
                    />

                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: theme.colors.primary }]}
                      // onPress={openImagePicker}
                      // disabled={loading}
                    >
                      <PlusIcon width={12} height={12} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  <View style={{ width: 2, backgroundColor: theme.colors.border }} />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                  }}
                >
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Text variant="body1" style={{ color: theme.colors.text, fontWeight: 'bold' }}>
                      {item.actor.name}
                      {` `}
                    </Text>
                    <Text variant="body1" style={{ color: theme.colors.text }}>
                      started following you.
                    </Text>
                  </View>
                  <View>
                    <Text variant="body2" style={{ color: theme.colors.textSecondary }}>
                      2h ago
                    </Text>
                  </View>
                </View>
              </View>
            ) : item.type === 'checkin' ? (
              <View style={{ display: 'flex', flexDirection: 'row', gap: theme.spacing.lg }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <View style={[styles.avatarWrapper]}>
                    <Image
                      source={{
                        uri: 'https://picsum.photos/400/500?1',
                      }}
                      style={[styles.avatar, { borderColor: theme.colors.primary, borderWidth: 2 }]}
                    />
                  </View>
                  <View style={{ width: 2, backgroundColor: theme.colors.border }} />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                  }}
                >
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Text variant="body1" style={{ color: theme.colors.text, fontWeight: 'bold' }}>
                      {item.actor.name}
                      {` `}
                    </Text>
                    <Text variant="body1" style={{ color: theme.colors.text }}>
                      marked Chill rooftop
                    </Text>
                  </View>
                  <View>
                    <View
                      style={{
                        // height: 40,
                        // width: 80,
                        // backgroundColor: theme.colors.backgroundSecondary,
                        borderRadius: theme.radius.md,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // paddingHorizontal: theme.spacing.sm,
                        paddingVertical: theme.spacing.xs,
                        gap: theme.spacing.sm,
                      }}
                    >
                      <Dart2con width={16} height={16} color={theme.colors.text} />
                      <Text variant="body2" style={{ color: theme.colors.textSecondary }}>
                        Chill rooftop 72%
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text variant="body2" style={{ color: theme.colors.textSecondary }}>
                      2h ago
                    </Text>
                  </View>
                </View>
                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    source={{
                      uri: 'https://picsum.photos/400/500?1',
                    }}
                    style={{ width: 64, height: 64, borderRadius: 8 }}
                  />
                </View>
              </View>
            ) : (
              <View style={{ display: 'flex', flexDirection: 'row', gap: theme.spacing.lg }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <View style={[styles.avatarWrapper]}>
                    <Image
                      source={{
                        uri: 'https://picsum.photos/400/500?1',
                      }}
                      style={[styles.avatar, { borderColor: theme.colors.primary, borderWidth: 2 }]}
                    />
                  </View>
                  <View style={{ width: 2, backgroundColor: theme.colors.border }} />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                  }}
                >
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Text variant="body1" style={{ color: theme.colors.text, fontWeight: 'bold' }}>
                      {item.actor.name}
                      {` `}
                    </Text>
                    <Text variant="body1" style={{ color: theme.colors.text }}>
                      liked Chill rooftop
                    </Text>
                  </View>
                  <View>
                    <View
                      style={{
                        // height: 40,
                        // width: 80,
                        // backgroundColor: theme.colors.backgroundSecondary,
                        borderRadius: theme.radius.md,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // paddingHorizontal: theme.spacing.sm,
                        paddingVertical: theme.spacing.xs,
                        gap: theme.spacing.sm,
                      }}
                    >
                      <HeartIcon
                        width={16}
                        height={16}
                        color={theme.colors.danger}
                        fill={theme.colors.danger}
                      />
                      <Text variant="body2" style={{ color: theme.colors.textSecondary }}>
                        Chill rooftop
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text variant="body2" style={{ color: theme.colors.textSecondary }}>
                      2h ago
                    </Text>
                  </View>
                </View>
                {/* <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={{
                    uri: 'https://picsum.photos/400/500?1',
                  }}
                  style={{ width: 64, height: 64, borderRadius: 8 }}
                />
              </View> */}
              </View>
            )}
            <View style={[{ width: 72 }]}>
              <View
                style={{
                  width: 2,
                  height: 48,
                  backgroundColor: theme.colors.border,
                  alignSelf: 'center',
                }}
              />
            </View>
          </>
        )}
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
