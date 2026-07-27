import React, { useState, useRef, useEffect, useMemo } from 'react'
import { View, Animated, StyleSheet, TouchableOpacity } from 'react-native'
import { BlurView, useTheme } from '@vyve/ui-native'
import ActiveFilterBar from './ActiveFilterBar'
import FilterIcon from '../assets/icons/filter.svg'
import CloseIcon from '../assets/icons/close.svg'
import { useSearchStore } from '../store/search/useSearchStore'
import { useShallow } from 'zustand/shallow'
import { getOrgs } from '../services/org'
import { useOrgsStore } from '../store/org/useOrgStore'

export const ToggleableFilterBar = () => {
  const { theme } = useTheme()

  const [expanded, setExpanded] = useState(true)
  const [barHeight, setBarHeight] = useState(0)
  const [visible, setVisible] = useState(false)

  const animation = useRef(new Animated.Value(1)).current
  const containerAnim = useRef(new Animated.Value(0)).current // görünürlük animasyonu

  const { payload, setPayload, clearPayload } = useSearchStore(
    useShallow((s) => ({
      payload: s.payload,
      setPayload: s.setPayload,
      clearPayload: s.clearPayload,
    })),
  )

  // 🔥 Filtre var mı?
  const hasActiveFilters = useMemo(() => {
    if (!payload) return false

    return (
      !!payload.text ||
      (payload.tags && payload.tags.length > 0) ||
      (payload.mods && payload.mods.length > 0)
    )
  }, [payload])

  // 🔥 Otomatik show / hide animasyonu
  useEffect(() => {
    if (hasActiveFilters) {
      setVisible(true)

      Animated.timing(containerAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start()
    } else {
      setExpanded(false)

      Animated.timing(containerAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false)
      })
    }
  }, [hasActiveFilters])

  const handleRemove = async (item: { type: 'text' | 'tag' | 'mod'; value: any }) => {
    if (!payload) return

    let newPayload = { ...payload }

    if (item.type === 'text') {
      newPayload.text = ''
    }

    if (item.type === 'tag') {
      newPayload.tags = payload.tags?.filter((t: string) => t !== item.value)
    }

    if (item.type === 'mod') {
      newPayload.mods = payload.mods?.filter((m: number) => m !== item.value)
    }

    setPayload(newPayload)

    const res = await getOrgs({ page: 1, limit: 20, search: newPayload })
    if (res?.success && res.data) {
      useOrgsStore.getState().setOrgs(res.data)
    }
  }

  const handleClearAll = async () => {
    clearPayload()

    const res = await getOrgs({ page: 1, limit: 20, search: null })
    if (res?.success && res.data) {
      useOrgsStore.getState().setOrgs(res.data)
    }
  }

  const toggle = () => {
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start()

    setExpanded(!expanded)
  }

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -barHeight + theme.spacing.lg + 12],
  })

  const barOpacity = animation

  const containerOpacity = containerAnim
  const containerTranslate = containerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 0],
  })

  if (!visible) return null

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: containerOpacity,
          transform: [{ translateY: containerTranslate }],
        },
      ]}
    >
      {/* 🔹 Filter Bar */}
      <Animated.View
        onLayout={(e) => setBarHeight(e.nativeEvent.layout.height)}
        style={[
          styles.bar,
          {
            opacity: barOpacity,
          },
        ]}
      >
        <BlurView style={StyleSheet.absoluteFillObject} />
        <ActiveFilterBar
          payload={payload}
          onRemoveFilter={handleRemove}
          onClearAll={handleClearAll}
        />
      </Animated.View>

      {/* 🔹 Toggle Icon */}
      <Animated.View style={{ transform: [{ translateY }] }}>
        <TouchableOpacity
          style={[
            styles.iconWrapper,
            {
            //   backgroundColor: expanded ? theme.colors.danger : theme.colors.info,
              width: expanded ? 36 : 48,
              height: expanded ? 36 : 48,
              borderRadius: expanded ? 18 : 24,
              borderWidth: 2,
              borderColor: '#fff',
            },
          ]}
          onPress={toggle}
        >
          <BlurView style={StyleSheet.absoluteFillObject} />
          {expanded ? (
            <CloseIcon width={16} height={16} color={theme.colors.danger} />
          ) : (
            <FilterIcon width={20} height={20} color={theme.colors.info} />
          )}
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'flex-end',
    paddingRight: 16,
    paddingBottom: 16,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bar: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    overflow: 'hidden',
  },
})
