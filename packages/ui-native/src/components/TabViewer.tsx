import React, { useState } from 'react'
import { Dimensions, View, TouchableOpacity } from 'react-native'
import { TabView, SceneMap } from 'react-native-tab-view'
import { useTheme } from '../theme/ThemeProvider'
import { Text } from './Text'

interface TabItem {
  key: string
  title: string
  component: React.ReactNode
  icon?: React.ComponentType<{ color?: string; size?: number }>
}

interface TabViewerProps {
  tabs: TabItem[]
}

export const TabViewer = ({ tabs }: TabViewerProps) => {
  const layout = Dimensions.get('window')
  const { theme } = useTheme()

  const [index, setIndex] = useState(0)

  const routes = tabs.map((t) => ({ key: t.key, title: t.title, icon: t.icon }))

  const renderScene = SceneMap(
    tabs.reduce((acc, t) => {
      acc[t.key] = () => <>{t.component}</>
      return acc
    }, {} as any),
  )

  const renderTabBar = (props: any) => (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.background,
        borderBottomWidth: 1,
        borderColor: theme.colors.border,
      }}
    >
      {props.navigationState.routes.map((route: any, i: number) => {
        const active = i === index

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => setIndex(i)}
            style={{
              flex: 1,
              paddingVertical: 12,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                flexDirection: 'row', // icon + text yan yana
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* ICON */}
              {route.icon && (
                <route.icon
                  color={active ? theme.colors.primary : theme.colors.text}
                  size={20}
                  style={{ marginRight: theme.spacing.xs }} // icon ile text arası boşluk
                />
              )}
              <Text
                style={{
                  color: active ? theme.colors.primary : theme.colors.text,
                }}
                variant="body1"
              >
                {route.title}
              </Text>
            </View>

            {/* Active tab indicator */}
            {active && (
              <View
                style={{
                  marginTop: 6,
                  width: 60,
                  height: 3,
                  backgroundColor: theme.colors.primary,
                  borderRadius: 2,
                }}
              />
            )}
          </TouchableOpacity>
        )
      })}
    </View>
  )

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  )
}
