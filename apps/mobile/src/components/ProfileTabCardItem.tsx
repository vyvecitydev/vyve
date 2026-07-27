import React, { memo } from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import { Text, useTheme } from '@vyve/ui-native'
import moment from 'moment'
import { Swipeable } from 'react-native-gesture-handler'
import TrashIcon from '../assets/icons/trash.svg'

type Props = {
  item: any
  onPress: () => void
  swipeable?: boolean
  registerRef?: (id: string, ref: Swipeable | null) => void
  onSwipeOpen?: (id: string) => void
  onSwipeClose?: (id: string) => void
  onDelete?: (id: string) => void
}

const ProfileTabCardItem = ({
  item,
  onPress,
  swipeable,
  registerRef,
  onSwipeOpen,
  onSwipeClose,
  onDelete,
}: Props) => {
  const { theme } = useTheme()

  const content = (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          flexDirection: 'column',
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.sm,
          marginBottom: 1,
          // borderRadius: theme.radius.md,
          // backgroundColor: 'red',
          // borderWidth: 1,
          // borderColor: theme.colors.border,
          alignItems: 'center',
          width: 80,
        }}
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={{ width: 64, height: 64, borderRadius: theme.radius.md }}
        />

        <View>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            variant="h6"
            style={{ fontSize: 12, lineHeight: 16, marginTop: 4 }}
          >
            {item.text}
          </Text>
          {/* <Text variant="body2" style={{ color: theme.colors.textSecondary }}>
            {item.description}
          </Text> */}
          {/* <Text
            variant="body2"
            style={{ color: theme.colors.textSecondary, fontSize: 10, lineHeight: 12 }}
          >
            {moment(item.checkedInAt || item.likedAt).fromNow()}
          </Text> */}
        </View>
      </View>
    </TouchableOpacity>
  )

  if (!swipeable) return content

  return (
    <Swipeable
      ref={(ref) => registerRef?.(item._id, ref)}
      onSwipeableWillOpen={() => onSwipeOpen?.(item._id)}
      onSwipeableWillClose={() => onSwipeClose?.(item._id)}
      renderRightActions={() => (
        <TouchableOpacity
          style={{
            backgroundColor: theme.colors.danger,
            width: 80,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 1,
            // borderRadius: theme.radius.md,
          }}
          onPress={() => {
            onSwipeClose?.(item._id)
            onDelete?.(item._id)
          }}
        >
          <TrashIcon width={24} height={24} color={theme.colors.text} />
        </TouchableOpacity>
      )}
    >
      {content}
    </Swipeable>
  )
}

export default memo(ProfileTabCardItem)
