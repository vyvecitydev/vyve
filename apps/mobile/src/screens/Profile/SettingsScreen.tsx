import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  FlatList,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Text, Select, useTheme, Button } from '@vyve/ui-native'
import { useThemeModeStore } from '../../store/themeMode/useThemeModeStore'
import { useTranslation, getLanguage, setLanguage } from '@vyve/gotham-native'
import { useAuthStore } from '../../store/auth/useAuthStore'
import { logout } from '../../services/auth'

// İkonlar
import ProfileEditIcon from '../../assets/icons/profile-edit.svg'
import PasswordIcon from '../../assets/icons/password-check.svg'
import PrivacyIcon from '../../assets/icons/privacy.svg'
import LanguageIcon from '../../assets/icons/world.svg'
import ThemeIcon from '../../assets/icons/theme-mode.svg'
import HelpIcon from '../../assets/icons/help.svg'
import AboutIcon from '../../assets/icons/vyve.svg'
import RightIcon from '../../assets/icons/arrow-right.svg'
import { WebModal } from '../../components/WebModal'
import { updateProfile } from '../../services/profile'
import CustomHeaderWithTitle from '../../components/CustomHeaderWithTitle'

export const SettingsScreen = () => {
  const { theme } = useTheme()
  const navigation = useNavigation<any>()
  const themeMode = useThemeModeStore((state) => state.mode)
  const setThemeMode = useThemeModeStore((state) => state.setMode)
  const logoutStore = useAuthStore((state) => state.logout)
  const { user, setAuth, accessToken, refreshToken } = useAuthStore()

  const [privacyEnabled, setPrivacyEnabled] = useState(user?.privacy || false)
  const [language, setLanguageState] = useState<string>('tr')
  const [themeSelect, setThemeSelect] = useState<'light' | 'dark' | null>(themeMode)
  const [webModalVisible, setWebModalVisible] = useState(false)
  const [webModalTitle, setWebModalTitle] = useState('')
  const [webModalUrl, setWebModalUrl] = useState('')

  const { t } = useTranslation()

  // user varsa gösterilecek alanlar
  const settingsData = [
    ...(user
      ? [
          {
            key: 'editProfile',
            title: t('profile_edit'),
            type: 'navigate',
            screen: 'ProfileEdit',
            icon: ProfileEditIcon,
          },
          // Sadece provider local ise
          ...(user.provider === 'local'
            ? [
                {
                  key: 'changePassword',
                  title: t('change_password'),
                  type: 'navigate',
                  screen: 'ChangePassword',
                  icon: PasswordIcon,
                },
              ]
            : []),
          { key: 'privacy', title: t('profile_privacy'), type: 'switch', icon: PrivacyIcon },
        ]
      : []),
    {
      key: 'language',
      title: t('language'),
      type: 'select',
      options: [
        { label: 'Türkçe', value: 'tr' },
        { label: 'English', value: 'en' },
      ],
      icon: LanguageIcon,
    },
    {
      key: 'theme',
      title: t('theme'),
      type: 'select',
      options: [
        { label: t('dark'), value: 'dark' },
        { label: t('light'), value: 'light' },
      ],
      icon: ThemeIcon,
    },
    {
      key: 'help',
      title: t('help'),
      type: 'link',
      url: 'https://www.vyvecity.com/help',
      icon: HelpIcon,
    },
    {
      key: 'about',
      title: t('about_vyve'),
      type: 'link',
      url: 'https://www.vyvecity.com/about',
      icon: AboutIcon,
    },
  ]

  useEffect(() => {
    const initLanguage = async () => {
      const lang = await getLanguage()
      setLanguageState(lang)
    }
    initLanguage()
  }, [])

  const handleLanguageChange = async (value: string) => {
    await setLanguage(value)
    setLanguageState(value)
  }

  const handleThemeChange = (value: string) => {
    if (value === 'light' || value === 'dark') {
      setThemeMode(value)
      setThemeSelect(value)
    }
  }

  const renderItem = ({ item }: { item: (typeof settingsData)[0] }) => {
    const isPressable = item.type === 'navigate' || item.type === 'link'

    const handlePress = () => {
      if (item.type === 'navigate') {
        navigation.navigate(item.screen)
      } else if (item.type === 'link') {
        setWebModalTitle(item.title)
        setWebModalUrl(item.url || '')
        setWebModalVisible(true)
      }
    }

    const Container: any = isPressable ? TouchableOpacity : View

    return (
      <Container
        onPress={isPressable ? handlePress : undefined}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme.spacing.lg,
          marginBottom: theme.spacing.sm,
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.backgroundSecondary,
        }}
      >
        {/* Sol ikon */}
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#DDD9FB',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: theme.spacing.md,
          }}
        >
          {item.icon && <item.icon width={20} height={20} color={theme.colors.primary} />}
        </View>

        {/* Başlık */}
        <Text variant="body1" style={{ flex: 1 }}>
          {item.title}
        </Text>

        {/* Sağ öğeler */}
        {item.type === 'switch' && (
          <Switch
            value={privacyEnabled}
            onValueChange={async (value) => {
              setPrivacyEnabled(value) // UI'yi anında değiştir

              try {
                // API çağrısı
                await updateProfile(user?.email!, user?.name!, value)
                setAuth({
                  user: {
                    ...user!,
                    privacy: value,
                  },
                  accessToken: accessToken!,
                  refreshToken: refreshToken!,
                })
              } catch (err) {
                console.error(err)
                setPrivacyEnabled(!value)
              }
            }}
            trackColor={{ false: theme.colors.backgroundSecondary, true: theme.colors.primary }}
            thumbColor={theme.colors.backgroundSecondary}
          />
        )}

        {item.type === 'select' && item.key === 'language' && (
          <Select
            value={language}
            onValueChange={handleLanguageChange}
            items={item.options ?? []}
          />
        )}

        {item.type === 'select' && item.key === 'theme' && (
          <Select
            value={themeSelect}
            onValueChange={handleThemeChange}
            items={item.options ?? []}
          />
        )}

        {/* Sağ ok ikonu sadece link veya navigate için */}
        {isPressable && <RightIcon width={8} height={14} color={theme.colors.textSecondary} />}
      </Container>
    )
  }

  const logoutHandle = useCallback(async () => {
    await logout()
    logoutStore()

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    })
  }, [])

  // Logout footer sadece user varsa gösterilecek
  const renderFooter = () =>
    user ? (
      <Button
        variant="danger"
        style={{ marginTop: theme.spacing.lg }}
        title={t('logout')}
        onPress={logoutHandle}
      />
    ) : null

  return (
    <View>
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
      <CustomHeaderWithTitle title={t('settings')} />
      <FlatList
        data={settingsData}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        contentContainerStyle={{ padding: theme.spacing.lg }}
        ListFooterComponent={renderFooter}
      />
      <WebModal
        visible={webModalVisible}
        title={webModalTitle}
        url={webModalUrl}
        onClose={() => setWebModalVisible(false)}
      />
    </View>
  )
}
