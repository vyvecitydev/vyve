import React, { useEffect, useRef, useState } from 'react'
import Vyve from '../assets/icons/vyve.svg'
import { Select, Text, useTheme } from '@vyve/ui-native'
import { StyleSheet, TouchableOpacity, View, Animated, Easing, Modal } from 'react-native'
import { colorWithOpacity } from '@vyve/gotham'
import AppsIcon from '../assets/icons/apps.svg'
import { initI18n, tapHaptic } from '@vyve/gotham-native'
import { HapticFeedbackTypes } from 'react-native-haptic-feedback'
import LottieView from 'lottie-react-native'

type LogoProps = {
  size?: number
}

export const Logo = ({ size = 40, ...props }: LogoProps) => {
  const { theme, setThemeColors } = useTheme()
  const [modalVisible, setModalVisible] = useState(false)

  const shine = useRef(new Animated.Value(-1)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(800),

        Animated.timing(shine, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(shine, {
          toValue: -1,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [])

  const purle = '#9849D0'
  const green = '#4e9410'

  const handleChangeTheme = () => {
    tapHaptic(HapticFeedbackTypes.impactMedium)
    if (theme.colors.primary === purle) {
      setThemeColors({
        primary: green,
      })
    } else {
      setThemeColors({
        primary: purle,
      })
    }
    setModalVisible(true)
    setTimeout(() => {
      setModalVisible(false)
    }, 1500)
  }

  return (
    <View style={styles.root}>
      <Vyve height={32} {...props} color={'#9849D0'} />
      <Text variant="h4" style={styles.text}>
        Vyve
      </Text>

      <TouchableOpacity onPress={handleChangeTheme}>
        <Animated.View
          style={{
            overflow: 'hidden',
            borderRadius: 10,
          }}
        >
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '50%',
              backgroundColor: 'rgba(255,255,255,0.6)',
              opacity: 0.4,
              transform: [
                {
                  translateX: shine.interpolate({
                    inputRange: [-1, 1],
                    outputRange: [-120, 120],
                  }),
                },
                {
                  skewX: '20deg',
                },
              ],
            }}
          />

          <View
            style={{
              // borderWidth: 1,
              // borderColor: colorWithOpacity(theme.colors.text, 0.7),
              borderRadius: 10,
              backgroundColor: colorWithOpacity(theme.colors.primary, 0.1),
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              paddingHorizontal: 12,
              paddingVertical: 4,
              gap: 6,
            }}
          >
            <Text
              variant="h6"
              style={{
                color: theme.colors.text,
              }}
            >
              {theme.colors.primary === purle ? 'SPOTS' : 'GYM'}
            </Text>
            <AppsIcon width={20} height={20} color={theme.colors.primary} />
            {/* <ArrowDown width={24} height={24} color={colorWithOpacity(theme.colors.primary, 0.2)} style={{ position: 'absolute', bottom: -8,  }} /> */}
          </View>
        </Animated.View>
      </TouchableOpacity>
      <Modal transparent visible={modalVisible} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.background,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {theme.colors.primary === purle ? (
            <LottieView
              source={require(`../assets/lotties/categories-purple.json`)}
              autoPlay
              loop={false}
              style={{ width: 180, height: 180 }}
            />
          ) : (
            <LottieView
              source={require(`../assets/lotties/categories-green.json`)}
              autoPlay
              loop={false}
              style={{ width: 180, height: 180 }}
            />
          )}
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Roboto-Bold',
    marginRight: 12,
  },
})
