import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Animated } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { useIsFocused } from '@react-navigation/native'

type Props = {
  score: number
  size?: number
  strokeWidth?: number
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const CircularScore: React.FC<Props> = ({ score, size = 50, strokeWidth = 4 }) => {
  const isFocused = useIsFocused()

  const animatedValue = useRef(new Animated.Value(0)).current
  const [displayScore, setDisplayScore] = useState(0)

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    const listener = animatedValue.addListener(({ value }) => {
      setDisplayScore(Math.round(value))
    })

    return () => {
      animatedValue.removeListener(listener)
    }
  }, [])

  useEffect(() => {
    if (!isFocused) return

    animatedValue.setValue(0)
    setDisplayScore(0)

    Animated.timing(animatedValue, {
      toValue: score,
      duration: 1000,
      useNativeDriver: false,
    }).start()
  }, [isFocused, score])

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  })

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          stroke="rgba(255,255,255,0.1)"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        <AnimatedCircle
          stroke="#00FF85"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>

      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#00FF85', fontWeight: 'bold' }}>{displayScore}</Text>
      </View>
    </View>
  )
}

export default CircularScore
