import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, useTheme } from '@vyve/ui-native'

type StatItem = {
  label: string
  value: number | string
}

type Props = {
  stats: StatItem[]
}

export const VibeStats = ({ stats }: Props) => {
  const { theme } = useTheme()

  return (
    <View style={styles.container}>
      {stats.map((item, index) => (
        <View key={index} style={[styles.card, { backgroundColor: theme.colors.background }]}>
          <Text style={styles.value}>{item.value}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  card: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
  },
  label: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
})
