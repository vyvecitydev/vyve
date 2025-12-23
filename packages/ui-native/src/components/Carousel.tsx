import React, { useRef, useState, useEffect } from 'react'
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  Image,
  ViewStyle,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native'

const { width } = Dimensions.get('window')

export type Slide = {
  id: string | number
  image?: string | number
  component?: React.ReactNode
}

export interface CarouselProps {
  data: Slide[]
  height?: number
  showPagination?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
  slideContainerStyle?: ViewStyle
  loop?: boolean
  onSlideChange?: (index: number) => void
}

export const Carousel: React.FC<CarouselProps> = ({
  data,
  height = 220,
  showPagination = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  slideContainerStyle,
  loop = true, // default olarak loop true
  onSlideChange,
}) => {
  const flatListRef = useRef<FlatList<Slide>>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const totalSlides = data.length

  // AutoPlay
  useEffect(() => {
    if (!autoPlay || totalSlides <= 1) return

    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1
      if (nextIndex >= totalSlides) {
        nextIndex = loop ? 0 : currentIndex
      }
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true })
      setCurrentIndex(nextIndex)
      onSlideChange?.(nextIndex)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, currentIndex, totalSlides, autoPlayInterval, loop, onSlideChange])

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width)
    setCurrentIndex(index)
    onSlideChange?.(index)
  }

  const renderItem: ListRenderItem<Slide> = ({ item }) => (
    <View style={[{ width, height, overflow: 'hidden' }, slideContainerStyle]}>
      {item.image ? (
        <Image
          source={typeof item.image === 'string' ? { uri: item.image } : item.image}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      ) : (
        item.component
      )}
    </View>
  )

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        initialScrollIndex={0}
      />

      {showPagination && (
        <View style={styles.pagination}>
          {data.map((_, index) => (
            <View key={index} style={[styles.dot, { opacity: currentIndex === index ? 1 : 0.3 }]} />
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  pagination: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
})
