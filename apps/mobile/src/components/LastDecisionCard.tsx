import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Image, Animated } from 'react-native'
import CircularScore from './CircularScoreComponent'

type Props = {
  placeName: string
  image: string
  score: number
  description: string
  timeAgo: string
}

const LastDecisionCard: React.FC<Props> = ({ placeName, image, score, description, timeAgo }) => {
  const animatedScore = useRef(new Animated.Value(0)).current
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    const listener = animatedScore.addListener(({ value }) => {
      setDisplayScore(Math.floor(value))
    })

    return () => {
      animatedScore.removeListener(listener)
    }
  }, [])

  useEffect(() => {
    Animated.timing(animatedScore, {
      toValue: score,
      duration: 1000,
      useNativeDriver: false,
    }).start()
  }, [score])

  const animatedText = animatedScore.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 100],
  })

  return (
    <View style={styles.container}>
      {/* Left */}
      <View style={styles.left}>
        <Image source={{ uri: image }} style={styles.image} />

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{placeName}'a gitmen iyi bir karardı.</Text>

          <Text style={styles.description}>{description}</Text>

          <Text style={styles.time}>{timeAgo}</Text>
        </View>
      </View>

      {/* Right Score */}
      <CircularScore score={score} />
    </View>
  )
}

export default LastDecisionCard

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  title: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2,
  },
  time: {
    color: '#777',
    fontSize: 11,
    marginTop: 4,
  },
  scoreContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#00FF85',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    color: '#00FF85',
    fontWeight: 'bold',
    fontSize: 16,
  },
})
