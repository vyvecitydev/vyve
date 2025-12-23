import React from 'react'
import { Text as RNText, StyleSheet, TextStyle, TextProps as RNTextProps } from 'react-native'
import { useTheme } from '../hooks/useTheme'

type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'

interface TextProps extends RNTextProps {
  variant?: TextVariant
  color?: string
  style?: TextStyle | TextStyle[]
  children: React.ReactNode
}

export const Text: React.FC<TextProps> = ({
  variant = 'body1',
  color,
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme?.() ?? { theme: defaultTheme }

  const variantStyle = styles[variant]
  const textColor = color || theme.colors.text

  return (
    <RNText
      {...props}
      style={[{ color: textColor, fontFamily: getFontFamily(variant) }, variantStyle, style]}
    >
      {children}
    </RNText>
  )
}

const getFontFamily = (variant: TextVariant) => {
  switch (variant) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return 'Ubuntu-Bold'
    case 'subtitle1':
    case 'subtitle2':
      return 'Ubuntu-Medium'
    default:
      return 'Ubuntu-Regular'
  }
}

const styles = StyleSheet.create({
  h1: { fontSize: 32, lineHeight: 40 },
  h2: { fontSize: 28, lineHeight: 36 },
  h3: { fontSize: 24, lineHeight: 32 },
  h4: { fontSize: 20, lineHeight: 28 },
  h5: { fontSize: 18, lineHeight: 26 },
  h6: { fontSize: 16, lineHeight: 24 },
  subtitle1: { fontSize: 16, lineHeight: 24 },
  subtitle2: { fontSize: 14, lineHeight: 22 },
  body1: { fontSize: 16, lineHeight: 24 },
  body2: { fontSize: 14, lineHeight: 20 },
})

const defaultTheme = {
  colors: {
    text: '#fff',
  },
}
