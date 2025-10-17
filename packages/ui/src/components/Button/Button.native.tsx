import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import { useTheme } from '../../hooks/useTheme'

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'

type ButtonProps = {
  variant?: ButtonVariant
  title: string
  onPress?: () => void
  style?: ViewStyle
  textStyle?: TextStyle
}

export const Button = ({ variant = 'primary', title, onPress, style, textStyle }: ButtonProps) => {
  const { theme } = useTheme()

  const backgroundColor = theme.colors[variant] || theme.colors.primary
  const textColor = '#fff'

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor,
          borderRadius: theme.borderRadius,
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
        },
        style,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          {
            color: textColor,
            fontSize: theme.fontSize.md,
            // fontWeight: typography.fontWeights.medium as any,
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
})
