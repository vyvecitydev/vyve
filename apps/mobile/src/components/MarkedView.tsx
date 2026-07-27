import React, { forwardRef, memo, useState } from 'react'
import { Alert, StyleSheet, Switch, TouchableOpacity, View } from 'react-native'
import { Modalize, ModalizeHandle, Button, Text, useTheme } from '@vyve/ui-native'
import { colorWithOpacity } from '@vyve/gotham'
import ThumbUpIcon from '../assets/icons/thumb_up.svg'
import ThumbDownIcon from '../assets/icons/thumb_down.svg'
import { t } from '@vyve/gotham-native'

type Props = {
  onCheckin: () => void
}

const MarkedView = forwardRef<ModalizeHandle, Props>(({ onCheckin }, ref) => {
  const { theme } = useTheme()
  const [step, setStep] = useState<1 | 2>(1)
  const [selected, setSelected] = useState<'public' | 'private' | null>(null)
  return (
    <Modalize
      ref={ref}
      modalHeight={220}
      modalStyle={{
        backgroundColor: colorWithOpacity(theme.colors.backgroundSecondary, 0.8),
      }}
    >
      <View
        style={{
          padding: theme.spacing.lg,
          borderTopWidth: 3,
          borderColor: theme.colors.primary,
          borderRadius: theme.radius.lg,
          gap: theme.spacing.lg,
        }}
      >
        <View>
          <Text
            variant="body1"
            style={{
              color: theme.colors.textSecondary,
            }}
          >
            Bu mekanda bulunduğunu göstermek için marked yapabilirsin.
          </Text>
          <Text
            variant="body2"
            style={{
              color: theme.colors.textSecondary,
            }}
          >
            (Sadece buradaysan markedlayabilirsin!)
          </Text>
        </View>
        <View style={{ gap: 36, flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => setSelected('public')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: theme.colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {selected === 'public' && (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: theme.colors.primary,
                  }}
                />
              )}
            </View>

            <Text>Herkese Açık</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelected('private')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: theme.colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {selected === 'private' && (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: theme.colors.primary,
                  }}
                />
              )}
            </View>

            <Text>Sadece Arkadaşlar</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
          <Button
            title=""
            iconLeft={<ThumbDownIcon width={24} height={24} color={theme.colors.text} />}
            textStyle={{ color: theme.colors.text }}
            onPress={() => {
              onCheckin()
              ref && typeof ref !== 'function' && ref.current?.close()
            }}
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
          />

          <Button
            title=""
            iconLeft={<ThumbUpIcon width={24} height={24} color={theme.colors.text} />}
            textStyle={{ color: theme.colors.text }}
            onPress={() => {
              onCheckin()
              ref && typeof ref !== 'function' && ref.current?.close()
            }}
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
          />
        </View> */}
        {/* <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
          <Button
            title=""
            iconLeft={<ThumbDownIcon width={24} height={24} color={theme.colors.text} />}
            textStyle={{ color: theme.colors.text }}
            onPress={() => {
              onCheckin()
              ref && typeof ref !== 'function' && ref.current?.close()
            }}
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
          />

          <Button
            title=""
            iconLeft={<ThumbUpIcon width={24} height={24} color={theme.colors.text} />}
            textStyle={{ color: theme.colors.text }}
            onPress={() => {
              onCheckin()
              ref && typeof ref !== 'function' && ref.current?.close()
            }}
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
          />
        </View> */}
        <View style={{ flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.lg }}>
          <View style={{ flex: 1 }}>
            <Button
              variant="danger"
              title={t('cancel')}
              textStyle={{ color: theme.colors.text }}
              onPress={() => ref && typeof ref !== 'function' && ref.current?.close()}
              style={{
                backgroundColor: colorWithOpacity(theme.colors.danger, 0.2),
              }}
            />
          </View>

          <View style={{ flex: 2 }}>
            <Button
              title="Marked"
              textStyle={{ color: theme.colors.text }}
              onPress={() => {
                onCheckin()
                ref && typeof ref !== 'function' && ref.current?.close()
              }}
              style={{
                backgroundColor: colorWithOpacity(theme.colors.primary, 0.2),
              }}
            />
          </View>
        </View>
      </View>
    </Modalize>
  )
})

const styles = StyleSheet.create({
  title: {
    flex: 1,
    textAlign: 'center',
  },
})

export default memo(MarkedView)
