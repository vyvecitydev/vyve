import React from 'react'
import { Dimensions } from 'react-native'
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg'
import { useTheme } from '@vyve/ui-native'

const { width, height } = Dimensions.get('window')

export const BackgroundGradient = ({ color }: { color?: string }) => {
  const { theme } = useTheme()

  const gradientColor = color || theme.colors.primary

  return (
    <Svg width={width} height={height} style={{ position: 'absolute' }}>
      <Defs>
        <RadialGradient
          id="grad"
          cx="85%" // sağa yakın
          cy="10%" // yukarı yakın
          rx="80%"
          ry="80%"
        >
          <Stop offset="0%" stopColor={gradientColor} stopOpacity="0.9" />
          <Stop offset="60%" stopColor={gradientColor} stopOpacity="0.4" />
          <Stop offset="100%" stopColor={gradientColor} stopOpacity="0" />
        </RadialGradient>
      </Defs>

      <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
    </Svg>
  )
}
