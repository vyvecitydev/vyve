import { useTheme } from '@vyve/ui-native/dist/hooks/useTheme'
import LottieView from 'lottie-react-native'
import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native'

type Variant = 'chill' | 'live' | 'rush'

type Props = {
  placeName: string
  vibe: string
  variant?: Variant
  onPress?: () => void
}

const VARIANT_STYLES = {
  rush: {
    bg: 'rgba(30, 58, 138, 0.12)', // deep navy glass
    border: 'rgba(30, 58, 138, 0.35)', // controlled outline
    shadow: '#1E3A8A', // deep blue glow
    vibe: '#93C5FD', // soft sky-blue text for contrast
    button: 'rgba(30, 58, 138, 0.20)', // subtle interaction
  },
  //   rush: {
  //     bg: 'rgba(140,82,255,0.15)',
  //     border: 'rgba(140,82,255,0.4)',
  //     shadow: '#b996ff',
  //     vibe: '#BFA6FF',
  //     button: 'rgba(140,82,255,0.2)',
  //   },
  //   rush: {
  //     bg: 'rgba(249,115,22,0.12)',
  //     border: 'rgba(249,115,22,0.4)',
  //     shadow: '#fb923c',
  //     vibe: '#fdba74',
  //     button: 'rgba(249,115,22,0.2)',
  //   },
}

const LOTTIE_BY_VARIANT = {
  chill: require('../assets/lotties/chill.json'),
  live: require('../assets/lotties/normal.json'),
  rush: require('../assets/lotties/enerjik.json'),
}

const LiveCard: React.FC<Props> = ({ placeName, vibe, variant = 'rush', onPress }) => {
  const glowAnim = useRef(new Animated.Value(0.3)).current
  const colors = VARIANT_STYLES[variant]

  const { theme } = useTheme()

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    ).start()
  }, [])

  const lottieSource = LOTTIE_BY_VARIANT[variant]

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          shadowColor: colors.shadow,
          shadowOpacity: glowAnim,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.place, { color: theme.colors.text }]}>{placeName}</Text>

          <View style={styles.vibeRow}>
            {/* <LottieView source={lottieSource} autoPlay loop style={{ width: 24, height: 24 }} /> */}
            <Text style={[styles.vibe, { color: colors.vibe }]}>{vibe}</Text>
          </View>
        </View>

        {/* <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: colors.button,
              borderColor: colors.border,
            },
          ]}
          onPress={onPress}
        >
          <Text style={styles.buttonText}>Keşfet</Text>
        </TouchableOpacity> */}
      </View>
    </Animated.View>
  )
}

export default LiveCard

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 16,
    
    borderRadius: 16,
    // borderWidth: 1,
    shadowRadius: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  place: {
    fontSize: 16,
    fontWeight: '700',
  },
  vibeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  vibe: {
    fontSize: 13,
    marginTop: 2,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginLeft: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
})
