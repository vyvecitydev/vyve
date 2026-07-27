import React, { useCallback, useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HomeStackNavigator } from './HomeStackNavigator'
import { BlurView, useTheme } from '@vyve/ui-native'
import ExplorerIcon from '../assets/icons/explorer.svg'
import NotificationIcon from '../assets/icons/notification.svg'
import ProfileIcon from '../assets/icons/profile.svg'
import BlurOnIcon from '../assets/icons/vyve.svg'
import SettingsIcon from '../assets/icons/settings.svg'
import { PopularStackNavigator } from './PopularStackNavigator'
import { LoginStackNavigator } from './AuthStackNavigator'
import { SettingsScreen } from '../screens/Profile/SettingsScreen'
import { colorWithOpacity } from '@vyve/gotham'
import { useAuthStore } from '../store/auth/useAuthStore'
import { Logo } from '../components/Logo'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { getFavorites, getCheckins } from '../services/profile'
import { useFavoritesStore } from '../store/favorites/useFavoritesStore'
import { useCheckinsStore } from '../store/checkins/useCheckinsStore'
import { getCurrentUser } from '../services/auth'
import messaging from '@react-native-firebase/messaging'

const Tab = createBottomTabNavigator()
export const TAB_BAR_HEIGHT = 50

export const TabNavigator = () => {
  const { theme } = useTheme()
  const user = useAuthStore((state) => state.user)
  const setAuth = useAuthStore((state) => state.setAuth)
  const insets = useSafeAreaInsets()

  useEffect(() => {
    const initUser = async () => {
      try {
        const _user = await getCurrentUser()
        setAuth({ user: _user, accessToken: _user.accessToken, refreshToken: _user.refreshToken })
      } catch (err) {
        console.error('Failed to fetch user', err)
      }
    }

    const requestUserPermission = async () => {
      console.log('Requesting permission...')
      const authStatus = await messaging().requestPermission()
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL

      if (enabled) {
        console.log('Authorization status:', authStatus)
      }
    }

    initUser()
    requestUserPermission()
  }, [])

  const handleCheckInAndFavorites = useCallback(async () => {
    useFavoritesStore.getState().setFavorites([])
    useCheckinsStore.getState().setCheckins([])
    if (!user) return
    try {
      const orgs = await getFavorites(1)
      useFavoritesStore.getState().setFavorites([...orgs])
      console.log('orgs', orgs)
    } catch (err) {
      console.error('Error fetching favorites:', err)
    }

    try {
      const orgs = await getCheckins(1)
      useCheckinsStore.getState().setCheckins([...orgs])
    } catch (err) {
      console.error('Error fetching check-ins:', err)
    }
  }, [user])

  useEffect(() => {
    handleCheckInAndFavorites()
  }, [user])

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.text,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          height: TAB_BAR_HEIGHT + insets.bottom,
          paddingTop: theme.spacing.xs,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          backgroundColor: 'transparent',
          elevation: 0,
        },
        tabBarBackground() {
          return <BlurView style={{ flex: 1 }} blurAmount={20} />
        },
        tabBarIcon: ({ focused, color, size }) => {
          const _color = theme.colors.text
          if (route.name === 'ExplorerStack')
            return (
              <ExplorerIcon
                width={24}
                height={24}
                color={_color}
                fill={focused ? colorWithOpacity(theme.colors.text, 0.4) : 'transparent'}
              />
            )
          else if (route.name === 'PopularStack')
            return (
              <BlurOnIcon
                width={24}
                height={24}
                color={_color}
                fill={focused ? colorWithOpacity(theme.colors.text, 0.4) : 'transparent'}
              />
            )
          // else if (route.name === 'Vyve')
          //   return (
          //     <VyveIcon width={28} height={28} color={focused ? theme.colors.primary : _color} />
          //   )
          else if (route.name === 'Notification' || route.name === 'Settings')
            return user ? (
              <NotificationIcon
                color={_color}
                width={24}
                height={24}
                fill={focused ? colorWithOpacity(theme.colors.text, 0.4) : 'transparent'}
              />
            ) : (
              <SettingsIcon
                color={_color}
                width={24}
                height={24}
                fill={focused ? colorWithOpacity(theme.colors.text, 0.4) : 'transparent'}
              />
            )
          else if (route.name === 'Profile')
            return (
              <ProfileIcon
                color={_color}
                width={24}
                height={24}
                fill={focused ? colorWithOpacity(theme.colors.text, 0.4) : 'transparent'}
              />
            )
          return (
            <ExplorerIcon
              color={_color}
              width={24}
              height={24}
              fill={focused ? theme.colors.primary : 'transparent'}
            />
          )
        },
      })}
    >
      <Tab.Screen name="ExplorerStack" component={HomeStackNavigator} />
      <Tab.Screen name="PopularStack" component={PopularStackNavigator} />
      {/* <Tab.Screen name="Vyve" component={MapScreen} /> */}

      {!user && (
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTitle: () => <Logo />,
            headerTintColor: theme.colors.text,
            headerTitleAlign: 'center',
            headerShadowVisible: false,
            headerShown: true,
          }}
        />
      )}

      <Tab.Screen name="Profile" component={LoginStackNavigator} />
    </Tab.Navigator>
  )
}
