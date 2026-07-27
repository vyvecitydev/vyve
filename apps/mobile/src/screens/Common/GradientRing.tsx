import React, { useRef, useEffect } from 'react'
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native'
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg'

const { width, height } = Dimensions.get('window')

export const GradientRing = ({
  size = 180,
  strokeWidth = 15,
  color1 = '#FF0000',
  color2 = '#0000FF',
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start()
  }, [])

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  const radius = (size - strokeWidth) / 2

  return (
    <View style={styles.fullscreen}>
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Defs>
            {/* 1. Linear gradient for ring */}
            <LinearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={color1} />
              <Stop offset="100%" stopColor={color2} />
            </LinearGradient>
          </Defs>

          {/* Ana ring */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#ringGrad)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  fullscreen: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'black', // arka planı değiştir
  },
})
