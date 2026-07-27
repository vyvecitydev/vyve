import React, { useEffect, useRef, useState } from 'react'
import { Modal, View, StyleSheet, Animated, Image, Dimensions } from 'react-native'
import { useTheme, Text } from '@vyve/ui-native'
import LogoIconSvg from '../assets/images/logo-icon.svg'
import { usePopularStore } from '../store/popular/usePopularStore'
import { populars } from '../services/popular'

const greetings = ['Merhaba', 'Hello', 'Bonjour', 'Hola', 'Ciao', 'Hallo']

const SplashModal = ({ onFinish }: { onFinish: () => void }) => {
  const { theme } = useTheme()
  const [index, setIndex] = useState(0)
  const fadeAnim = useRef(new Animated.Value(0)).current

  // Direkt fonksiyonu alıyoruz
  const setPopular = usePopularStore((state) => state.setPopular)

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await populars()
        if (res.data?.success && res.data.data) {
          setPopular(res.data.data)
        }
      } catch (err) {
        console.error('Failed to fetch popular data', err)
      }
    }

    fetchPopular()
  }, [])

  useEffect(() => {
    const animateGreeting = () => {
      // Fade-in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150, // hızlı fade-in
        useNativeDriver: true,
      }).start(() => {
        // Ekranda kalma süresi
        setTimeout(() => {
          // Fade-out
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150, // hızlı fade-out
            useNativeDriver: true,
          }).start(() => {
            // Sonraki greeting
            setIndex((prev) => (prev + 1) % greetings.length)
          })
        }, 400) // ekranda kalma süresi
      })
    }

    animateGreeting()
    const greetingInterval = setInterval(animateGreeting, 700) // toplam süre

    const timeout = setTimeout(() => {
      clearInterval(greetingInterval)
      onFinish()
    }, greetings.length * 700)

    return () => {
      clearInterval(greetingInterval)
      clearTimeout(timeout)
    }
  }, [])

  const AnimatedText = Animated.createAnimatedComponent(Text)

  return (
    <Modal visible={true} transparent animationType="none">
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Image
          source={require('../assets/images/bg.png')}
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: theme.colors.background,
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
            },
          ]}
        />

        {/* Ortadaki greetings */}
        <View style={styles.middleContainer}>
          <AnimatedText variant={'h1'} style={[{ opacity: fadeAnim, color: theme.colors.text }]}>
            {greetings[index]}
          </AnimatedText>
        </View>

        {/* En alttaki logo */}
        <View style={styles.bottomContainer}>
          <LogoIconSvg height={32} width={32} color={theme.colors.primary} />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  middleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40, // logoyu biraz yukarı çekmek için
  },
})

export default SplashModal
