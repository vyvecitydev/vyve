// src/screens/Home/HomeScreen.tsx
import React from 'react'
import { View, Text, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { BlurView } from '@vyve/ui-native'

export const SettingsScreen = () => {
  const navigation = useNavigation()
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>🏠 Home Screen</Text>
      <Button title="Go to Details" onPress={() => navigation.navigate('Details' as never)} />
      <Text style={{ color: 'white' }}>Blur arka plan!</Text>
      <BlurView
        blurType="dark"
        blurAmount={15}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
      <Text style={{ color: 'white' }}>Blur arka plan!</Text>
    </View>
  )
}
