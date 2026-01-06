import React, { useEffect, useRef } from 'react'
import {
  Animated,
  StyleSheet,
  Dimensions,
  PanResponder,
  StatusBar,
  Platform,
  ViewStyle,
} from 'react-native'
import { useTheme } from '../theme/ThemeProvider'
import { Text } from './Text'

type LocalPushType = 'success' | 'error' | 'warning' | 'info'

interface LocalPushProps {
  visible: boolean
  message: string
  type?: LocalPushType
  duration?: number
  onClose: () => void
}

const SCREEN_WIDTH = Dimensions.get('window').width

export const LocalPush: React.FC<LocalPushProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  const { theme } = useTheme()

  const translateY = useRef(new Animated.Value(-120)).current
  const panY = useRef(new Animated.Value(0)).current
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 12) : 44

  const stylesByType: Record<LocalPushType, ViewStyle> = {
    success: { backgroundColor: theme.colors.success },
    error: { backgroundColor: theme.colors.danger },
    warning: { backgroundColor: theme.colors.warning },
    info: { backgroundColor: theme.colors.info },
  }

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: statusBarHeight + 12,
        useNativeDriver: true,
      }).start()

      timeoutRef.current = setTimeout(close, duration)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [visible])

  const close = () => {
    Animated.timing(translateY, {
      toValue: -120,
      duration: 200,
      useNativeDriver: true,
    }).start(onClose)
  }

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy < -10,
      onPanResponderMove: Animated.event([null, { dy: panY }], {
        useNativeDriver: true,
      }),
      onPanResponderRelease: (_, g) => {
        if (g.dy < -40) {
          close()
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start()
        }
      },
    }),
  ).current

  if (!visible) return null

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        { borderRadius: theme.radius.md, padding: theme.spacing.md },
        stylesByType[type],
        {
          transform: [{ translateY }, { translateY: panY }],
        },
      ]}
    >
      <Text variant="body1">{message}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: SCREEN_WIDTH - 24,
    alignSelf: 'center',
    zIndex: 9999,
    elevation: 20,
  } as ViewStyle,
})
