import { Text } from '@vyve/ui-native'
import React, { useMemo } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { ExplorerItem } from './ExplorerItem'

type ExplorerItem = {
  id: string
}

type ExplorerRowProps = {
  data: any[]
  reverse?: boolean
}

export const ExplorerRow: React.FC<ExplorerRowProps> = ({ data, reverse }) => {
  console.log('data', data)

  return (
    <View style={[styles.root, reverse && { flexDirection: 'row-reverse' }]}>
      <View style={styles.column}>
        {<ExplorerItem item={data[0]} />}
        {<ExplorerItem item={data[1]} />}
      </View>
      <View style={styles.column}>
        {<ExplorerItem item={data[2]} />}
        {<ExplorerItem item={data[3]} />}
      </View>
      <View style={styles.column}>{<ExplorerItem item={data[4]} />}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
})
