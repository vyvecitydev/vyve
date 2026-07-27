import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { Theme as NavigationTheme } from '@react-navigation/native'
import { TabNavigator } from './TabNavigator'
import { useTheme } from '@vyve/ui-native'
import { FirstLaunchModal } from '../components/FirstLaunchModal'
import SplashScreen from '../screens/Common/SplashScreen'
import { useOnboardingStore } from '../store'
import { LoginStackNavigator } from './AuthStackNavigator'

const Stack = createNativeStackNavigator()

export const AppNavigator = () => {
  const { theme } = useTheme()

  const navTheme: NavigationTheme = {
    dark: theme.mode === 'dark',
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.info,
    },
    fonts: (theme as any).fonts ?? {},
  }

  const [splashDone, setSplashDone] = useState(false)
  const hasSeenWelcome = useOnboardingStore((s) => s.hasSeenWelcome)

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* 1) Splash */}
        {!splashDone && (
          <Stack.Screen name="Splash">
            {() => <SplashScreen onFinish={() => setSplashDone(true)} />}
          </Stack.Screen>
        )}

        {/* 2) Onboarding */}
        {splashDone && !hasSeenWelcome && (
          <Stack.Screen name="Onboarding" component={FirstLaunchModal} />
        )}

        {/* 2) App */}
        {splashDone && hasSeenWelcome && <Stack.Screen name="Tabs" component={TabNavigator} />}
        <Stack.Screen name="AuthStack" component={LoginStackNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
