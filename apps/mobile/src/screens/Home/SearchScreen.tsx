import React, { useCallback, useMemo, useState } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Image,
  Dimensions,
  InteractionManager,
} from 'react-native'
import { useTheme, TextInput, Text, Divider } from '@vyve/ui-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import CloseIcon from '../../assets/icons/close-circle.svg'
import { getOrgs } from '../../services/org'
import { useOrgsStore } from '../../store/org/useOrgStore'
import { useSearchStore } from '../../store/search/useSearchStore'
import ModPill from '../../components/pill/ModPill'
import Pill from '../../components/pill/Pill'
import RecentPill from '../../components/pill/RecentPill'
import { useShallow } from 'zustand/shallow'

export const MODS = [
  { id: 1, title: 'Chill', range: '%0 - %30' },
  { id: 2, title: 'Live', range: '%31 - %60' },
  { id: 3, title: 'Rush', range: '%61 - %100' },
]

type SelectedItem = { type: 'mod'; value: number } | { type: 'tag'; value: string }

export const SearchScreen = ({ navigation }: any) => {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
  const { width, height } = useMemo(() => Dimensions.get('screen'), [])

  const [searchText, setSearchText] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<SelectedItem[]>([])

  const setOrgs = useOrgsStore((state) => state.setOrgs)
  const {
    availableTags,
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    setPayload,
    clearPayload,
  } = useSearchStore(
    useShallow((state) => ({
      availableTags: state.availableTags,
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
      style={[styles.root, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}
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
      {/* <RadialBG /> */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.container, { padding: theme.spacing.lg, gap: theme.spacing.md }]}>
          {/* 🔍 SEARCH */}
          <View style={styles.searchRow}>
            <View style={{ flex: 1 }}>
              <TextInput
                placeholder="Mekan, semt, özellik ara"
                value={searchText}
                onChangeText={setSearchText}
                autoFocus
                returnKeyType="search"
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setSearchText('')
                    }}
                  >
                    <CloseIcon color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                }
                onSubmitEditing={() => {
                  handleSearch()
                }}
              />
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text variant="body1" style={{ color: theme.colors.primary }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>

          {/* 🎯 SELECTED FILTERS */}
          {hasFilters && (
            <View style={styles.pillWrap}>
              {selectedFilters.map((item) => (
                <Pill
                  key={`${item.type}-${item.value}`}
                  label={getFilterLabel(item)}
                  selected
                  onPress={() => toggleFilter(item)}
                />
              ))}
            </View>
          )}

          {/* 🕘 RECENTS */}
          {recentSearches.length > 0 && (
            <>
              <View style={{ gap: theme.spacing.xs }}>
                <View style={styles.recentHeader}>
                  <Text variant="h6">Recent Searches</Text>
                  <TouchableOpacity onPress={clearAllRecents}>
                    <Text variant="body2" style={{ color: theme.colors.secondary }}>
                      Clear all
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.pillWrap}>
                  {recentSearches.slice(0, 5).map((item) => (
                    <RecentPill
                      key={item}
                      label={item}
                      onPress={() => setSearchText(item)}
                      onRemove={() => removeRecent(item)}
                    />
                  ))}
                </View>
              </View>
              <Divider />
            </>
          )}

          {/* FILTERS */}
          <View style={{ gap: theme.spacing.md }}>
            <View style={{ gap: theme.spacing.xs }}>
              <Text variant="h6">Mods</Text>
              <View style={[styles.pillWrap, { justifyContent: 'space-around' }]}>
                {MODS.map((item) => (
                  <ModPill
                    key={item.id}
                    mod={item}
                    selected={selectedMods.includes(item.id)}
                    onPress={() => toggleFilter({ type: 'mod', value: item.id })}
                  />
                ))}
              </View>
            </View>

            <Divider />

            <View style={{ gap: theme.spacing.xs }}>
              <Text variant="h6">Tags</Text>
              <View style={styles.pillWrap}>
                {availableTags.map((item) => (
                  <Pill
                    key={item}
                    label={item}
                    selected={selectedTags.includes(item)}
                    onPress={() => toggleFilter({ type: 'tag', value: item })}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
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
})
