import { useNavigation } from '@react-navigation/native'
import { colorWithOpacity } from '@vyve/gotham'
import { useTheme, Text } from '@vyve/ui-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { View, Image, StyleSheet, Dimensions, Animated } from 'react-native'
import { FlexGrid } from 'react-native-flexible-grid'
import LinearGradient from 'react-native-linear-gradient'
import { getOrgs, likeOrg, unlikeOrg } from '../services/org'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import { useAuthStore } from '../store'
import { useFavoritesStore } from '../store/favorites/useFavoritesStore'
import { tapHaptic } from '@vyve/gotham-native'
import { HapticFeedbackTypes } from 'react-native-haptic-feedback'

const ratioPattern = [
  { widthRatio: 1, heightRatio: 1 },
  { widthRatio: 1, heightRatio: 1 },
  { widthRatio: 1, heightRatio: 2 },
  { widthRatio: 1, heightRatio: 1 },
  { widthRatio: 1, heightRatio: 1 },
  { widthRatio: 1, heightRatio: 2 },
  { widthRatio: 1, heightRatio: 1 },
  { widthRatio: 1, heightRatio: 1 },
  { widthRatio: 1, heightRatio: 1 },
  { widthRatio: 1, heightRatio: 1 },
]

const getRatio = (index: number) => ratioPattern[index % ratioPattern.length]

type ExploreGridProps = {
  searchPayload?: any[]
}

export default function ExploreGrid({ searchPayload }: ExploreGridProps) {
  const navigation = useNavigation<any>()
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()

  const [data, setData] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const fetchData = async (pageNumber = 1, isRefresh = false, payload?: any[]) => {
    try {
      let result
      if (payload) result = { data: payload }
      else result = await getOrgs()

      console.log('result', result)

      const mapped = result.data.map((org: any, index: number) => {
        const ratio = getRatio(isRefresh ? index : data.length + index)
        return {
          _id: org._id,
          text: org.text,
          imageUrl: org.imageUrl,
          percent: org.percent,
          photos: org.photos, // artık ekli
          tags: org.tags,
          description: org.description,
          phone: org.phone,
          address: org.address,
          widthRatio: ratio.widthRatio,
          heightRatio: ratio.heightRatio,
          distanceText: org.distanceText || '0 m',
          capacity: org.capacity || '0',
          location: org.location,
          likeCount: org.likeCount,
        }
      })

      setHasMore(mapped.length > 0)
      setData((prev) => (isRefresh ? mapped : [...prev, ...mapped]))
    } catch (e) {
      console.log('Get Orgs Error:', e)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    if (searchPayload) fetchData(1, true, searchPayload)
    else fetchData(1)
  }, [searchPayload])

  const loadMore = () => {
    if (loadingMore || !hasMore) return
    const nextPage = page + 1
    setPage(nextPage)
    setLoadingMore(true)
    fetchData(nextPage)
  }

  // 🔹 Animasyon state
  const [activeAnimation, setActiveAnimation] = useState<number | null>(null)
  const fadeAnim = useRef(new Animated.Value(0)).current

  const playAnimation = (index: number) => {
    setActiveAnimation(index)
    fadeAnim.setValue(0)
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 400, delay: 300, useNativeDriver: true }),
    ]).start(() => setActiveAnimation(null))
  }

  const user = useAuthStore((state) => state.user)

  const favorites = useFavoritesStore((state) => state.favorites)

  const onLikePress = useCallback(
    async (item: any) => {
      console.log('item', item)
      if (!user) return

      const isFavorite = favorites.some((fav) => fav._id === item._id)

      const store = useFavoritesStore.getState()
      const wasFavorite = isFavorite

      // ✅ 1. OPTIMISTIC UPDATE (ANINDA)
      if (wasFavorite) {
        store.deleteFavorite(item._id)
      } else {
        store.appendFavorite({ ...item, likedAt: new Date().toISOString() })
      }

      try {
        // ✅ 2. BACKEND
        if (wasFavorite) {
          await unlikeOrg(item._id)
        } else {
          await likeOrg(item._id)
        }
      } catch (e) {
        // ❌ 3. HATA → GERİ AL
        console.log('LIKE ERROR', e)

        if (wasFavorite) {
          store.appendFavorite({ ...item, likedAt: new Date().toISOString() })
        } else {
          store.deleteFavorite(item._id)
        }
      }
    },
    [favorites, user],
  )

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const singleTap = Gesture.Tap()
      .numberOfTaps(1)
      .onEnd(() => navigation.navigate('CompanyDetails', { item }))

    const doubleTap = Gesture.Tap()
      .numberOfTaps(2)
      .maxDelay(100)
      .onEnd(() => {
        tapHaptic(HapticFeedbackTypes.impactMedium)
        playAnimation(index)
        onLikePress(item)
      })

    const gesture = Gesture.Exclusive(doubleTap, singleTap)

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={styles.boxContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.box} />

          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent']}
            style={[styles.gradient, styles.topGradient]}
          />

          <LinearGradient
            colors={[
              'transparent',
              colorWithOpacity(theme.colors.primary, 0.2),
              colorWithOpacity(theme.colors.primary, 0.4),
              colorWithOpacity(theme.colors.primary, 0.8),
            ]}
            style={[styles.gradient, styles.bottomGradient, { height: `${item.percent}%` }]}
          />

          <Text style={styles.text} variant="h6">
            {item.text}
          </Text>
          <Text variant="body2" style={styles.distanceText}>
            {item.distanceText}
          </Text>
          {/* <Text style={styles.capacity}>{item.capacity}</Text> */}

          <View style={styles.badge}>
            <Text style={styles.badgeText}>{`${item.percent}%`}</Text>
          </View>

          {activeAnimation === index && (
            <Animated.View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: [{ translateX: -90 }, { translateY: -90 }],
                opacity: fadeAnim,
              }}
            >
              <LottieView
                source={require('../assets/lotties/explorer-like.json')}
                autoPlay
                loop={false}
                style={{ width: 180, height: 180 }}
              />
            </Animated.View>
          )}
        </Animated.View>
      </GestureDetector>
    )
  }
  type ExploreItem = {
    id: string
    imageUrl: string
    ratio: '1:1' | '1:2' // normal / uzun
  }

  const GAP = 2
  const NUM_COLUMNS = 3
  const SCREEN_WIDTH = Dimensions.get('window').width

  const ITEM_WIDTH = (SCREEN_WIDTH - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS

  const getItemHeight = (ratio: '1:1' | '1:2') => {
    if (ratio === '1:2') return ITEM_WIDTH * 2 + GAP
    return ITEM_WIDTH
  }

  const ExploreItem = ({ item }: { item: ExploreItem }) => {
    const height = getItemHeight(item.ratio)
    console.log('item', item)
    return (
      <View style={{ width: ITEM_WIDTH, height, marginBottom: GAP }}>
        <Image
          source={{ uri: item.imageUrl }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>
    )
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      {loading ? (
        <Text style={{ textAlign: 'center', marginTop: 30 }}>Loading...</Text>
      ) : (
        <FlexGrid
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => item._id + '-' + index}
          itemSizeUnit={Dimensions.get('window').width / 3}
          maxColumnRatioUnits={3}
          showScrollIndicator={false}
          style={{ flexGrow: 1 }}
          onVerticalEndReached={loadMore}
          onVerticalEndReachedThreshold={0.8}
          FooterComponent={<View style={{ paddingBottom: 60 + insets.bottom }} />}
        />
        // <FlashList
        //   data={data}
        //   renderItem={({ item }) => <ExploreItem item={item} />}
        //   numColumns={3}
        //   style={{ flexGrow: 1 }}
        //   // estimatedItemSize={ITEM_WIDTH}
        //   // renderItem={renderItem}
        //   showsVerticalScrollIndicator={false}
        //   ListFooterComponent={<View style={{ paddingBottom: 60 + insets.bottom }} />}
        // />
      )}
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  boxContainer: {
    flex: 1,
    margin: 2,
    overflow: 'hidden',
  },
  box: { width: '100%', height: '100%' },
  text: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    color: '#fff',
    zIndex: 3,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  distanceText: {
    position: 'absolute',
    top: 28,
    left: 8,
    right: 8,
    color: '#fff',
    zIndex: 3,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    // fontSize: 12
  },
  capacity: {
    position: 'absolute',
    top: 48,
    left: 8,
    right: 8,
    color: '#fff',
    zIndex: 3,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 120,
    zIndex: 2,
  },
  topGradient: { top: 0 },
  bottomGradient: { bottom: 0 },
  badge: {
    position: 'absolute',
    left: '50%',
    marginLeft: -20,
    bottom: 0,
    paddingVertical: 2,
    paddingHorizontal: 4,
    zIndex: 5,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
})
