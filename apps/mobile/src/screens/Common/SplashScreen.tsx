import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Modal, View, StyleSheet, Animated, Image, Dimensions } from 'react-native'
import { useTheme, Text } from '@vyve/ui-native'
import LogoIconSvg from '../../assets/images/logo-icon.svg'
import { usePopularStore } from '../../store/popular/usePopularStore'
import { populars } from '../../services/popular'
import { getOrgs } from '../../services/org'
import { useOrgsStore } from '../../store/org/useOrgStore'
import { useSearchStore } from '../../store/search/useSearchStore'
import { getNotifications } from '../../services/user'
import { useNotificationsStore } from '../../store/notifications'
import { useAuthStore } from '../../store'

const greetings = ['Merhaba', 'Hello', 'Bonjour', 'Hola', 'Ciao', 'Hallo']

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()
  const [index, setIndex] = useState(0)
  const fadeAnim = useRef(new Animated.Value(0)).current

  // 🔹 Direkt fonksiyonu alıyoruz, obje yapmıyoruz
  const user = useAuthStore((state) => state.user)
  const setPopular = usePopularStore((state) => state.setPopular)
  const setOrgs = useOrgsStore((state) => state.setOrgs)
  const setAvailableTags = useSearchStore((state) => state.setAvailableTags)
  const setNotifications = useNotificationsStore((state) => state.setNotifications)

  const fetchPopular = useCallback(async () => {
    try {
      const res = await populars()
      if (res.data?.success && res.data.data) {
        setPopular(res.data.data) // ✅ çalışıyordu
      }
    } catch (err) {
      console.error('Failed to fetch popular data', err)
    }
  }, [])

  const extractTagsFromOrgs = (orgs: any[]) => {
    const set = new Set<string>()

    orgs.forEach((org) => {
      org.tags?.forEach((tag: string) => {
        set.add(tag)
      })
    })

    return Array.from(set)
  }

  const fetchOrgs = useCallback(async () => {
    try {
      const res = await getOrgs()
      if (res?.success && res.data) {
        setOrgs(res.data)
        const tags = extractTagsFromOrgs(res.data)
        setAvailableTags(tags)
      }
    } catch (err) {}
  }, [])

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await getNotifications(user?.id || '')
      if (res.data) {
        setNotifications(res.data)
      }
    } catch (err) {}
  }, [])

  const init = useCallback(async () => {
    await fetchPopular()
    await fetchOrgs()
    await fetchNotifications()
    setLoading(false)
  }, [])

  useEffect(() => {
    init()
  }, []) // dependency olarak sadece mount

  useEffect(() => {
    const animateGreeting = () => {
      // Fade-in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100, // hızlı fade-in
        useNativeDriver: true,
      }).start(() => {
        // ekranda kısa süre kalma
        setTimeout(() => {
          // Fade-out
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 100, // hızlı fade-out
            useNativeDriver: true,
          }).start(() => {
            setIndex((prev) => (prev + 1) % greetings.length)
          })
        }, 100) // ekranda kalma süresi
      })
    }
    animateGreeting()
    let greetingInterval: any
    if (loading) {
      greetingInterval = setInterval(animateGreeting, 300) // toplam süre fade-in + ekranda + fade-out
      return
    }
    const timeout = setTimeout(() => {
      clearInterval(greetingInterval)
      onFinish()
    }, greetings.length * 300) // interval ile senkron

    return () => {
      clearInterval(greetingInterval)
      clearTimeout(timeout)
    }
  }, [loading])

  const AnimatedText = Animated.createAnimatedComponent(Text)

  return (
    <Modal visible={true} transparent animationType="none">
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Image
          source={require('../../assets/images/bg.png')}
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
        <View style={[styles.bottomContainer, { paddingBottom: theme.spacing.lg }]}>
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
  },
})

export default SplashScreen
