import React, { useEffect, useState } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Dimensions,
} from 'react-native'
import LottieView from 'lottie-react-native'
import { useTheme, TextInput, Text, Divider } from '@vyve/ui-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import SearchIcon from '../../assets/icons/search.svg'
import CloseIcon from '../../assets/icons/close-circle.svg'
import { colorWithOpacity } from '@vyve/gotham'
import { setItem, getItem } from '@vyve/gotham-native'
import { getOrgs } from '../../services/org'
import { useOrgsStore } from '../../store/org/useOrgStore'
import { useSearchStore } from '../../store/search/useSearchStore'

const MODS = [
  { id: 1, title: 'Chill' },
  { id: 2, title: 'Normal' },
  { id: 3, title: 'Enerjik' },
]

const MOD_LOTTIES: Record<number, any> = {
  1: require('../../assets/lotties/chill.json'),
  2: require('../../assets/lotties/normal.json'),
  3: require('../../assets/lotties/enerjik.json'),
}

const RECENT_SEARCH_KEY = '@recent_searches'

type SelectedItem = { type: 'mod'; value: number } | { type: 'tag'; value: string }

export const SearchScreen = ({ navigation }: any) => {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()

  const [searchText, setSearchText] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<SelectedItem[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const setPayload = useSearchStore((state) => state.setPayload)
  const clearPayload = useSearchStore((state) => state.clearPayload)
  const availableTags = useSearchStore((state) => state.availableTags)
  const setOrgs = useOrgsStore((state) => state.setOrgs)

  useEffect(() => {
    loadRecentSearches()
  }, [])

  const loadRecentSearches = async () => {
    const raw = await getItem(RECENT_SEARCH_KEY)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) setRecentSearches(parsed)
    } catch {}
  }

  const saveRecentSearches = async (list: string[]) => {
    setRecentSearches(list)
    await setItem(RECENT_SEARCH_KEY, JSON.stringify(list))
  }

  const toggleFilter = (item: SelectedItem) => {
    setSelectedFilters((prev) => {
      const exists = prev.find((i) => i.type === item.type && i.value === item.value)

      if (exists) {
        return prev.filter((i) => !(i.type === item.type && i.value === item.value))
      }

      return [...prev, item]
    })
  }

  const handleSearch = async (text?: unknown) => {
    const finalText =
      typeof text === 'string'
        ? text.trim()
        : typeof searchText === 'string'
        ? searchText.trim()
        : ''

    if (!finalText && selectedFilters.length === 0) {
      clearPayload()
      Keyboard.dismiss()
      navigation.goBack()
      return
    }

    if (finalText) {
      try {
        const raw = await getItem(RECENT_SEARCH_KEY)
        const prev: string[] = raw ? JSON.parse(raw) : []
        const updated = [finalText, ...prev.filter((i) => i !== finalText)].slice(0, 10)
        await saveRecentSearches(updated)
      } catch {}
    }

    const payload = {
      text: finalText,
      mods: selectedFilters.filter((i) => i.type === 'mod').map((i) => i.value),
      tags: selectedFilters.filter((i) => i.type === 'tag').map((i) => i.value),
    }

    try {
      const res = await getOrgs({ page: 1, limit: 20, search: payload })
      if (res?.success && res.data) {
        setOrgs(res.data)
        setPayload(payload)
      }
    } catch (error) {
      console.error(error)
      clearPayload()
    }

    Keyboard.dismiss()
    navigation.goBack()
  }

  const removeRecent = async (value: string) => {
    await saveRecentSearches(recentSearches.filter((i) => i !== value))
  }

  const clearAllRecents = async () => {
    await saveRecentSearches([])
  }

  const getFilterLabel = (item: SelectedItem) => {
    if (item.type === 'mod') {
      return MODS.find((m) => m.id === item.value)?.title ?? ''
    }
    return item.value
  }

  const ModPill = ({
    label,
    modId,
    selected,
    onPress,
  }: {
    label: string
    modId: number
    selected: boolean
    onPress: () => void
  }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[
          styles.modPill,
          {
            backgroundColor: selected
              ? colorWithOpacity(theme.colors.primary, 0.15)
              : colorWithOpacity(theme.colors.backgroundSecondary, 1),
          },
        ]}
      >
        <LottieView
          source={MOD_LOTTIES[modId]}
          autoPlay
          loop
          style={{
            width: 64,
            height: 64,
            opacity: selected ? 1 : 0.6,
          }}
          speed={selected ? 1 : 0.5}
        />

        <Text
          variant="body2"
          style={{
            color: selected ? theme.colors.primary : theme.colors.text,
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    )
  }

  const Pill = ({
    label,
    selected,
    onPress,
  }: {
    label: string
    selected: boolean
    onPress: () => void
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.pill,
        {
          // borderColor: selected ? theme.colors.primary : theme.colors.border,
          backgroundColor: selected
            ? colorWithOpacity(theme.colors.primary, 0.15)
            : colorWithOpacity(theme.colors.backgroundSecondary, 1),
        },
      ]}
    >
      <Text variant="body2" style={{ color: selected ? theme.colors.primary : theme.colors.text }}>
        {label}
      </Text>
    </TouchableOpacity>
  )

  const RecentPill = ({
    label,
    onPress,
    onRemove,
  }: {
    label: string
    onPress: () => void
    onRemove: () => void
  }) => (
    <View
      style={[
        styles.recentPill,
        {
          borderColor: colorWithOpacity(theme.colors.border, 0.6),
          backgroundColor: colorWithOpacity(theme.colors.backgroundSecondary, 1),
        },
      ]}
    >
      <TouchableOpacity style={styles.recentLeft} onPress={onPress}>
        <SearchIcon width={14} height={14} color={theme.colors.textSecondary} />
        <Text variant="body2">{label}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onRemove} hitSlop={8}>
        <Text style={{ color: theme.colors.textSecondary }}>✕</Text>
      </TouchableOpacity>
    </View>
  )

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
            flex: 1,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
          },
        ]}
      />
      <TouchableWithoutFeedback>
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
                    // if (canSearch) {
                    handleSearch()
                    // }
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
            {selectedFilters.length > 0 && (
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
                        onPress={() => handleSearch(item)}
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
                      label={item.title}
                      modId={item.id}
                      selected={selectedFilters.some(
                        (i) => i.type === 'mod' && i.value === item.id,
                      )}
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
                      selected={selectedFilters.some((i) => i.type === 'tag' && i.value === item)}
                      onPress={() => toggleFilter({ type: 'tag', value: item })}
                    />
                  ))}
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    // borderWidth: 1,
  },
  modPill: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 24,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    // borderWidth: 1,
  },
  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
})
