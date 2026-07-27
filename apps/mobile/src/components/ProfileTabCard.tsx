import React, { memo, useRef } from 'react'
import { FlatList } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Swipeable } from 'react-native-gesture-handler'
import ProfileTabCardItem from './ProfileTabCardItem'
import { useTheme } from '@vyve/ui-native'
import { TAB_BAR_HEIGHT } from '../navigation/TabNavigator'

type Props = {
  data: any[]
  navigation: any
  swipeable?: boolean
  onDelete?: (id: string) => void
}

const ProfileTabCard = ({ data, navigation, swipeable, onDelete }: Props) => {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()

  const swipeRefs = useRef<Record<string, Swipeable | null>>({})
  const openedId = useRef<string | null>(null)

  const handleOpen = (id: string) => {
    if (openedId.current && openedId.current !== id) {
      swipeRefs.current[openedId.current]?.close()
    }
    openedId.current = id
  }

  const handleClose = (id: string) => {
    if (openedId.current === id) openedId.current = null
  }

  return (
    <FlatList
      data={data}
      horizontal
      keyExtractor={(item, i) => item._id + i}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        // paddingLeft: 16,
        // paddingRight: 8,
        paddingBottom: TAB_BAR_HEIGHT + insets.bottom,
      }}
      snapToAlignment="start"
      decelerationRate="fast"
      snapToInterval={260}
      bounces={false}
      overScrollMode="never"
      onScrollBeginDrag={() => {
        if (openedId.current) {
          swipeRefs.current[openedId.current]?.close()
          openedId.current = null
        }
      }}
      renderItem={({ item }) => (
        <ProfileTabCardItem
          item={item}
          swipeable={false}
          onPress={() => navigation.navigate('CompanyDetails', { item })}
          registerRef={(id, ref) => (swipeRefs.current[id] = ref)}
          onSwipeOpen={handleOpen}
          onSwipeClose={handleClose}
          onDelete={onDelete}
        />
      )}
    />
  )
}

export default memo(ProfileTabCard)
