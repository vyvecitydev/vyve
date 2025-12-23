import React from 'react'
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  ViewStyle,
  View,
} from 'react-native'

interface KeyboardScreenProps {
  children: React.ReactNode
  contentContainerStyle?: ViewStyle
  style?: ViewStyle
}

export const KeyboardScreen: React.FC<KeyboardScreenProps> = ({
  children,
  contentContainerStyle,
  style,
}) => {
  return (
    <KeyboardAvoidingView
      style={[styles.container, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, contentContainerStyle]}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContainer: {
    flexGrow: 1,
  },
})
