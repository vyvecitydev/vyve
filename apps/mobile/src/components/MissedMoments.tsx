import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

type Item = {
  placeName: string
  peakScore: number
  time: string
}

type Props = {
  data: Item[]
}

const MissedMoments: React.FC<Props> = ({ data }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Kaçırdığın Anlar</Text>

      {data.map((item, index) => (
        <View key={index} style={styles.card}>
          <View style={{ flex: 1 }}>
            <Text style={styles.place}>{item.placeName}</Text>

            <Text style={styles.desc}>Sen gittikten sonra vibe yükseldi</Text>

            <Text style={styles.time}>{item.time}</Text>
          </View>

          <View style={styles.scoreBox}>
            <Text style={styles.score}>{item.peakScore}</Text>
          </View>
        </View>
      ))}
    </View>
  )
}

export default MissedMoments

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  header: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 10,
  },
  place: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  desc: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2,
  },
  time: {
    color: '#777',
    fontSize: 11,
    marginTop: 4,
  },
  scoreBox: {
    backgroundColor: 'rgba(255, 80, 80, 0.15)',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  score: {
    color: '#FF4D4D',
    fontWeight: 'bold',
  },
})
