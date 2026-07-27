import { memo } from 'react'
import { Animated, ViewStyle } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { tapHaptic } from '@vyve/gotham-native'
import { HapticFeedbackTypes } from 'react-native-haptic-feedback'
import CompanyCard from './CompanyCard'
import { Org } from '../store/org/useOrgStore'

type Props = {
  item: Org
  index: number
  height: number
  fadeAnim: Animated.Value
  activeAnimation: number | null
  onDoubleTap: (index: number) => void
  onLikePress: (item: Org) => void
  onSingleTap: (item: Org) => void
  style?: ViewStyle
}

const InteractiveCompanyCard = ({
  item,
  index,
  height,
  fadeAnim,
  activeAnimation,
  onDoubleTap,
  onLikePress,
  onSingleTap,
  style,
}: Props) => {
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDelay(100)
    .onEnd(() => {
      tapHaptic(HapticFeedbackTypes.impactMedium)
      onDoubleTap(index)
      onLikePress(item)
    })

  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      onSingleTap(item)
    })

  const gesture = Gesture.Exclusive(doubleTap, singleTap)

  if (!item) return null

  return (
    <GestureDetector gesture={gesture}>
      <CompanyCard
        item={item}
        height={height}
        showLikeAnimation={activeAnimation === index}
        likeOpacity={fadeAnim}
        style={style}
      />
    </GestureDetector>
  )
}

export default memo(InteractiveCompanyCard)
