import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useTheme } from '../theme/ThemeProvider'
import { Text } from './Text'

interface DividerProps {
  text?: string
  textPosition?: 'left' | 'center' | 'right'
  style?: any
}

export const Divider: React.FC<DividerProps> = ({ text, textPosition = 'center', style }) => {
  const { theme } = useTheme()

  return (
    <View style={[styles.container, style]}>
      {text ? (
        <View style={styles.row}>
          {textPosition === 'left' || textPosition === 'center' ? (
            <View
              style={[
                styles.line,
                { backgroundColor: theme.colors.border },
                textPosition === 'center' && { flex: 1, marginRight: theme.spacing.md },
                textPosition === 'left' && { flex: 1, marginRight: theme.spacing.md },
              ]}
            />
          ) : null}

          <Text style={[{ color: theme.colors.text }]}>{text}</Text>

          {textPosition === 'right' || textPosition === 'center' ? (
            <View
              style={[
                styles.line,
                { backgroundColor: theme.colors.border },
                textPosition === 'center' && { flex: 1, marginLeft: theme.spacing.md },
                textPosition === 'right' && { flex: 1, marginLeft: theme.spacing.md },
              ]}
            />
          ) : null}
        </View>
      ) : (
        <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    height: 1,
  },
})
