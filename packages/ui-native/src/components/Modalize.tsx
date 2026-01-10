import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { StyleSheet } from 'react-native'
import { Modalize as RNModalize } from 'react-native-modalize'
import { Portal } from 'react-native-portalize'
import { useTheme } from '../theme/ThemeProvider'

export type ModalizeHandle = {
  open: () => void
  close: () => void
}

type Props = {
  children?: any
  snapPoint?: number
  modalHeight?: number
  onOpen?: () => void
  onClose?: () => void
}

export const Modalize = forwardRef<ModalizeHandle, Props>(
  ({ children, snapPoint = 300, modalHeight = 400, onOpen, onClose }, ref) => {
    const { theme } = useTheme()
    const modalizeRef = useRef<RNModalize>(null)

    useImperativeHandle(ref, () => ({
      open: () => modalizeRef.current?.open(),
      close: () => modalizeRef.current?.close(),
    }))

    return (
      <Portal>
        <RNModalize
          ref={modalizeRef}
          snapPoint={snapPoint}
          modalHeight={modalHeight}
          useNativeDriver
          onOpen={onOpen}
          onClose={onClose}
          scrollViewProps={{
            keyboardShouldPersistTaps: 'handled',
          }}
          modalStyle={[
            {
              backgroundColor: theme.colors.backgroundSecondary,
              borderTopLeftRadius: theme.radius.lg,
              borderTopRightRadius: theme.radius.lg,
            },
          ]}
        >
          {children}
        </RNModalize>
      </Portal>
    )
  },
)
