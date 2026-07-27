import React, { memo } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import LottieView from 'lottie-react-native'
import { Text, useTheme } from '@vyve/ui-native'
import { colorWithOpacity } from '@vyve/gotham'

const MOD_LOTTIES: Record<number, any> = {
  1: require('../../assets/lotties/chill.json'),
  2: require('../../assets/lotties/normal.json'),
  3: require('../../assets/lotties/enerjik.json'),
}

type Props = {
  mod: { id: number; title: string; range: string }
  selected: boolean
  onPress: () => void
}

const ModPill = ({ mod, selected, onPress }: Props) => {
  const { theme } = useTheme()
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.modPill,
        {
          backgroundColor: selected
            ? colorWithOpacity(theme.colors.primary, 0.15)
            : colorWithOpacity(theme.colors.backgroundSecondary, 1),
        },
      ]}
    >
      <LottieView
        source={MOD_LOTTIES[mod.id]}
        autoPlay
        loop
        style={{
          width: 64,
          height: 64,
          opacity: selected ? 1 : 0.6,
        }}
      />
      <Text
        variant="body2"
        style={{
          color: selected ? theme.colors.primary : theme.colors.text,
        }}
      >
        {mod.title}
      </Text>
      <Text
        variant="body2"
        style={{
          color: selected ? theme.colors.primary : theme.colors.textSecondary,
          fontSize: 10,
          marginTop: -8,
        }}
      >
        {mod.range}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  modPill: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 24,
  },
})

export default memo(ModPill)
