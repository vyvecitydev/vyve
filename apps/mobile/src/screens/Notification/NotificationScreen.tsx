// src/screens/Home/HomeScreen.tsx
import React, { useEffect } from 'react'
import { Dimensions, FlatList, Image, View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Text, useTheme } from '@vyve/ui-native'
import moment from 'moment'

// Rastgele data
const sampleData = Array.from({ length: 3 }, (_, i) => ({
  id: i.toString(),
  title: `Item ${i + 1}`,
  date: moment()
    .subtract(i * 2, 'hour')
    .toISOString(),
}))

export const NotificationScreen = () => {
  const navigation = useNavigation()
  const { theme, toggleTheme } = useTheme()

  const renderItem = ({ item }: { item: (typeof sampleData)[0] }) => (
    <View
      style={{
        flexDirection: 'row', // yatay dizilim: image + column + tarih
        padding: theme.spacing.sm,
        marginBottom: theme.spacing.sm,
        borderRadius: theme.radius.md,
        borderColor: theme.colors.border,
        borderWidth: 1,
        backgroundColor: theme.colors.backgroundSecondary,
        alignItems: 'center',
      }}
    >
      {/* Sol görsel */}
      <Image
        source={{ uri: 'https://picsum.photos/50/50?random=1' }} // şimdilik placeholder
        style={{ width: 50, height: 50, borderRadius: theme.radius.md, marginRight: 12 }}
      />

      {/* Ortadaki column */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text variant="h6">
          {item.title} {/* Üst satır */}
        </Text>
        <Text variant="body2" style={{ color: theme.colors.textSecondary }}>
          {item.title} açıklama {/* Alt satır */}
        </Text>
      </View>

      {/* Sağ üstte tarih */}
      <Text
        variant="body2"
        style={{
          color: theme.colors.textSecondary,
          borderColor: theme.colors.border,
          borderWidth: 1,
          borderRadius: theme.radius.sm,
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
        }}
      >
        {moment(item.date).fromNow()}
      </Text>
    </View>
  )

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <Image
        source={require('../../assets/images/bg.png')}
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: theme.colors.background,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
          },
        ]}
      />
      <FlatList
        contentContainerStyle={{ padding: theme.spacing.lg }}
        data={sampleData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}
