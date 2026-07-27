import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Image, StyleSheet, Touchable, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { BlurView, Divider, useTheme } from '@vyve/ui-native'
import { FlashList } from '@shopify/flash-list'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Org, useOrgsStore } from '../../store/org/useOrgStore'
import { useAuthStore } from '../../store'
import { useFavoritesStore } from '../../store/favorites/useFavoritesStore'
import { getOrgs, likeOrg, unlikeOrg } from '../../services/org'
import { CustomHeader } from '../../components/CustomHeader'
import LocationIcon from '../../assets/icons/location.svg'
import NotificationIcon from '../../assets/icons/notification.svg'
import SearchIcon from '../../assets/icons/search.svg'
import CompanyRow from '../../components/CompanyRow'
import { Animated } from 'react-native'
import { useSearchStore } from '../../store/search/useSearchStore'
import ActiveFilterBar from '../../components/ActiveFilterBar'
import { TAB_BAR_HEIGHT } from '../../navigation/TabNavigator'
import { ToggleableFilterBar } from '../../components/ToggleableFilterBar'
import FollowIcon from '../../assets/icons/follow.svg'
import { Text } from '@vyve/ui-native'
import { colorWithOpacity } from '@vyve/gotham'

export const HomeScreen = () => {
  const navigation = useNavigation<any>()
  const { theme, setThemeColors } = useTheme()
  const insets = useSafeAreaInsets()
  const user = useAuthStore((state) => state.user)
  const orgs = useOrgsStore((state) => state.orgs)
  const favorites = useFavoritesStore((state) => state.favorites)
  const searchPayload = useSearchStore((state) => state.payload)
  const [refreshing, setRefreshing] = useState(false)

  // 🔹 Animasyon state (stabil)
  const fadeAnims = useRef(orgs.map(() => new Animated.Value(0))).current
  const [activeAnimation, setActiveAnimation] = useState<number | null>(null)

  const playAnimation = useCallback((index: number) => {
    setActiveAnimation(index)
    fadeAnims[index].setValue(0)
    Animated.sequence([
      Animated.timing(fadeAnims[index], { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnims[index], {
        toValue: 0,
        duration: 400,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setActiveAnimation(null))
  }, [])

  const onLikePress = useCallback(
    async (item: Org) => {
      if (!user) return
      const isFavorite = favorites.some((fav) => fav._id === item._id)
      const store = useFavoritesStore.getState()
      const wasFavorite = isFavorite

      if (wasFavorite) store.deleteFavorite(item._id)
      else store.appendFavorite({ ...item })

      try {
        if (wasFavorite) await unlikeOrg(item._id)
        else await likeOrg(item._id)
      } catch (e) {
        if (wasFavorite) store.appendFavorite({ ...item })
        else store.deleteFavorite(item._id)
      }
    },
    [favorites, user],
  )

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true)
      const res = await getOrgs()
      if (res?.success && res.data) {
        useOrgsStore.getState().setOrgs(res.data)
      }
    } catch (e) {
      console.log('REFRESH ERROR', e)
    } finally {
      setRefreshing(false)
    }
  }, [])

  const rows = useMemo(() => {
    const result: { type: 'block'; items: Org[]; startIndex: number }[] = []
    for (let i = 0; i < orgs.length; i += 5) {
      const chunk = orgs.slice(i, i + 5)
      result.push({
        type: 'block',
        items: chunk,
        startIndex: i,
      })
    }
    return result
  }, [orgs])

  const hasActiveFilters = useMemo(() => {
    if (!searchPayload) return false

    return (
      !!searchPayload.text ||
      (searchPayload.tags && searchPayload.tags.length > 0) ||
      (searchPayload.mods && searchPayload.mods.length > 0)
    )
  }, [searchPayload])

  const scrollY = useRef(new Animated.Value(0)).current
  const fadeIn = scrollY.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  })

  const featuredPlaces = [
    {
      id: '1',
      name: 'Cafe Nero',
      image: 'https://digitalvol.com/richmedias/serkan/ads/111.jpeg',
    },
    {
      id: '2',
      name: 'Moc İstanbul',
      image: 'https://digitalvol.com/richmedias/serkan/ads/222.jpeg',
    },
    {
      id: '3',
      name: 'Walter’s Coffee',
      image: 'https://digitalvol.com/richmedias/serkan/ads/333.jpeg',
    },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <CustomHeader
        title="Home"
        left={{
          icon: <SearchIcon color={theme.colors.text} height={20} width={20} />,
          onPress: () => navigation.navigate('Search'),
        }}
        right={[
          // {
          //   icon: <FollowIcon color={theme.colors.text} height={20} width={20} />,
          //   onPress: () => navigation.navigate('UserList'),
          // },
          // {
          //   icon: <LocationIcon color={theme.colors.text} height={20} width={20} />,
          //   onPress: () => navigation.navigate('LocationPicker'),
          // },
          {
            icon: <SearchIcon color={theme.colors.text} height={20} width={20} />,
            onPress: () => navigation.navigate('Search'),
          },
          {
            icon: <NotificationIcon color={theme.colors.text} height={20} width={20} />,
            onPress: () => navigation.navigate('Notification'),
          },
        ]}
      />

      <FlashList
        data={rows}
        renderItem={({ item, index }) => (
          <>
            <CompanyRow
              item={item}
              index={index}
              fadeAnims={fadeAnims}
              activeAnimation={activeAnimation}
              onDoubleTap={playAnimation}
              onLikePress={onLikePress}
              onSingleTap={(item: Org) => navigation.navigate('CompanyDetails', { item })}
            />
            {index === 0 && (
              <View>
                <View style={{ margin: 16 }}>
                  <Divider text="Öne Çıkan Fırsatlar" textPosition="center" />
                </View>
                <View style={{ marginBottom: 16, marginTop: 0, margin: 16 }}>
                  <FlashList
                    data={featuredPlaces}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <View
                        style={{
                          width: 300,
                          marginRight: 10,
                          borderRadius: 8,
                          overflow: 'hidden',
                          backgroundColor: '#222',
                        }}
                      >
                        <Image
                          source={{ uri: item.image }}
                          style={{ width: '100%', height: 128 }}
                        />

                        <View
                          style={{
                            position: 'absolute',
                            bottom: 8,
                            left: 8,
                            right: 8,
                          }}
                        >
                          <Text style={{ color: 'white', fontWeight: '700' }}>{item.name}</Text>
                        </View>
                      </View>
                    )}
                  />
                </View>
              </View>
            )}
          </>
        )}
        keyExtractor={(_, index) => `row-${_.startIndex}`}
        extraData={orgs.length}
        onRefresh={onRefresh}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        ListFooterComponent={
          <View style={{ paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 50 }}></View>
        }
        // onScroll={(e) => {
        //   scrollY.setValue(e.nativeEvent.contentOffset.y)
        // }}
        // scrollEventThrottle={16}
      />
      <View
        pointerEvents="box-none" // çocuklar dokunabilir
        style={{
          position: 'absolute',
          top: 0,
          bottom: TAB_BAR_HEIGHT + insets.bottom + 24,
          left: 0,
          right: 0,
          justifyContent: 'flex-end',
          alignItems: 'center',
          zIndex: 10, // önemli
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('LocationPicker')}
          style={{
            backgroundColor: colorWithOpacity(theme.colors.info, 0.6),
            borderColor: theme.colors.info,
            // borderWidth: 2,
            padding: 12,
            borderRadius: 8,
            elevation: 10, // android için
            zIndex: 20, // ios için
          }}
        >
          {/* <Text variant='h5'>Map</Text> */}
          <LocationIcon color={theme.colors.text} height={18} width={18} />
        </TouchableOpacity>
      </View>

      {/* <View
        style={{
          backgroundColor: 'transparent',
          position: 'absolute',
          bottom: TAB_BAR_HEIGHT + insets.bottom,
          left: 0,
          right: 0,
        }}
      >
        <ToggleableFilterBar />
      </View> */}
    </View>
  )
}
