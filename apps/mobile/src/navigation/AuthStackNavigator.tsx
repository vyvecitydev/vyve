import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useTheme } from '@vyve/ui-native'
import { LoginScreen } from '../screens/Auth/LoginScreen'
import { SignupScreen } from '../screens/Auth/SignupScreen'
import { ProfileScreen } from '../screens/Profile/ProfileScreen'
import { useAuthStore } from '../store'
import { Logo } from '../components/Logo'
import { SettingsScreen } from '../screens/Profile/SettingsScreen'
import { TouchableOpacity } from 'react-native'
import BackIcon from '../assets/icons/arrow-left.svg'
import { CompanyDetailsScreen } from '../screens/Common/CompanyDetailsScreen'
import { ProfileEditScreen } from '../screens/Profile/ProfileEditScreen'
import { ChangePasswordScreen } from '../screens/Profile/ChangePasswordScreen'
import { NotificationScreen } from '../screens/Profile/NotificationScreen'
import CompanyMenuScreen from '../screens/Common/CompanyMenuScreen'

const Stack = createNativeStackNavigator<any>()

export const LoginStackNavigator = () => {
  const { theme } = useTheme()
  const { user } = useAuthStore()
  const initial = user ? 'Profile' : 'Login'

  return (
    <Stack.Navigator
      initialRouteName={initial}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }) => ({
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={({ navigation, route }) => ({
          headerShown: false,
        })}
      />
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
        options={({ navigation, route }) => ({
          gestureEnabled: true,
          animation: 'slide_from_bottom',
          presentation: 'transparentModal',
        })}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={({ navigation, route }) => ({
          headerShown: false,
          // headerStyle: {
          //   backgroundColor: theme.colors.background,
          // },
          // headerTitle: () => <Logo />,
          // headerTintColor: theme.colors.text,
          // headerTitleAlign: 'center',
          // headerShadowVisible: false,
          // headerBackVisible: false,
          // headerLeft: () => (
          //   <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingHorizontal: 4 }}>
          //     <BackIcon color={theme.colors.text} />
          //   </TouchableOpacity>
          // ),
        })}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEditScreen}
        options={({ navigation, route }) => ({
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTitle: () => <Logo />,
          headerTintColor: theme.colors.text,
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingHorizontal: 4 }}>
              <BackIcon color={theme.colors.text} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  )
}
