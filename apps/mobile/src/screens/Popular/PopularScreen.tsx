// src/screens/Home/HomeScreen.tsx
import React, { useEffect } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { Carousel, Text, useTheme } from '@vyve/ui-native'
import LinearGradient from 'react-native-linear-gradient'
import { t } from '@vyve/gotham-native'
import { SectionWithFlatList } from '../../components/SectionWithFlatlist'
import CompanyCard from '../../components/CompanyCard'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TAB_BAR_HEIGHT } from '../../navigation/TabNavigator'
import { populars } from '../../services/popular'
import { usePopularStore } from '../../store/popular/usePopularStore'
import { CustomHeader } from '../../components/CustomHeader'

const data = [
  { id: 1, image: 'https://picsum.photos/400/200' },
  { id: 2, image: 'https://picsum.photos/400/201' },
  { id: 3, image: 'https://picsum.photos/400/202' },
  { id: 4, image: 'https://picsum.photos/400/203' },
]

const list = [
  {
    id: 1,
    imageUrl: 'https://picsum.photos/400/400?random=1',
    widthRatio: 1,
    heightRatio: 2,
    text: 'Nature Walk',
    percent: 100,
  },
  {
    id: 2,
    imageUrl: 'https://picsum.photos/400/400?random=2',
    widthRatio: 1,
    heightRatio: 1,
    text: 'Urban Life',
    percent: 37,
  },
  {
    id: 3,
    imageUrl: 'https://picsum.photos/400/400?random=3',
    widthRatio: 1,
    heightRatio: 1,
    text: 'Skyline',
    percent: 29,
  },
  {
    id: 4,
    imageUrl: 'https://picsum.photos/400/400?random=4',
    widthRatio: 1,
    heightRatio: 1,
    text: 'Beach Time',
    percent: 15,
  },
  {
    id: 5,
    imageUrl: 'https://picsum.photos/400/400?random=5',
    widthRatio: 1,
    heightRatio: 1,
    text: 'Coffee Mood',
    percent: 44,
  },
  {
    id: 6,
    imageUrl: 'https://picsum.photos/400/400?random=6',
    widthRatio: 1,
    heightRatio: 1,
    text: 'City Vibes',
    percent: 31,
  },
  {
    id: 7,
    imageUrl: 'https://picsum.photos/400/400?random=7',
    widthRatio: 1,
    heightRatio: 1,
    text: 'Mountain Air',
    percent: 22,
  },
  {
    id: 8,
    imageUrl: 'https://picsum.photos/400/400?random=8',
    widthRatio: 1,
    heightRatio: 2,
    text: 'Vintage Car',
    percent: 18,
  },
  {
    id: 9,
    imageUrl: 'https://picsum.photos/400/400?random=9',
    widthRatio: 1,
    heightRatio: 1,
    text: 'Street Art',
    percent: 39,
  },
  {
    id: 10,
    imageUrl: 'https://picsum.photos/400/400?random=10',
    widthRatio: 1,
    heightRatio: 1,
    text: 'Sunset Glow',
    percent: 47,
  },
  {
    id: 11,
    imageUrl: 'https://picsum.photos/400/400?random=11',
    widthRatio: 1,
    heightRatio: 2,
    text: 'Forest Path',
    percent: 9,
  },
  {
    id: 12,
    imageUrl: 'https://picsum.photos/400/400?random=12',
    widthRatio: 1,
    heightRatio: 1,
    text: 'Neon Nights',
    percent: 41,
  },
  {
    id: 13,
    imageUrl: 'https://picsum.photos/400/400?random=13',
    widthRatio: 1,
    heightRatio: 1,
    text: 'Skyline',
    percent: 32,
  },
  {
    id: 14,
    imageUrl: 'https://picsum.photos/400/400?random=14',
    widthRatio: 1,
    heightRatio: 1,
    text: 'Beach Time',
    percent: 46,
  },
  {
    id: 15,
    imageUrl: 'https://picsum.photos/400/400?random=15',
    widthRatio: 1,
    heightRatio: 1,
    text: 'Coffee Mood',
    percent: 25,
  },
  {
    id: 16,
    imageUrl: 'https://picsum.photos/400/400?random=16',
    widthRatio: 1,
    heightRatio: 1,
    text: 'City Vibes',
    percent: 19,
  },
  {
    id: 17,
    imageUrl: 'https://picsum.photos/400/400?random=17',
    widthRatio: 1,
    heightRatio: 1,
    text: 'Mountain Air',
    percent: 33,
  },
  {
    id: 18,
    imageUrl: 'https://picsum.photos/400/400?random=18',
    widthRatio: 1,
    heightRatio: 2,
    text: 'Vintage Car',
    percent: 88,
  },
  {
    id: 19,
    imageUrl: 'https://picsum.photos/400/400?random=19',
    widthRatio: 1,
    heightRatio: 1,
    text: 'Street Art',
    percent: 73,
  },
  {
    id: 20,
    imageUrl: 'https://picsum.photos/400/400?random=20',
    widthRatio: 1,
    heightRatio: 1,
    text: 'Sunset Glow',
    percent: 64,
  },
]

export const PopularScreen = () => {
  const navigation = useNavigation<any>()
  const { theme } = useTheme()

  const insets = useSafeAreaInsets()

  const newPlaces = usePopularStore((state) => state.newPlaces)
  const favorite = usePopularStore((state) => state.favorite)
  const mostVisited = usePopularStore((state) => state.mostVisited)

  return (
    <>
      {/* HEADER */}
      {/* <CustomHeader /> */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + insets.bottom + theme.spacing.lg }}
      >
        <View style={{ position: 'relative' }}>
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent']}
            style={[styles.gradient, styles.topGradient]}
            pointerEvents="none"
          />
          <Carousel data={data} showPagination height={240 + insets.top} autoPlay />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={[styles.gradient, styles.bottomGradient]}
            pointerEvents="none"
          />
          <Text style={styles.text} variant="h2">
            Rafine
          </Text>
          <Text style={[styles.text, { bottom: 8 }]} variant="body2">
            {t('place_of_the_week')}
          </Text>
        </View>
        <View style={{ display: 'flex', gap: theme.spacing.lg, marginTop: theme.spacing.lg }}>
          <SectionWithFlatList
            title={t('favorite_places')}
            data={favorite}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <CompanyCard
                item={item}
                style={{ width: 108, height: 164 }}
                // showPercentage={false}
                
                height={164}
                onPress={() => navigation.navigate('CompanyDetails', { item })}
              />
            )}
          />
          <SectionWithFlatList
            title={t('most_visited_places')}
            data={mostVisited}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <CompanyCard
                item={item}
                style={{ width: 108, height: 164 }}
                // showPercentage={false}
                height={164}
                onPress={() => navigation.navigate('CompanyDetails', { item })}
              />
            )}
          />
          <SectionWithFlatList
            title={t('new_places')}
            data={newPlaces}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <CompanyCard
                item={item}
                style={{ width: 108, height: 164 }}
                // showPercentage={false}
                height={164}
                onPress={() => navigation.navigate('CompanyDetails', { item })}
              />
            )}
          />
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 120,
    zIndex: 2,
  },
  topGradient: {
    top: 0,
  },
  bottomGradient: {
    bottom: 0,
  },
  text: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    color: '#fff',
    zIndex: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
})
