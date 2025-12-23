import React from 'react'
import { TouchableOpacity, ViewStyle, ActivityIndicator } from 'react-native'
import { useTheme } from '../theme/ThemeProvider'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning' | 'info' | 'success'

type ButtonType = 'contained' | 'outlined' | 'text'

interface IconButtonProps {
  icon: React.ReactNode
  onPress?: () => void
  variant?: ButtonVariant
  type?: ButtonType
  size?: number
  disabled?: boolean
  loading?: boolean
  style?: ViewStyle
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  variant = 'primary',
  type = 'contained',
  size = 40,
  disabled = false,
  loading = false,
  style,
}) => {
  const { theme } = useTheme()
  const baseColor = theme.colors[variant]
  const onColor =
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
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
        },
        getButtonStyle(),
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={onColor} size="small" /> : icon}
    </TouchableOpacity>
  )
}
