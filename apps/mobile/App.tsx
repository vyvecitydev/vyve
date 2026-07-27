/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from '@vyve/ui-native'
import { AppNavigator } from './src/navigation/AppNavigator'
import { useCallback, useEffect } from 'react'
import { getUserLocation, initI18n } from '@vyve/gotham-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useLocationStore, useThemeModeStore, useUIStore } from './src/store'
import { Host } from 'react-native-portalize'
import { LocalPush } from '@vyve/ui-native'

function App() {
  const isDarkMode = useColorScheme() === 'dark'
  const themeMode = useThemeModeStore((s) => s.mode)

  const { pushVisible, pushMessage, pushType, hidePush } = useUIStore()

  const initLocation = useCallback(async () => {
    try {
      const { lat, lng } = await getUserLocation()
      useLocationStore.getState().setLocation(lat, lng)
    } catch (e) {
      console.log('Location error:', e)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      await initI18n()
      await initLocation()
    }
    init()
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider
          initialMode={themeMode || (isDarkMode ? 'dark' : 'light')}
          modeOverride={themeMode}
        >
          <StatusBar
            barStyle={
              themeMode === 'dark' || (isDarkMode && !themeMode) ? 'light-content' : 'dark-content'
            }
          />
          <Host>
            <AppNavigator />
            {/* Global push notification */}
            <LocalPush
              visible={pushVisible}
              message={pushMessage}
              type={pushType}
              duration={3000}
              onClose={hidePush}
            />
          </Host>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default App
