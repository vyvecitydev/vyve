import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { PopularScreen } from '../screens/Popular/PopularScreen'
import { useTheme, IconButton } from '@vyve/ui-native'
import { Logo } from '../components/Logo'
import { CompanyDetailsScreen } from '../screens/Common/CompanyDetailsScreen'
import BackIcon from '../assets/icons/arrow-left.svg'
import { LiveScreen } from '../screens/Live/LiveScreen'

type PopularStackParamList = {
  Popular: undefined
  CompanyDetails: {
    item: {
      id: number
      imageUrl: string
      widthRatio: number
      heightRatio: number
      text: string
      percent: number
    }
  }
}

const Stack = createNativeStackNavigator<PopularStackParamList>()

export const PopularStackNavigator = () => {
  const { theme } = useTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerShown: false,
      }}
    >
      <Stack.Screen name="Popular" component={LiveScreen} />
      <Stack.Screen
        name="CompanyDetails"
        component={CompanyDetailsScreen}
        options={({ navigation }) => ({
          presentation: 'fullScreenModal',
        })}
      />
    </Stack.Navigator>
  )
}
