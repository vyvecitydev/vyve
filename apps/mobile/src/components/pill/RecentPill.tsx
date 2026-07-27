import { memo } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { colorWithOpacity } from '@vyve/gotham'
import { Text, useTheme } from '@vyve/ui-native'
import SearchIcon from '../../assets/icons/search.svg'

type Props = {
  label: string
  onPress: () => void
  onRemove: () => void
}

const RecentPill = ({ label, onPress, onRemove }: Props) => {
  const { theme } = useTheme()
  return (
    <View
      style={[
        styles.recentPill,
        {
          borderColor: colorWithOpacity(theme.colors.border, 0.6),
          backgroundColor: colorWithOpacity(theme.colors.backgroundSecondary, 1),
        },
      ]}
    >
      <TouchableOpacity style={styles.recentLeft} onPress={onPress}>
        <Text variant="body2">{label}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onRemove} hitSlop={8}>
        <Text style={{ color: theme.colors.textSecondary }}>✕</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  recentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
})

export default memo(RecentPill)
