import { useTheme } from '@vyve/ui-native'
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const TAB_BAR_HEIGHT = 50

export const TabScreenWrapper = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets()

  return (
    <View
      style={[
        styles.root,
        {
          flex: 1,
        //   paddingBottom: TAB_BAR_HEIGHT + insets.bottom,
        },
      ]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})
