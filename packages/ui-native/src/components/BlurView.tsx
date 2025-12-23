import React from 'react'
import { Platform, View, ViewStyle, useColorScheme } from 'react-native'
import { useTheme } from '../theme'

let RNBlurView: any
try {
  RNBlurView = require('@react-native-community/blur').BlurView
} catch (e) {
  RNBlurView = null
}

export interface BlurViewProps {
  /** Blur tipi override */
  blurType?: 'light' | 'dark' | 'extraLight' | 'prominent' | 'regular'
  blurAmount?: number
  fallbackColor?: string
  style?: ViewStyle | ViewStyle[]
  children?: React.ReactNode
}

export const BlurView: React.FC<BlurViewProps> = ({
  blurType,
  blurAmount = 10,
  fallbackColor,
  style,
  children,
}) => {
  const { theme } = useTheme() // dark / light

  const computedBlurType = !blurType
    ? theme.mode === 'dark'
      ? 'dark'
      : 'light'
    : blurType || 'light'

  const computedFallback =
    fallbackColor ?? (computedBlurType === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)')

  // if (Platform.OS === 'ios' && RNBlurView) {
  return (
    <RNBlurView
      blurType={computedBlurType}
      blurAmount={blurAmount}
      reducedTransparencyFallbackColor={computedFallback}
      style={style}
    >
      {children}
    </RNBlurView>
  )
  // }

  // Android veya native modül yoksa fallback
  // return (
  //   <View style={[style, { backgroundColor: computedFallback, overflow: 'hidden' }]}>
  //     {children}
  //   </View>
  // )
}
