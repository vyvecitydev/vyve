import React, { useEffect, useState } from 'react'
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps'
import { useLocationStore } from '../../store/location/useLocationStore'
import { Button, useTheme, Text, TextInput } from '@vyve/ui-native'
import { t, reverseGeocode, searchLocation } from '@vyve/gotham-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import SearchIcon from '../../assets/icons/search.svg'

const DEFAULT_REGION: Region = {
  latitude: 40.9909,
  longitude: 29.0306,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
}

export function LocationPickerScreen({ navigation }: any) {
  const { location, setLocation } = useLocationStore()
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()

  const [region, setRegion] = useState<Region>({
    ...DEFAULT_REGION,
    latitude: location?.latitude ?? DEFAULT_REGION.latitude,
    longitude: location?.longitude ?? DEFAULT_REGION.longitude,
  })

  const [address, setAddress] = useState<string | null>(null)
  const [loadingAddress, setLoadingAddress] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<any>>([])
  const [loadingSearch, setLoadingSearch] = useState(false)

  // 📍 Harita durunca region güncelle
  const onRegionChangeComplete = (r: Region) => {
    setRegion(r)
  }

  // 🌍 Reverse geocode (debounce gibi davranır)
  useEffect(() => {
    let cancelled = false

    const fetchAddress = async () => {
      try {
        setLoadingAddress(true)
        const result = await reverseGeocode(region.latitude, region.longitude)
        if (!cancelled) {
          if (typeof result === 'string') {
            setAddress(result)
          } else if (result && typeof result === 'object' && 'formattedAddress' in result) {
            setAddress((result as any).formattedAddress ?? null)
          } else {
            setAddress(null)
          }
        }
      } catch {
        if (!cancelled) setAddress(null)
      } finally {
        if (!cancelled) setLoadingAddress(false)
      }
    }

    fetchAddress()
    return () => {
      cancelled = true
    }
  }, [region.latitude, region.longitude])

  // 🔍 Arama yap
  useEffect(() => {
    let cancelled = false
    const search = async () => {
      if (!searchQuery) {
        setSearchResults([])
        return
      }
      try {
        setLoadingSearch(true)
        const results = await searchLocation(searchQuery)
        if (!cancelled) setSearchResults(results ?? [])
      } catch (e) {
        if (!cancelled) setSearchResults([])
      } finally {
        if (!cancelled) setLoadingSearch(false)
      }
    }
    search()
    return () => {
      cancelled = true
    }
  }, [searchQuery])

  const onSelectSearchResult = (item: any) => {
    // Harita koordinatlarını güncelle
    setRegion({
      latitude: item.latitude,
      longitude: item.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    })

    // TextInput değerini güncelle
    setSearchQuery(item.formattedAddress ?? item.name ?? '')

    // Arama sonuçlarını temizle (liste kaybolur)
    setTimeout(() => setSearchResults([]), 0)
  }

  const onConfirm = () => {
    setLocation(region.latitude, region.longitude)
    navigation.goBack()
  }

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        // paddingTop: insets.top,
        backgroundColor: theme.colors.background,
      }}
    >
      {/* 🔎 Arama kutusu */}
      <View
        style={{
          zIndex: 1,
          position: 'absolute',
          left: theme.spacing.lg,
          top: theme.spacing.lg + insets.top,
          right: theme.spacing.lg,
        }}
      >
        <TextInput
          placeholder={t('search_location')}
          value={searchQuery}
          leftIcon={<SearchIcon color={theme.colors.text} />}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />

        {searchResults.length > 0 && (
          <FlatList
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius.md,
              marginTop: 4,
              maxHeight: 200,
            }}
            data={searchResults}
            keyExtractor={(item) => item.place_id || item.formattedAddress || item.name} // stable key
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onSelectSearchResult(item)}
                style={{
                  padding: theme.spacing.sm,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.border,
                }}
              >
                <Text>{item.formattedAddress ?? item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* 📍 Harita */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ ...StyleSheet.absoluteFillObject, left: 0, bottom: 0, right: 0, top: 0 }}
        initialRegion={region}
        region={region}
        onRegionChangeComplete={onRegionChangeComplete}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
      </MapView>

      {/* ALT PANEL */}
      <View
        style={{
          backgroundColor: theme.colors.background,
          padding: theme.spacing.lg,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          gap: theme.spacing.lg,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0
        }}
      >
        <View>
          {loadingAddress ? (
            <Text variant="body2" color="secondary">
              {t('loading')}...
            </Text>
          ) : address ? (
            <Text variant="body1">{address}</Text>
          ) : (
            <Text variant="body2" color="secondary">
              {region.latitude.toFixed(6)}, {region.longitude.toFixed(6)}
            </Text>
          )}
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button
            title={t('cancel')}
            variant="danger"
            type="contained"
            onPress={navigation.goBack}
            style={{ flex: 1 }}
          />
          <Button
            title={t('next')}
            variant="primary"
            type="contained"
            onPress={onConfirm}
            style={{ flex: 2 }}
          />
        </View>
      </View>
    </View>
  )
}
