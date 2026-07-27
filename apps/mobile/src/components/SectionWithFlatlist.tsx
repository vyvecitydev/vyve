// SectionWithFlatList.tsx
import React from 'react'
import { View, Text, FlatList, ListRenderItem } from 'react-native'
import { useTheme } from '@vyve/ui-native'

interface SectionWithFlatListProps<T> {
  title: string
  data: T[]
  renderItem: ListRenderItem<T>
  keyExtractor: (item: T, index: number) => string
}

export function SectionWithFlatList<T>({
  title,
  data,
  renderItem,
  keyExtractor,
}: SectionWithFlatListProps<T>) {
  const { theme } = useTheme()

  return (
    <View>
      <Text
        style={{
          fontSize: theme.typography.sizes.lg,
          fontWeight: '700',
          color: theme.colors.text,
          marginBottom: theme.spacing.sm,
          marginHorizontal: theme.spacing.lg,
        }}
      >
        {title}
      </Text>

      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{paddingHorizontal: theme.spacing.lg}}
        ItemSeparatorComponent={() => <View style={{ width: theme.spacing.xs }} />}
      />
    </View>
  )
}
