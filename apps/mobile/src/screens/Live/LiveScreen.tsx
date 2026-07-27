import React, { useCallback, useMemo, useState } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Image,
  Dimensions,
  InteractionManager,
  ScrollView,
} from 'react-native'
import { useTheme, Text, Divider } from '@vyve/ui-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { getOrgs } from '../../services/org'
import { useOrgsStore } from '../../store/org/useOrgStore'
import { useSearchStore } from '../../store/search/useSearchStore'
import ModPill from '../../components/pill/ModPill'
import Pill from '../../components/pill/Pill'
import RecentPill from '../../components/pill/RecentPill'
import { useShallow } from 'zustand/shallow'
import SmartSuggestionCard from '../Profile/SmartSuggestionCard'
import LiveCard from '../../components/LiveCard'
import LiveDataBar from '../../components/LiveDataBar'
import { TAB_BAR_HEIGHT } from '../../navigation/TabNavigator'

export const MODS = [
  { id: 1, title: 'Chill', range: '%0 - %30' },
  { id: 2, title: 'Live', range: '%30 - %60' },
  { id: 3, title: 'Rush', range: '%60 - %100' },
]

const INSIGHT_LIST = [
  {
    title: '21:00’den sonra popülasyonu hızla artan mekanlar',
    desc: 'Gerçek zamanlı analiz',
    variant: 'rush',
  },
  {
    title: 'DJ performansı öne çıkan mekanlar',
    desc: 'Canlı etkinlik verisi',
    variant: 'live',
  },
  {
    title: 'Hafta sonu yoğunlaşan mekanlar',
    desc: 'Anlık trend takibi',
    variant: 'rush',
  },
  {
    title: 'En çok rezervasyon talebi alan mekanlar',
    desc: 'Güncel talep verisi',
    variant: 'live',
  },
  {
    title: 'Rahatça uzun süre oturulabilen mekanlar',
    desc: 'Ortalama oturum süresi',
    variant: 'chill',
  },
  {
    title: 'Detaylı Kokteyl menüsü olan mekanlar',
    desc: 'Menü güncelliği ve çeşitliliği',
    variant: 'chill',
  },
]

type SelectedItem = { type: 'mod'; value: number } | { type: 'tag'; value: string }

export const LiveScreen = ({ navigation }: any) => {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
  const { width, height } = useMemo(() => Dimensions.get('screen'), [])

  const [searchText, setSearchText] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<SelectedItem[]>([])

  const setOrgs = useOrgsStore((state) => state.setOrgs)
  const {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    setPayload,
    clearPayload,
  } = useSearchStore(
    useShallow((state) => ({
      recentSearches: state.recentSearches,
      addRecentSearch: state.addRecentSearch,
      removeRecentSearch: state.removeRecentSearch,
      clearRecentSearches: state.clearRecentSearches,
      setPayload: state.setPayload,
      clearPayload: state.clearPayload,
    })),
  )

  const { selectedMods, selectedTags } = useMemo(() => {
    const mods: number[] = []
    const tags: string[] = []

    selectedFilters.forEach((i) => {
      if (i.type === 'mod') mods.push(i.value)
      else tags.push(i.value)
    })

    return { selectedMods: mods, selectedTags: tags }
  }, [selectedFilters])

  const hasFilters = selectedFilters.length > 0

  const toggleFilter = useCallback((item: SelectedItem) => {
    setSelectedFilters((prev) => {
      const exists = prev.find((i) => i.type === item.type && i.value === item.value)

      if (exists) {
        return prev.filter((i) => !(i.type === item.type && i.value === item.value))
      }

      return [...prev, item]
    })
  }, [])

  const handleSearch = useCallback(
    async (text?: string) => {
      const finalText = (text ?? searchText).trim()

      if (!finalText && !hasFilters) {
        clearPayload()
        handleBack()
        return
      }

      if (finalText) {
        addRecentSearch(finalText)
      }

      const payload = {
        text: finalText,
        mods: selectedMods,
        tags: selectedTags,
      }

      try {
        const res = await getOrgs({ page: 1, limit: 20, search: payload })
        if (res?.success && res.data) {
          console.log('res:', res.data)
          setOrgs(res.data)
          setPayload(payload)
        }
      } catch (error) {
        console.error(error)
        clearPayload()
      }

      handleBack()
    },
    [
      searchText,
      hasFilters,
      selectedMods,
      selectedTags,
      addRecentSearch,
      clearPayload,
      setPayload,
      setOrgs,
      navigation,
    ],
  )

  const removeRecent = (value: string) => {
    removeRecentSearch(value)
  }

  const clearAllRecents = () => {
    clearRecentSearches()
  }

  const MOD_MAP = useMemo(() => {
    const map: Record<number, string> = {}
    MODS.forEach((m) => (map[m.id] = m.title))
    return map
  }, [])

  const getFilterLabel = (item: SelectedItem) =>
    item.type === 'mod' ? MOD_MAP[item.value] : item.value

  const handleBack = useCallback(() => {
    InteractionManager.runAfterInteractions(() => {
      Keyboard.dismiss()
      navigation.goBack()
    })
  }, [navigation])

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top,
          paddingBottom: TAB_BAR_HEIGHT + insets.bottom,
        },
      ]}
    >
      <Image
        source={require('../../assets/images/bg.png')}
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: theme.colors.background,
            width,
            height,
          },
        ]}
      />

      <View style={[styles.container, { gap: theme.spacing.md }]}>
        <View style={{ gap: theme.spacing.md, padding: theme.spacing.lg, paddingBottom: 0 }}>
          <View style={{ gap: theme.spacing.xs }}>
            <View style={[styles.pillWrap, { justifyContent: 'space-around' }]}>
              {MODS.map((item) => (
                <ModPill
                  key={item.id}
                  mod={item}
                  selected={false}
                  onPress={() => toggleFilter({ type: 'mod', value: item.id })}
                />
              ))}
            </View>
          </View>
          <LiveDataBar />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ padding: theme.spacing.lg, paddingTop: 0 }}>
            {INSIGHT_LIST.map((item, index) => (
              <LiveCard
                placeName={item.title}
                vibe={item.desc}
                key={index.toString()}
                // variant={item.variant}
                onPress={() => navigation.navigate('CompanyDetails')}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1 },
  pillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'space-between',
  },
})
