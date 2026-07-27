import { memo } from 'react'
import { View } from 'react-native'
import { COL_WIDTH } from './CompanyRow'
import InteractiveCompanyCard from './InteractiveCompanyCard'
import { Org } from '../store/org/useOrgStore'
import { Animated } from 'react-native'

type Props = {
  top: Org
  bottom: Org
  topIndex: number
  bottomIndex: number
  fadeAnims: Animated.Value[]
  activeAnimation: number | null
  onDoubleTap: (index: number) => void
  onLikePress: (item: Org) => void
  onSingleTap: (item: Org) => void
}

const CompanyRowSmallColumn = ({
  top,
  bottom,
  topIndex,
  bottomIndex,
  fadeAnims,
  activeAnimation,
  onDoubleTap,
  onLikePress,
  onSingleTap,
}: Props) => (
  <View style={{ width: COL_WIDTH }}>
    <InteractiveCompanyCard
      item={top}
      index={topIndex}
      height={COL_WIDTH}
      fadeAnim={fadeAnims[topIndex]}
      activeAnimation={activeAnimation}
      onDoubleTap={onDoubleTap}
      onLikePress={onLikePress}
      onSingleTap={onSingleTap}
    />
    <InteractiveCompanyCard
      item={bottom}
      index={bottomIndex}
      height={COL_WIDTH}
      fadeAnim={fadeAnims[bottomIndex]}
      activeAnimation={activeAnimation}
      onDoubleTap={onDoubleTap}
      onLikePress={onLikePress}
      onSingleTap={onSingleTap}
    />
  </View>
)

export default memo(CompanyRowSmallColumn)
