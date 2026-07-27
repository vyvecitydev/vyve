import { memo } from 'react'
import { View } from 'react-native'
import { COL_WIDTH } from './CompanyRow'
import InteractiveCompanyCard from './InteractiveCompanyCard'
import { Org } from '../store/org/useOrgStore'
import { Animated } from 'react-native'

type Props = {
  item: Org
  index: number
  fadeAnim: Animated.Value
  activeAnimation: number | null
  onDoubleTap: (index: number) => void
  onLikePress: (item: Org) => void
  onSingleTap: (item: Org) => void
}

const CompanyRowBigColumn = ({
  item,
  index,
  fadeAnim,
  activeAnimation,
  onDoubleTap,
  onLikePress,
  onSingleTap,
}: Props) => {
  return !item ? null : (
    <View style={{ width: COL_WIDTH }}>
      <InteractiveCompanyCard
        item={item}
        index={index}
        height={COL_WIDTH * 2}
        fadeAnim={fadeAnim}
        activeAnimation={activeAnimation}
        onDoubleTap={onDoubleTap}
        onLikePress={onLikePress}
        onSingleTap={onSingleTap}
      />
    </View>
  )
}

export default memo(CompanyRowBigColumn)
