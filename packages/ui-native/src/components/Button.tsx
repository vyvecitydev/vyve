import React from 'react'
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native'
import { useTheme } from '../theme/ThemeProvider'
import { IconButton } from './IconButton'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning' | 'info' | 'success'

type ButtonType = 'contained' | 'outlined' | 'text'

interface ButtonProps {
  title: string
  onPress?: (event: GestureResponderEvent) => void
  variant?: ButtonVariant
  type?: ButtonType
  disabled?: boolean
  loading?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  style?: ViewStyle
  textStyle?: TextStyle
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  type = 'contained',
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
  style,
  textStyle,
}) => {
  const { theme } = useTheme()
  const baseColor = theme.colors[variant]
  const textColor =
    type === 'contained'
      ? theme.mode === 'light'
        ? theme.colors.background
        : theme.colors.text
      : baseColor

  const getButtonStyle = (): ViewStyle => {
    switch (type) {
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderColor: baseColor,
          borderWidth: 1,
        }
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        }
      default:
        return {
          backgroundColor: baseColor,
          borderColor: baseColor,
          borderWidth: 1,
        }
    }
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          borderRadius: theme.radius.md,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing.xs,
          opacity: disabled || loading ? 0.5 : 1,
        },
        getButtonStyle(),
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {iconLeft && <View style={{ marginRight: theme.spacing.xs }}>{iconLeft}</View>}
          <Text
            style={[
              styles.text,
              { color: textColor, fontSize: theme.typography.sizes.md },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {iconRight && <View style={{ marginLeft: theme.spacing.xs }}>{iconRight}</View>}
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {},
  text: {
    fontWeight: '600',
  },
})
