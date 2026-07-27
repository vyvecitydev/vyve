import { colorWithOpacity } from '@vyve/gotham'
import { Text, useTheme } from '@vyve/ui-native'
import { memo } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

type PillProps = {
  label: string
  selected: boolean
  onPress: () => void
}

const Pill = ({ label, selected, onPress }: PillProps) => {
  const { theme } = useTheme()

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.pill,
        {
          backgroundColor: selected
            ? colorWithOpacity(theme.colors.primary, 0.15)
            : colorWithOpacity(theme.colors.backgroundSecondary, 1),
        },
      ]}
    >
      <Text variant="body2" style={{ color: selected ? theme.colors.primary : theme.colors.text }}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
})

export default memo(Pill)
