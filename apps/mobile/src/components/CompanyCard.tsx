// components/CompanyCard.tsx
import React, { memo } from 'react'
import { View, Image, StyleSheet, Animated, ViewStyle } from 'react-native'
import { Text, useTheme } from '@vyve/ui-native'
import LinearGradient from 'react-native-linear-gradient'
import { colorWithOpacity } from '@vyve/gotham'
import LottieView from 'lottie-react-native'

interface CompanyCardProps {
  item: any
  height: number
  style?: ViewStyle

  // gesture / interaction
  onPress?: () => void
  onLike?: () => void

  // animation
  showLikeAnimation?: boolean
  likeOpacity?: Animated.Value
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  item,
  height,
  style,
  onPress,
  onLike,
  showLikeAnimation,
  likeOpacity,
}) => {
  const { theme } = useTheme()

  return (
    <Animated.View
      style={[styles.container, { height }, style, { borderColor: theme.colors.background }]}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />

      {/* TOP GRADIENT */}
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'transparent']}
        style={[styles.gradient, styles.top]}
      />

      {/* BOTTOM PERCENT GRADIENT */}
      <LinearGradient
        colors={[
          'transparent',
          colorWithOpacity(theme.colors.primary, 0.2),
          colorWithOpacity(theme.colors.primary, 0.4),
          colorWithOpacity(theme.colors.primary, 0.8),
        ]}
        style={[styles.gradient, styles.bottom, { height: `${item.percent}%` }]}
      />

      {/* TEXTS */}
      <Text style={styles.title} variant="h6">
        {item.text}
      </Text>

      <Text style={styles.distance} variant="body2">
        {item.distanceText}
      </Text>

      {/* BADGE */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{`${item.percent}%`}</Text>
      </View>

      {/* LIKE ANIMATION */}
      {showLikeAnimation && likeOpacity && (
        <Animated.View style={[styles.lottieWrapper, { opacity: likeOpacity }]}>
          <LottieView
            source={require('../assets/lotties/explorer-like.json')}
            autoPlay
            loop={false}
            style={{ width: 180, height: 180 }}
          />
        </Animated.View>
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 2,
  },
  top: { top: 0, height: 120 },
  bottom: { bottom: 0 },
  title: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    color: '#fff',
    zIndex: 3,
  },
  distance: {
    position: 'absolute',
    top: 28,
    left: 8,
    color: '#fff',
    zIndex: 3,
  },
  badge: {
    position: 'absolute',
    left: '50%',
    marginLeft: -20,
    bottom: 0,
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
  lottieWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -90 }, { translateY: -90 }],
    zIndex: 10,
  },
})

export default memo(CompanyCard)
