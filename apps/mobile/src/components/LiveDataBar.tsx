import { Text, useTheme } from '@vyve/ui-native'
import LottieView from 'lottie-react-native'
import { StyleSheet, View } from 'react-native'

const LiveDataBar = () => {
  const { theme } = useTheme()

  return (
    <View style={[styles.row, { borderRadius: theme.radius.lg, overflow: 'hidden' }]}>
      <View style={[{ flexDirection: 'row' }]}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <LottieView
            source={require('../assets/lotties/green-pulse.json')}
            autoPlay
            speed={0.8}
            style={{ width: 24, height: 24 }}
            loop={true}
          />
        </View>
        <View style={[styles.colContent, { paddingLeft: 0 }]}>
          <Text variant="h6" style={{ fontSize: 14 }}>
            Canlı Veri
          </Text>
          <Text variant="body2" style={[styles.title, { color: theme.colors.textSecondary }]}>
            Şehir genelinde anlık analiz
          </Text>
        </View>
      </View>
      <View style={[styles.colContent, { justifyContent: 'center', flex: 1 }]}>
        <LottieView
          source={require('../assets/lotties/stream.json')}
          autoPlay
          speed={0.8}
          style={{ width: 160, height: 50 }}
          loop={true}
        />
      </View>
      <View style={[styles.colContent, { alignItems: 'flex-end' }]}>
        <Text variant="h6">1234</Text>
        <Text variant="h6" style={[styles.title, { color: theme.colors.textSecondary }]}>
          Aktif Mekan Sayısı
        </Text>
      </View>
    </View>
  )
}

export default LiveDataBar

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap: 12,
  },

  colContent: {
    // flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 10,
    lineHeight: 12,
  },
})
