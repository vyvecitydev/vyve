import { Button, Select, Stepper, useTheme } from '@vyve/ui-native'
import { useState, useEffect, useCallback } from 'react'
import { Modal, StyleSheet, Image, Dimensions } from 'react-native'
import { useOnboardingStore, useThemeModeStore } from '../store'
import { Host } from 'react-native-portalize'
import WorldIcon from '../assets/icons/world.svg'
import VyveIcon from '../assets/icons/vyve.svg'
import ThemeModeIcon from '../assets/icons/theme-mode.svg'
import NotificationIcon from '../assets/icons/notification.svg'
import LocationIcon from '../assets/icons/location.svg'
import CheckIcon from '../assets/icons/check-circle.svg'
import {
  t,
  getLanguage,
  setLanguage,
  checkPermission,
  requestPermission,
} from '@vyve/gotham-native'
import { useNavigation } from '@react-navigation/native'

export const FirstLaunchModal = () => {
  const [lang, setLang] = useState<string | null>(null)
  const [tMode, setTMode] = useState<'light' | 'dark' | null>(null)
  const themeMode = useThemeModeStore((state) => state.mode)
  const setThemeMode = useThemeModeStore((state) => state.setMode)

  const navigation = useNavigation<any>()

  useEffect(() => {
    if (lang === null) {
      getDefaultLanguage()
    }
  }, [lang])

  const getDefaultLanguage = useCallback(async () => {
    const _lang = await getLanguage()
    setLang(_lang)
  }, [])

  const setDefaultLanguage = useCallback(async (value: string) => {
    await setLanguage(value)
    setLang(value)
  }, [])

  const checkLocationPermission = useCallback(async () => {
    const status = await checkPermission('location')
    console.log('Camera permission status:', status)
    const newStatus = await requestPermission('location')
    console.log('Camera permission new status:', newStatus)
  }, [])

  const steps = [
    {
      id: '1',
      image: <VyveIcon height={128} width={128} />,
      title: t('welcome'),
      description: t('welcome_message'),
      buttonText: t('next'),
    },
    {
      id: '2',
      image: <WorldIcon height={128} width={128} />,
      title: t('language_selection'),
      description: t('language_selection_message'),
      content: (
        <Select
          value={lang}
          onValueChange={setDefaultLanguage}
          items={[
            { label: 'Türkçe', value: 'tr' },
            { label: 'English', value: 'en' },
          ]}
        />
      ),
      buttonText: t('next'),
    },
    {
      id: '3',
      image: <ThemeModeIcon height={128} width={128} />,
      title: t('theme_selection'),
      description: t('theme_selection_message'),
      content: (
        <Select
          value={tMode || themeMode}
          onValueChange={(val: string) => {
            if (val === 'light' || val === 'dark') {
              setTMode(val)
              setThemeMode(val) // store güncelle
            }
          }}
          items={[
            { label: t('dark'), value: 'dark' },
            { label: t('light'), value: 'light' },
          ]}
        />
      ),
      buttonText: t('next'),
    },
    {
      id: '4',
      image: <NotificationIcon height={128} width={128} />,
      title: t('notifications'),
      description: t('notifications_message'),
      buttonText: t('allow'),
      // onNext: checkNotificationPermission,
    },
    {
      id: '5',
      image: <LocationIcon height={128} width={128} />,
      title: t('location'),
      description: t('location_message'),
      buttonText: t('allow'),
      onNext: checkLocationPermission,
    },
    {
      id: '6',
      image: <CheckIcon height={128} width={128} />,
      title: t('lets_get_started'),
      description: t('lets_get_started_message'),
      content: (
        <Button
          title={t('login_or_signup')}
          variant="primary"
          type="text"
          onPress={() => navigation.navigate('AuthStack')}
        />
      ),
      buttonText: t('finish'),
    },
  ]

  const setHasSeenWelcome = useOnboardingStore((state) => state.setHasSeenWelcome)

  const handleFinish = useCallback(() => {
    setHasSeenWelcome(true)
    navigation.replace('Tabs')
  }, [])

  const { theme } = useTheme()

  return (
    <Host>
      <Image
        source={require('../assets/images/bg.png')}
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: theme.colors.background,
            flex: 1,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
          },
        ]}
      />
      <Stepper
        steps={steps}
        onChangeStep={(index) => {
          if (index === steps.length) {
            handleFinish()
          }
        }}
      />
    </Host>
  )
}
