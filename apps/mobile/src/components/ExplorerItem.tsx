import React, { useState, useRef, useCallback } from 'react'
import LottieView from 'lottie-react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useAuthStore } from '../store'
import { useFavoritesStore } from '../store/favorites/useFavoritesStore'
import { tapHaptic } from '@vyve/gotham-native'
import { HapticFeedbackTypes } from 'react-native-haptic-feedback'
import LinearGradient from 'react-native-linear-gradient'
import { Animated, Image, StyleSheet, View } from 'react-native'
import { likeOrg, unlikeOrg } from '../services/org'
import { colorWithOpacity } from '@vyve/gotham'
import { Text, useTheme } from '@vyve/ui-native'
import { useNavigation } from '@react-navigation/native'

export const ExplorerItem = ({ item }: { item: any }) => {
  const navigation = useNavigation<any>()
  const { theme } = useTheme()
  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => navigation.navigate('CompanyDetails', { item }))

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDelay(100)
    .onEnd(() => {
      tapHaptic(HapticFeedbackTypes.impactMedium)
    //   playAnimation(index)
      onLikePress(item)
    })

  const gesture = Gesture.Exclusive(doubleTap, singleTap)

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

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={styles.boxContainer}>
        <Image source={{ uri: item?.imageUrl }} style={styles.box} />

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
          style={[styles.gradient, styles.bottomGradient, { height: `${item?.percent}%` }]}
        />

        <Text style={styles.text} variant="h6">
          {item?.text}
        </Text>
        <Text variant="body2" style={styles.distanceText}>
          {item?.distanceText}
        </Text>
        {/* <Text style={styles.capacity}>{item.capacity}</Text> */}

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{`${item?.percent}%`}</Text>
        </View>

        {/* {activeAnimation === index && (
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
        )} */}
      </Animated.View>
    </GestureDetector>
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
