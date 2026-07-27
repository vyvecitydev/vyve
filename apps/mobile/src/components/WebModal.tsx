import React, { use, useState } from 'react'
import { Modal, View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'
import CloseIcon from '../assets/icons/close.svg'
import { useTheme, Text } from '@vyve/ui-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

interface WebModalProps {
  visible: boolean
  title: string
  url: string
  onClose: () => void
}

export const WebModal: React.FC<WebModalProps> = ({ visible, title, url, onClose }) => {
  const { theme } = useTheme()
  const [loading, setLoading] = useState(true)
  const insets = useSafeAreaInsets()

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.background, paddingTop: insets.top },
        ]}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.colors.background,
              borderBottomColor: theme.colors.border,
              padding: theme.spacing.lg,
            },
          ]}
        >
          <Text variant="h3">{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <CloseIcon width={24} height={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* WebView */}
        {loading && (
          <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
        )}
        <WebView
          source={{ uri: url }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          startInLoadingState
          style={{ flex: 1 }}
        />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -12,
    marginTop: -12,
    zIndex: 10,
  },
})
