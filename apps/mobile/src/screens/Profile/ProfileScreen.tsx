import React, { useCallback, useEffect, useState } from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native'
import { TabViewer, useTheme } from '@vyve/ui-native'
import { ProfileCard } from '../../components/ProfileCard'
import HeartIcon from '../../assets/icons/heart.svg'
import Dart2Icon from '../../assets/icons/dart2.svg'
import { getLanguage, useTranslation } from '@vyve/gotham-native'
import moment from 'moment'
// import 'moment/locale/tr'
// import 'moment/locale/en-gb'

import { useFavoritesStore } from '../../store/favorites/useFavoritesStore'
import { useCheckinsStore } from '../../store/checkins/useCheckinsStore'

import ProfileTabCard from '../../components/ProfileTabCard'
import { useAuthStore } from '../../store'
import VibeStatusCard from '../../components/VyveStatusCard'
import LastDecisionCard from '../../components/LastDecisionCard'
import MissedMoments from '../../components/MissedMoments'
import SmartSuggestionCard from './SmartSuggestionCard'
import { VibeStats } from '../../components/VibeStats'
import { TAB_BAR_HEIGHT } from '../../navigation/TabNavigator'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colorWithOpacity } from '@vyve/gotham'

export const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [lang, setLang] = useState<string | null>(null)

  useEffect(() => {
    if (lang === null) {
      getDefaultLanguage()
    }
  }, [])

  const getDefaultLanguage = useCallback(async () => {
    const _lang = await getLanguage()
    if (_lang === 'tr') moment.locale('tr')
    setLang(_lang)
  }, [])

  const favorites = useFavoritesStore((state) => state.favorites)
  const checkins = useCheckinsStore((state) => state.checkins)

  const handleDeleteCheckin = (id: string) => {
    // useCheckinsStore.getState().removeCheckin(id)
  }

  const handleDeleteFavorite = (id: string) => {
    // useFavoritesStore.getState().removeFavorite(id)
  }

  const { user } = useAuthStore()

  const insets = useSafeAreaInsets()

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
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
      <ProfileCard profileUser={user} />

      <ScrollView
        contentContainerStyle={{
          // paddingBottom: 80,
          flexGrow: 1,
          // flex: 1,
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.lg,
        }}
        // style={{ flex: 1 }}
        // contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <VibeStatusCard
          title="Your Vyve status"
          description="Your current vyve status based on your activity and interactions."
          isActive={true}
        />

        <VibeStats
          stats={[
            { label: 'Kalabalık Tercihi', value: 87 },
            { label: 'En Aktif Saatin', value: '21:40' },
            { label: 'Keşfedilen Yer', value: 5 },
            { label: 'Favori Mekan', value: 5 },
          ]}
        />

        <LastDecisionCard
          placeName="Evening Glow"
          image="https://picsum.photos/200"
          score={84}
          description="Oraya gittiğinde yoğunluk %84'tü."
          timeAgo="2 saat önce"
        />
        <MissedMoments
          data={[
            {
              placeName: 'Sunset Lounge',
              peakScore: 91,
              time: '00:45 - 01:30',
            },
          ]}
        />
        <SmartSuggestionCard
          placeName="Night District"
          vibe="Rush"
          onPress={() => console.log('navigate')}
        />
      </ScrollView>
      <View
        style={{
          height: 186,
          marginBottom: TAB_BAR_HEIGHT,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 3,
        }}
      >
        <TabViewer
          image={require('../../assets/images/bg.png')}
          tabs={[
            {
              key: 'account',
              title: 'Katıldıklarım',
              component: (
                <ProfileTabCard
                  data={checkins}
                  navigation={navigation}
                  swipeable
                  onDelete={handleDeleteCheckin}
                />
              ),
            },
            {
              key: 'privacy',
              title: t('favorites'),
              component: (
                <ProfileTabCard
                  data={favorites}
                  navigation={navigation}
                  swipeable
                  onDelete={handleDeleteFavorite}
                />
              ),
            },
          ]}
        />
      </View>
    </View>
  )
}
