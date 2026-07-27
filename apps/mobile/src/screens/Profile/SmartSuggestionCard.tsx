import LottieView from 'lottie-react-native'
import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native'

type Props = {
  placeName: string
  vibe: string
  onPress?: () => void
}

const SmartSuggestionCard: React.FC<Props> = ({ placeName, vibe, onPress }) => {
  const glowAnim = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    ).start()
  }, [])

  return (
    <Animated.View
      style={[
        styles.container,
        {
          shadowOpacity: glowAnim,
        },
      ]}
    >
      <Text style={styles.header}>Şu an tam senlik</Text>

      <View style={styles.content}>
        <View style={{ flex: 1 }}>
          <Text style={styles.place}>{placeName}</Text>

          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
            <LottieView
              source={require('../../assets/lotties/enerjik.json')}
              autoPlay
              loop
              style={{
                width: 24,
                height: 24,
              }}
            />
            <Text style={styles.vibe}>{vibe}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Git</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

export default SmartSuggestionCard

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(140, 82, 255, 0.15)',
    // borderWidth: 1,
    borderColor: 'rgba(140, 82, 255, 0.4)',
    shadowColor: '#b996ff',
    shadowRadius: 10,
  },
  header: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  place: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  vibe: {
    color: '#BFA6FF',
    fontSize: 13,
    marginTop: 2,
  },
  time: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#8C52FF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
})
