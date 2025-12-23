import React, { useState } from 'react'
import {
  View,
  TextInput as RNTextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native'
import { useTheme } from '../theme/ThemeProvider'
import { Text } from '../'

interface Props extends TextInputProps {
  label?: string
  helperText?: string
  isError?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  disabled?: boolean
  secureToggle?: boolean
  eyeIcon?: React.ReactNode
  eyeOffIcon?: React.ReactNode
}

export const TextInput: React.FC<Props> = ({
  label,
  helperText,
  isError,
  leftIcon,
  rightIcon,
  secureTextEntry,
  secureToggle = false,
  disabled,
  style,
  eyeIcon,
  eyeOffIcon,
  ...rest
}) => {
  const { theme } = useTheme()
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const borderColor = isError
    ? theme.colors.danger
    : focused
      ? theme.colors.primary
      : theme.colors.border

  const labelColor = isError
    ? theme.colors.danger
    : focused
      ? theme.colors.primary
      : theme.colors.text

  const helperColor = isError ? theme.colors.danger : theme.colors.textSecondary

  const textColor = disabled ? theme.colors.text : theme.colors.text
  const bgColor = disabled ? theme.colors.surface : theme.colors.backgroundSecondary

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="subtitle1" style={[styles.label, { color: labelColor }]}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor,
            backgroundColor: bgColor,
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.lg,
            borderRadius: theme.radius.md,
          },
          disabled && { opacity: 0.6 },
        ]}
      >
        {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}

        <RNTextInput
          style={[
            styles.input,
            {
              color: textColor,
              fontFamily: theme.typography.fontFamily.regular,
            },
            style,
          ]}
          autoCapitalize={secureTextEntry ? 'none' : rest.autoCapitalize}
          placeholderTextColor={theme.colors.textSecondary}
          editable={!disabled}
          secureTextEntry={secureTextEntry && !showPassword}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />

        {secureToggle ? (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconRight}>
            {showPassword ? eyeOffIcon : eyeIcon}
          </TouchableOpacity>
        ) : (
          rightIcon && <View style={styles.iconRight}>{rightIcon}</View>
        )}
      </View>

      {helperText ? (
        <Text variant="subtitle2" style={[styles.helperText, { color: helperColor }]}>
          {helperText}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // marginBottom: 16,
  },
  label: {
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  helperText: {
    marginTop: 6,
  },
})
