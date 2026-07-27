import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import MapView, { Polygon } from 'react-native-maps'
import istanbulGeoJSON from '../../assets/ilce_geojson.json'
import { colorWithOpacity } from '@vyve/gotham'
import { useTheme } from '@vyve/ui-native'

export const MapScreen = () => {
  const { theme } = useTheme()
  const renderPolygons = () => {
    return istanbulGeoJSON.features.map((feature, featureIndex) => {
      if (!feature.geometry || !feature.geometry.coordinates) return null

      let polygons: { latitude: number; longitude: number }[][] = []

      if (feature.geometry.type === 'Polygon') {
        polygons.push(
          feature.geometry.coordinates[0].map((coord) => {
            const [lng, lat] = coord as [number, number]
            return { latitude: lat, longitude: lng }
          }),
        )
      } else if (feature.geometry.type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach((poly) => {
          poly.forEach((ring) => {
            polygons.push(
              ring.map((coord) => {
                const [lng, lat] = coord as [number, number]
                return { latitude: lat, longitude: lng }
              }),
            )
          })
        })
      }

      return polygons.map((coords, polyIndex) => (
        <Polygon
          key={`${featureIndex}-${polyIndex}`}
          coordinates={coords}
          fillColor={colorWithOpacity(theme.colors.primary, Math.random() / 2 + 0.2)} // Opaklık 0.2 ile 0.7 arasında rastgele
          strokeColor={theme.colors.text}
          strokeWidth={1}
        />
      ))
    })
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 41.015137,
          longitude: 28.97953,
          latitudeDelta: 0.6,
          longitudeDelta: 0.6,
        }}
      >
        {renderPolygons()}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
})
