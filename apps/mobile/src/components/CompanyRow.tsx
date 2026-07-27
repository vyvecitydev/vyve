import { memo } from 'react'
import { View, Dimensions } from 'react-native'
import CompanyRowBigColumn from './CompanyRowBigColumn'
import CompanyRowSmallColumn from './CompanyRowSmallColumn'
import { Org } from '../store/org/useOrgStore'
import { Animated } from 'react-native'

export const COL_WIDTH = Dimensions.get('window').width / 3

type RowProps = {
  item: { items: Org[]; startIndex: number }
  index: number
  fadeAnims: Animated.Value[]
  activeAnimation: number | null
  onDoubleTap: (index: number) => void
  onLikePress: (item: Org) => void
  onSingleTap: (item: Org) => void
}

const CompanyRow = memo(
  ({
    item,
    index,
    fadeAnims,
    activeAnimation,
    onDoubleTap,
    onLikePress,
    onSingleTap,
  }: RowProps) => {
    const filledItems = [...item.items]
    while (filledItems.length < 5) {
      filledItems.push(null as any)
    }

    const [A, B, C, D, E] = filledItems
    const isReversed = index % 2 === 1
    const baseIndex = item.startIndex

    return (
      <View style={{ flexDirection: 'row' }}>
        {isReversed ? (
          <View style={{ flexDirection: 'row', borderRadius: 12, overflow: 'hidden' }}>
            <CompanyRowBigColumn
              item={A}
              index={baseIndex + 2}
              fadeAnim={fadeAnims[baseIndex + 2]}
              activeAnimation={activeAnimation}
              onDoubleTap={onDoubleTap}
              onLikePress={onLikePress}
              onSingleTap={onSingleTap}
            />
            <CompanyRowSmallColumn
              top={B}
              bottom={D}
              topIndex={baseIndex}
              bottomIndex={baseIndex + 3}
              fadeAnims={fadeAnims}
              activeAnimation={activeAnimation}
              onDoubleTap={onDoubleTap}
              onLikePress={onLikePress}
              onSingleTap={onSingleTap}
            />
            <CompanyRowSmallColumn
              top={C}
              bottom={E}
              topIndex={baseIndex + 1}
              bottomIndex={baseIndex + 4}
              fadeAnims={fadeAnims}
              activeAnimation={activeAnimation}
              onDoubleTap={onDoubleTap}
              onLikePress={onLikePress}
              onSingleTap={onSingleTap}
            />
          </View>
        ) : (
          <View style={{ flexDirection: 'row', borderRadius: 12, overflow: 'hidden' }}>
            <CompanyRowSmallColumn
              top={A}
              bottom={C}
              topIndex={baseIndex}
              bottomIndex={baseIndex + 3}
              fadeAnims={fadeAnims}
              activeAnimation={activeAnimation}
              onDoubleTap={onDoubleTap}
              onLikePress={onLikePress}
              onSingleTap={onSingleTap}
            />
            <CompanyRowSmallColumn
              top={B}
              bottom={D}
              topIndex={baseIndex + 1}
              bottomIndex={baseIndex + 4}
              fadeAnims={fadeAnims}
              activeAnimation={activeAnimation}
              onDoubleTap={onDoubleTap}
              onLikePress={onLikePress}
              onSingleTap={onSingleTap}
            />
            <CompanyRowBigColumn
              item={E}
              index={baseIndex + 2}
              fadeAnim={fadeAnims[baseIndex + 2]}
              activeAnimation={activeAnimation}
              onDoubleTap={onDoubleTap}
              onLikePress={onLikePress}
              onSingleTap={onSingleTap}
            />
          </View>
        )}
      </View>
    )
  },
)

export default memo(CompanyRow)
