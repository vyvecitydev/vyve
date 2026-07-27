import React, { memo, useEffect, useMemo, useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text, useTheme } from '@vyve/ui-native'
import RecentPill from './pill/RecentPill'
import { MODS } from '../screens/Home/SearchScreen'
import { useSearchStore } from '../store/search/useSearchStore'
import { useShallow } from 'zustand/shallow'

type Payload = {
  text?: string
  mods?: number[]
  tags?: string[]
}

type FilterItem = {
  id: string
  label: string
  type: 'text' | 'tag' | 'mod'
}

type Props = {
  payload: Payload
  onRemoveFilter: (item: any) => void
  onClearAll: () => void
}

const ActiveFilterBar = ({ payload, onRemoveFilter }: Props) => {
  const { theme } = useTheme()
  // const [filters, setFilters] = useState<FilterItem[]>([])

  const modMap = useMemo(() => {
    const map = new Map<number, string>()
    MODS.forEach((m) => {
      map.set(m.id, m.title)
    })
    return map
  }, [])

  const filters: FilterItem[] = useMemo(() => {
    const list: FilterItem[] = []

    if (payload?.text) {
      list.push({
        id: 'text',
        label: payload.text,
        type: 'text',
      })
    }

    payload?.tags?.forEach((tag) => {
      list.push({
        id: `tag-${tag}`,
        label: tag,
        type: 'tag',
      })
    })

    payload?.mods?.forEach((mod) => {
      const title = modMap.get(mod)
      if (title) {
        list.push({
          id: `mod-${mod}`,
          label: title,
          type: 'mod',
        })
      }
    })

    return list
  }, [payload, modMap])

  if (filters.length === 0) return null

  // const removeFilter = (id: string) => {
  //   setFilters((prev) => prev.filter((f) => f.id !== id))
  // }

  // const clearAll = () => {
  //   setFilters([])
  // }

  if (filters.length === 0) return null

  return (
    <View
      style={[
        styles.root,
        {
          padding: theme.spacing.sm,
          gap: theme.spacing.md,
        },
      ]}
    >
      {/* Filter Pills */}
      <View style={[styles.filterRow, { gap: theme.spacing.sm }]}>
        {filters.map((filter) => (
          <RecentPill
            key={filter.id}
            label={filter.label}
            onPress={() => {}}
            onRemove={() =>
              onRemoveFilter({
                type: filter.type,
                value: filter.type === 'mod' ? Number(filter.id.replace('mod-', '')) : filter.label,
              })
            }
          />
        ))}
      </View>

      {/* Clear All */}
      {/* <TouchableOpacity onPress={clearAll}>
        <Text
          style={{
            color: theme.colors.primary,
            fontWeight: '600',
          }}
        >
          Clear All
        </Text>
      </TouchableOpacity> */}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', // 🔥 WRAP aktif
  },
})

export default memo(ActiveFilterBar)
