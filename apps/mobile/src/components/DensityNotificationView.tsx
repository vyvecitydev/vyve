import React, { forwardRef, memo, useState } from 'react'
import { Alert, StyleSheet, Switch, TouchableOpacity, View } from 'react-native'
import { Modalize, ModalizeHandle, Button, Text, useTheme } from '@vyve/ui-native'
import { colorWithOpacity } from '@vyve/gotham'
import NotificationIcon from '../assets/icons/notification.svg'
import { t } from '@vyve/gotham-native'
import { CenterProgress } from './CenterProgress'
import Slider from '@react-native-community/slider'

type Props = {
  onCheckin: () => void
}

const DensityNotificationView = forwardRef<ModalizeHandle, Props>(({ onCheckin }, ref) => {
  const { theme } = useTheme()
  const [step, setStep] = useState<1 | 2>(1)
  const [selected, setSelected] = useState<'public' | 'private' | null>(null)
  return (
    <Modalize
      ref={ref}
      modalHeight={680}
      modalStyle={{
        backgroundColor: theme.colors.backgroundSecondary,
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
            variant="h6"
            style={{
              color: theme.colors.text,
              // textAlign: 'center',
            }}
          >
            Yoğunluk Uyarısı
          </Text>
          <Text
            variant="body2"
            style={{
              color: theme.colors.textSecondary,
              // textAlign: 'center',
            }}
          >
            Mekan seçtiğin yoğunluk seviyesine ulaştığında sana bildirim göndeririz.
          </Text>
        </View>

        <View
          pointerEvents="none"
          style={{
            ...StyleSheet.absoluteFillObject,
            justifyContent: 'center',
          }}
        >
          <CenterProgress
            size={140}
            color1={theme.colors.primary}
            color2={theme.colors.backgroundSecondary}
          />
        </View>
        <View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={100}
            value={80}
            // onValueChange={setValue}
            step={1}
            minimumTrackTintColor="#4F46E5"
            maximumTrackTintColor="#ccc"
            thumbTintColor="#4F46E5"
          />
        </View>
        <View style={{ gap: 8, flexDirection: 'column' }}>
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

            <Text>Tek seferlik</Text>
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

            <Text>Tekrar et</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title="Uyarıyı Aktifleştir"
            // textStyle={{ color: theme.colors.text }}
            iconLeft={<NotificationIcon width={20} height={20} color={theme.colors.text} />}
            onPress={() => {
              onCheckin()
              ref && typeof ref !== 'function' && ref.current?.close()
            }}
            style={
              {
                // backgroundColor: colorWithOpacity(theme.colors.primary, 0.2),
              }
            }
          />
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

export default memo(DensityNotificationView)
