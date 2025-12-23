import React, { useEffect, useRef, useState } from 'react'
import { View, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import { Text } from '../'
import { useTheme } from '../theme/ThemeProvider'
import { Modalize } from 'react-native-modalize'
import { Portal } from 'react-native-portalize'

interface Item {
  label: string
  value: string
}

interface Props {
  label?: string
  value?: string | null
  onValueChange: (val: string) => void
  placeholder?: string
  items: Item[]
  helperText?: string
  isError?: boolean
  disabled?: boolean
}

export const Select: React.FC<Props> = ({
  label,
  value,
  onValueChange,
  placeholder,
  items,
  helperText,
  isError,
  disabled = false,
}) => {
  const { theme } = useTheme()
  const modalizeRef = useRef<Modalize>(null)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (!value && !placeholder && items.length > 0) {
      onValueChange(items[0].value)
    }
  }, [value, placeholder, items])

  const selectedLabel = value
    ? items.find((i) => i.value === value)?.label || placeholder
    : placeholder

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

  const bgColor = disabled ? theme.colors.surface : theme.colors.backgroundSecondary
  const textColor = disabled ? theme.colors.textSecondary : theme.colors.text

  const openModal = () => {
    if (!disabled) {
      modalizeRef.current?.open()
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {label && (
        <Text variant="subtitle1" style={{ color: labelColor, marginBottom: 6 }}>
          {label}
        </Text>
      )}

      <TouchableOpacity
        style={[
          pickerStyles(theme, borderColor, bgColor),
          { justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' },
          disabled && { opacity: 0.6 },
        ]}
        onPress={openModal}
        activeOpacity={disabled ? 1 : 0.7}
      >
        <Text style={{ color: value ? textColor : theme.colors.textSecondary }}>
          {selectedLabel}
        </Text>
        <Text style={{ color: value ? textColor : theme.colors.textSecondary }}>⌄</Text>
      </TouchableOpacity>

      {helperText && (
        <Text
          variant="subtitle2"
          style={{
            color: helperColor,
            marginTop: 6,
          }}
        >
          {helperText}
        </Text>
      )}

      <Portal>
        <Modalize
          ref={modalizeRef}
          snapPoint={300}
          modalHeight={400}
          useNativeDriver
          onOpen={() => setFocused(true)}
          onClose={() => setFocused(false)}
          modalStyle={{ backgroundColor: theme.colors.backgroundSecondary }}
        >
          <FlatList
            data={items}
            keyExtractor={(item) => item.value}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.item, { padding: theme.spacing.lg, borderColor: theme.colors.border }]}
                onPress={() => {
                  onValueChange(item.value)
                  modalizeRef.current?.close()
                }}
              >
                <Text style={{ color: theme.colors.text }}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </Modalize>
      </Portal>
    </View>
  )
}

const pickerStyles = (theme: any, borderColor: string, bgColor: string) => ({
  fontSize: 16,
  height: 48,
  borderWidth: 1,
  borderColor,
  borderRadius: theme.radius.md,
  paddingHorizontal: theme.spacing.lg,
  paddingVertical: theme.spacing.md,
  backgroundColor: bgColor,
})

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
  },
})
