import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import BackIcon from '../assets/icons/arrow-left2.svg'
import { useTheme } from '@vyve/ui-native'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text } from '@vyve/ui-native'
import { HEADER_HEIGHT } from './CustomHeader'

type Props = {
  title: string
}

const CustomHeaderWithTitle = ({ title }: Props) => {
  const { theme } = useTheme()
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: HEADER_HEIGHT,
        marginTop: insets.top,
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.lg,
        // backgroundColor: theme.colors.background,
      }}
    >
      <TouchableOpacity onPress={navigation.goBack} hitSlop={8} activeOpacity={0.7}>
        <BackIcon color={theme.colors.text} height={20} width={20} />
      </TouchableOpacity>
      <Text variant="h2">{title}</Text>
    </View>
  )
}

export default CustomHeaderWithTitle
