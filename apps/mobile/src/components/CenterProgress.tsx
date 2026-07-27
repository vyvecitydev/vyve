import { colorWithOpacity } from '@vyve/gotham'
import { Button, Text, useTheme } from '@vyve/ui-native'
import LottieView from 'lottie-react-native'
import React, { useRef, useEffect, use } from 'react'
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native'
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg'

const { width, height } = Dimensions.get('window')

export const CenterProgress = ({
  size = 240,
  strokeWidth = 8,
  color1 = '#FF0000',
  color2 = '#0000FF',
  percent = 50,
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
  const { theme } = useTheme()

  return (
    <View style={styles.fullscreen}>
      {/* <Animated.View
        style={{
          backgroundColor: 'transparent',
        }}
      >
        <Svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{
            transform: [
              { perspective: 800 },
              { rotateX: '70deg' }, // yukarı-aşağı eğim
            ],
          }}
        >
          <Defs>
            <LinearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={color1} />
              <Stop offset={`${percent}%`} stopColor={color2} />
            </LinearGradient>
          </Defs>

          
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
      </Animated.View> */}
      <LottieView
        source={require('../assets/lotties/center-progress.json')}
        autoPlay
        loop
        style={{
          width: size,
          height: size,
          transform: [
            { rotateX: '64deg' }, // yukarı-aşağı eğim
          ],
        }}
      />
      <View
        style={[
          styles.textWrapper,
          // {
          //   transform: [
          //     { rotateX: '64deg' }, // yukarı-aşağı eğim
          //   ],
          // },
        ]}
      >
        <Text variant="h3" style={{ color: colorWithOpacity(theme.colors.text, 0.8) }}>
          {percent}%
        </Text>
      </View>
      {/* <Button
        title="Katıl"
        style={{
          position: 'absolute',
          top: theme.spacing.lg,
          right: theme.spacing.lg,
          backgroundColor: colorWithOpacity(theme.colors.primary, 0.2),
          borderWidth: 0,
          height: 40,
        }}
        textStyle={{ lineHeight: 16 }}
      /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  fullscreen: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    // backgroundColor: 'black', // arka planı değiştir
  },
  textWrapper: {
    position: 'absolute',
  },
})
