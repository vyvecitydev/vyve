import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomeScreen } from '../screens/Home/HomeScreen'
import { useTheme, IconButton } from '@vyve/ui-native'
import { Logo } from '../components/Logo'
import { CompanyDetailsScreen } from '../screens/Common/CompanyDetailsScreen'
import { LocationPickerScreen } from '../screens/Common/LocationPickerScreen'
import BackIcon from '../assets/icons/arrow-left.svg'
import LocationIcon from '../assets/icons/location.svg'
import SearchIcon from '../assets/icons/search.svg'
import { ParallaxMisket } from '../screens/Common/GameScreen'
import { SearchScreen } from '../screens/Home/SearchScreen'
import { useAuthStore } from '../store'
import { GradientRing } from '../screens/Common/GradientRing'
import { NotificationScreen } from '../screens/Profile/NotificationScreen'
import { UserListScreen } from '../screens/Home/UserListScreen'
import CompanyMenuScreen from '../screens/Common/CompanyMenuScreen'

const Stack = createNativeStackNavigator<any>()

export const HomeStackNavigator = () => {
  const { theme } = useTheme()
  const { user } = useAuthStore()

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="CompanyDetails"
        component={CompanyDetailsScreen}
        options={({ navigation, route }) => ({
          gestureEnabled: true,
          animation: 'slide_from_bottom',
          presentation: 'transparentModal',
        })}
      />
      <Stack.Screen
        name="CompanyMenu"
        component={CompanyMenuScreen}
        // options={({ navigation, route }) => ({
        //   gestureEnabled: true,
        //   animation: 'slide_from_bottom',
        //   presentation: 'transparentModal',
        // })}
      />
      <Stack.Screen
        name="LocationPicker"
        component={LocationPickerScreen}
        options={{
          presentation: 'fullScreenModal',
        }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={({ navigation }) => ({
          presentation: 'fullScreenModal',
        })}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={({ navigation, route }) => ({
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="UserList"
        component={UserListScreen}
        options={({ navigation, route }) => ({
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  )
}
