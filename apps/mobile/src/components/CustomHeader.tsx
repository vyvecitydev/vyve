// components/CustomHeader.tsx
import { useTheme } from '@vyve/ui-native'
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Platform, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Logo } from './Logo'

type HeaderAction = {
  icon: React.ReactNode
  onPress: () => void
}

type Props = {
  title?: string
  left?: HeaderAction
  right?: HeaderAction[]
  style?: ViewStyle
}

export const CustomHeader = ({ title, left, right = [], style }: Props) => {
  const insets = useSafeAreaInsets()

  const { theme } = useTheme()

  return (
    <View
      style={[
        styles.container,
        {
          marginTop: insets.top,
          backgroundColor: theme.colors.background,
        },
        style,
      ]}
    >
      {/* LEFT */}
      {/* <View style={styles.side}>
        {left && (
          <TouchableOpacity onPress={left.onPress} hitSlop={8} activeOpacity={0.7}>
            {left.icon}
          </TouchableOpacity>
        )}
      </View> */}

      {/* TITLE */}

      <View style={styles.title}>{title && <Logo />}</View>

      {/* RIGHT */}
      <View style={[styles.side, styles.right]}>
        {right.map((item, index) => (
          <TouchableOpacity key={index} onPress={item.onPress} hitSlop={8} activeOpacity={0.7}>
            {item.icon}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

export const HEADER_HEIGHT = 50

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: HEADER_HEIGHT,
  },
  side: {
    justifyContent: 'center',
    alignItems: 'center',
    // width: 60,
  },
  title: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 16,
  },
  right: {
    flexDirection: 'row',
    gap: 24,
    marginRight: 16,
  },
})
