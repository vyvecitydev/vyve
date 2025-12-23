import i18n from 'i18next'
import { initReactI18next, useTranslation as useTranslationOriginal } from 'react-i18next'
import * as RNLocalize from 'react-native-localize'
import { setItem, getItem } from '../storage'
import en from './locales/en'
import tr from './locales/tr'

const resources = { en: { translation: en }, tr: { translation: tr } }

// Telefon dilini al
const getDeviceLanguage = (): string => {
  const locales = RNLocalize.getLocales()
  if (locales && locales.length > 0) {
    const deviceLang = locales[0].languageCode
    return deviceLang === 'tr' ? 'tr' : 'en'
  }
  return 'tr'
}

// i18n init
i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // default, initI18n() ile düzeltilecek
  fallbackLng: 'tr',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

// AsyncStorage’daki dili uygula
export const initI18n = async () => {
  const storedLang = await getItem('user-language')
  const initialLang = storedLang || getDeviceLanguage()
  i18n.changeLanguage(initialLang)
}

// Dil değişimi
export const setLanguage = async (lang: string) => {
  await setItem('user-language', lang)
  i18n.changeLanguage(lang)
}

// Mevcut dili al
export const getLanguage = async () => {
  const lang = await getItem('user-language')
  if (lang) i18n.changeLanguage(lang || getDeviceLanguage())
  return i18n.language
}

// t fonksiyonu export
export const t = i18n.t.bind(i18n)

// useTranslation export
export const useTranslation = () => useTranslationOriginal()

export default i18n
