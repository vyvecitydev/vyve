import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  Pressable,
  TouchableOpacity,
  Image,
  Easing,
  FlatList,
  Linking,
  Alert,
  ScrollView,
  Platform,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import Share from 'react-native-share'
import { useTheme, Text, Carousel, ModalizeHandle, Button, BlurView } from '@vyve/ui-native'
import LinearGradient from 'react-native-linear-gradient'
import LocationIcon from '../../assets/icons/location.svg'
import HeartIcon from '../../assets/icons/heart.svg'
import ShareIcon from '../../assets/icons/share.svg'
import BackIcon from '../../assets/icons/arrow-left2.svg'
import PhoneIcon from '../../assets/icons/phone.svg'
import InfoIcon from '../../assets/icons/info.svg'
import CheckCircleIcon from '../../assets/icons/check-circle.svg'
import LottieView from 'lottie-react-native'
import { t, tapHaptic } from '@vyve/gotham-native'
import { showLocation } from 'react-native-map-link'
import { HapticFeedbackTypes } from 'react-native-haptic-feedback'
import { useOrgsStore } from '../../store/org/useOrgStore'
import { checkIn, likeOrg, unlikeOrg } from '../../services/org'
import { useFavoritesStore } from '../../store/favorites/useFavoritesStore'
import { useAuthStore, useUIStore } from '../../store'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { GameArea } from '../../components/GameArea'
import Dart2con from '../../assets/icons/dart2.svg'
import RestaurantIcon from '../../assets/icons/restaurant.svg'
import CloseIcon from '../../assets/icons/close-circle.svg'
import ThumbUpIcon from '../../assets/icons/thumb_up.svg'
import ThumbDownIcon from '../../assets/icons/thumb_down.svg'
import { colorWithOpacity } from '@vyve/gotham'
import Geolocation from '@react-native-community/geolocation'
import { useCheckinsStore } from '../../store/checkins/useCheckinsStore'
import MarkedView from '../../components/MarkedView'
import RNFS from 'react-native-fs'
import { FlashList } from '@shopify/flash-list'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SWIPE_THRESHOLD = SCREEN_HEIGHT / 4
const SWIPE_VELOCITY = 1.5
const INFO_WIDTH = 260 // içeri giren panel genişliği
const LOTTIE_SIZE = 180

export const CompanyDetailsScreen = () => {
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()
  const HERO_HEIGHT = 320  + insets.top
  const GAME_HEIGHT_COLLAPSED = SCREEN_HEIGHT - HERO_HEIGHT - 100
  const GAME_HEIGHT_EXPANDED = SCREEN_HEIGHT - insets.top - 92
  const route = useRoute<any>()
  const { item } = route.params
  const photos = item?.photos?.map((url: string, index: number) => ({
    id: index + 1,
    image: url,
  }))
  const user = useAuthStore((state) => state.user)
  const [showLikeAnim, setShowLikeAnim] = useState(false)
  const heartRef = useRef<View>(null)
  const lastTapRef = useRef<number>(0)
  const animPos = useRef(new Animated.ValueXY()).current
  const animScale = useRef(new Animated.Value(1)).current
  const contentTranslateY = useRef(new Animated.Value(0)).current
  const contentExpanded = useRef(false)

  const likeCount =
    useOrgsStore((s) => s.orgs.find((o) => o._id === item._id)?.likeCount) ?? item.likeCount
  const { theme } = useTheme()
  const containerRef = useRef<View>(null)
  const translateY = useRef(new Animated.Value(0)).current

  const opacity = translateY.interpolate({
    inputRange: [0, SCREEN_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,

      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState

        // sadece bariz aşağı swipe → dismiss
        return dy > 20 && Math.abs(dy) > Math.abs(dx)
      },

      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) translateY.setValue(gestureState.dy)
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > SWIPE_THRESHOLD || gestureState.vy > SWIPE_VELOCITY) {
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start(() => navigation.goBack())
        } else {
          Animated.timing(translateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start()
        }
      },
    }),
  ).current

  const [infoOpen, setInfoOpen] = useState(false)
  const infoAnim = useRef(new Animated.Value(INFO_WIDTH)).current
  const toggleInfoPanel = useCallback(() => {
    Animated.timing(infoAnim, {
      toValue: infoOpen ? INFO_WIDTH : 0,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start()

    setInfoOpen((prev) => !prev)
  }, [infoOpen])

  const isFavorite = useFavoritesStore((state) =>
    state.favorites.some((fav) => fav._id === item._id),
  )

  const { updateLike } = useOrgsStore()

  const onLikePress = useCallback(async () => {
    if (!user) return

    const store = useFavoritesStore.getState()
    const wasFavorite = isFavorite

    // ✅ 1. OPTIMISTIC UPDATE (ANINDA)
    if (wasFavorite) {
      store.deleteFavorite(item._id)
      updateLike(item._id, -1)
    } else {
      store.appendFavorite({ ...item, likedAt: new Date().toISOString() })
      updateLike(item._id, +1)
    }

    try {
      // ✅ 2. BACKEND
      if (wasFavorite) {
        await unlikeOrg(item._id)
      } else {
        await likeOrg(item._id)
      }
    } catch (e) {
      if (wasFavorite) {
        store.appendFavorite({ ...item, likedAt: new Date().toISOString() })
        updateLike(item._id, +1)
      } else {
        store.deleteFavorite(item._id)
        updateLike(item._id, -1)
      }
    }
  }, [isFavorite, item, user])

  const handleCall = (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url)
      } else {
        console.warn('Cannot open phone app')
      }
    })
  }

  const uiStore = useUIStore.getState()

  const handleCheckin = useCallback(() => {
    if (!user) return

    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const store = useCheckinsStore.getState() // Checkin için store, favorilere benzer

        try {
          // ✅ 2. BACKEND
          await checkIn(item._id, latitude, longitude)
          store.appendCheckin({
            ...item,
            checkinAt: new Date().toISOString(),
            location: { latitude, longitude },
          })
          uiStore.showPush('Check-in başarılı!', 'success')

          // ✅ paneli aç
          openCheckinPanel()
        } catch (err: any) {
          uiStore.showPush(err.response?.data?.message, 'error')
          openCheckinPanel()
        }
      },
      (error) => {
        console.error('Location error:', error)
        Alert.alert('Hata', 'Konum alınamadı.')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 },
    )
  }, [user, item])

  const onShare = async () => {
    try {
      let path = ''
      Alert.alert('Paylaş')

      // if (Platform.OS === 'ios') {
      //   path = `${RNFS.MainBundlePath}/story-test.jpg`
      // } else {
      //   path = 'asset:/story-test.jpg'
      // }

      // const base64 = await RNFS.readFile(path, 'base64')

      const url = 'https://picsum.photos/1080/1920'

      const downloadDest = `${RNFS.CachesDirectoryPath}/story.jpg`
      console.log('Paylaşım başarılı1')
      await RNFS.downloadFile({
        fromUrl: url,
        toFile: downloadDest,
      }).promise
      console.log('Paylaşım başarılı2')
      // await Share.open({
      //   social: Share.Social.INSTAGRAM_STORIES,
      //   appId: '1234567890',
      //   backgroundImage: `file://${downloadDest}`,
      // })

      console.log('Paylaşım başarılı3')

      Alert.alert('Paylaş 2')
    } catch (e) {
      console.log('SHARE ERROR:', e)
    }
  }

  const handleShare = async () => {
    try {
      // const shareOptions = {
      //   title: 'Vyve',
      //   message: 'Vyve uygulamasını keşfet!',
      //   url: 'https://vyvecity.com', // isteğe bağlı link veya base64/image
      // }
      // const result = await Share.open(shareOptions)
      // console.log('Paylaşım sonucu:', result)

      await onShare()
    } catch (err) {}
  }

  const [menuVisible, setMenuVisible] = useState(false)
  const [menuOrigin, setMenuOrigin] = useState({ x: 0, y: 0 })

  const menuScale = useRef(new Animated.Value(0)).current
  const menuOpacity = useRef(new Animated.Value(0)).current

  const handleShowMenu = (e: any) => {
    const { pageX, pageY } = e.nativeEvent

    setMenuOrigin({ x: pageX, y: pageY })
    setMenuVisible(true)

    menuScale.setValue(0)
    menuOpacity.setValue(0)

    Animated.parallel([
      Animated.spring(menuScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
      }),
      Animated.timing(menuOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const [checkinPanelVisible, setCheckinPanelVisible] = useState(false)
  const checkinPanelScale = useRef(new Animated.Value(0)).current
  const checkinPanelOpacity = useRef(new Animated.Value(0)).current

  // panel açma fonksiyonu
  const openCheckinPanel = useCallback(() => {
    setCheckinPanelVisible(true)
  }, [])

  // panel kapanma fonksiyonu
  const closeCheckinPanel = useCallback(() => {
    Animated.parallel([
      Animated.timing(checkinPanelScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(checkinPanelOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setCheckinPanelVisible(false))
  }, [])

  useEffect(() => {
    console.log('checkinPanelVisible', checkinPanelVisible)
    // checkinPanelVisible değiştiğinde animasyonu başlat
    if (checkinPanelVisible) {
      checkinPanelScale.setValue(0)
      checkinPanelOpacity.setValue(0)
      Animated.parallel([
        Animated.spring(checkinPanelScale, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(checkinPanelOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [checkinPanelVisible])

  const handleDoubleTapLike = useCallback(
    (e?: {
      nativeEvent: {
        locationX: number
        locationY: number
        pageX: number
        pageY: number
      }
    }) => {
      const now = Date.now()

      if (now - lastTapRef.current < 300) {
        if (!heartRef.current) return

        tapHaptic(HapticFeedbackTypes.impactMedium)

        if (e?.nativeEvent) {
          const { pageX, pageY } = e.nativeEvent

          animPos.stopAnimation()
          animScale.stopAnimation()

          animPos.setValue({
            x: pageX - LOTTIE_SIZE / 2,
            y: pageY - LOTTIE_SIZE / 2,
          })
          animScale.setValue(1)

          setShowLikeAnim(false)
          requestAnimationFrame(() => {
            setShowLikeAnim(true)
          })

          heartRef.current.measureLayout(containerRef.current!, (x, y, w, h) => {
            Animated.timing(animPos, {
              toValue: {
                x: x + w / 2 - LOTTIE_SIZE / 2,
                y: y + h / 2 - LOTTIE_SIZE / 2,
              },
              duration: 600,
              useNativeDriver: true,
            }).start(() => {
              setShowLikeAnim(false)
              if (!isFavorite) onLikePress()
            })
          })
        } else {
          // tags gibi pozisyon istemeyen yerler
          if (!isFavorite) onLikePress()
        }
      }

      lastTapRef.current = now
    },
    [isFavorite, onLikePress],
  )

  const modalRef = useRef<ModalizeHandle>(null)
  const gameHeight = useRef(new Animated.Value(GAME_HEIGHT_COLLAPSED)).current

  useEffect(() => {
    // component mount olduğunda panel açılsın
    // openCheckinPanel()
  }, [])

  const onCheckinPress = () => {
    if (modalRef.current) {
      console.warn('ModalRef var')
      modalRef.current.open()
    } else {
      console.warn('ModalRef null')
    }
  }

  const featuredPlaces = [
    {
      id: '1',
      name: 'Cafe Nero',
      image: 'https://picsum.photos/300/200?1',
    },
    {
      id: '2',
      name: 'Moc İstanbul',
      image: 'https://picsum.photos/300/200?2',
    },
    {
      id: '3',
      name: 'Walter’s Coffee',
      image: 'https://picsum.photos/300/200?3',
    },
    {
      id: '4',
      name: 'Petra Roasting',
      image: 'https://picsum.photos/300/200?4',
    },
  ]

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateY }], opacity, backgroundColor: theme.colors.background },
        ]}
      >
        {/* HEADER */}
        <View
          style={{
            backgroundColor: 'transparent',
            position: 'absolute',
            zIndex: 2,
            height: 50,
            width: 50,
            marginTop: insets.top,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity onPress={navigation.goBack} hitSlop={8} activeOpacity={0.7}>
            <BackIcon color={'#fff'} height={20} width={20} />
          </TouchableOpacity>
        </View>

        <View {...panResponder.panHandlers}>
          <View ref={containerRef} style={{ position: 'relative' }}>
            <LinearGradient
              colors={['rgba(0,0,0,0.4)', 'transparent']}
              style={[styles.gradient, styles.topGradient]}
              pointerEvents="none"
            />
            <Pressable
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: HERO_HEIGHT,
                zIndex: 5,
                pointerEvents: 'auto',
              }}
              onPress={handleDoubleTapLike}
            />
            <Carousel data={photos} showPagination height={HERO_HEIGHT} autoPlay />
            <LinearGradient
              colors={['transparent', theme.colors.background]}
              style={[styles.gradient, styles.bottomGradient]}
              pointerEvents="none"
            />
            {showLikeAnim && (
              <Animated.View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  transform: [...animPos.getTranslateTransform(), { scale: animScale }],
                  zIndex: 999,
                }}
              >
                <LottieView
                  source={require('../../assets/lotties/like.json')}
                  autoPlay
                  loop={false}
                  style={{ width: 180, height: 180 }}
                />
              </Animated.View>
            )}
            {/* <View style={{ position: 'absolute', zIndex: 2, left: 16, bottom: 72 }}>
            <Text variant="h6">330</Text>
          </View>
          <View style={{ position: 'absolute', zIndex: 2, left: 16, bottom: 50 }}>
            <Text variant="h6">330</Text>
          </View> */}
            {/* Sağ üst iconlar */}
            <View
              style={{
                padding: theme.spacing.lg,
                position: 'absolute',
                zIndex: 6,
                bottom: theme.spacing.lg * 2,
                right: theme.spacing.lg,
                left: 0,
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                    gap: theme.spacing.sm,
                  }}
                >
                  <TouchableOpacity onPress={toggleInfoPanel} hitSlop={12}>
                    <InfoIcon color={theme.colors.text} opacity={0.4} />
                  </TouchableOpacity>
                  <Text variant="h2">{item.text}</Text>
                  <TouchableOpacity
                    style={[
                      styles.iconButton,

                      {
                        width: 40,
                        height: 40,
                        flex: 1,
                        alignItems: 'flex-start',
                      },
                    ]}
                    onPress={() => {
                      showLocation({
                        latitude: item.location.coordinates[1],
                        longitude: item.location.coordinates[0],
                        title: item.text,
                        googleForceLatLon: true, // Google Maps doğru koordinatı açsın
                        appsWhiteList: ['google-maps', 'apple-maps', 'waze'], // opsiyonel
                        dialogTitle: 'Hangi haritada açmak istersin?',
                        dialogMessage: 'Lütfen bir harita uygulaması seç',
                        cancelText: 'İptal',
                      })
                    }}
                  >
                    <LocationIcon width={16} height={16} color={theme.colors.info} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      {
                        width: 40,
                        height: 40,
                      },
                    ]}
                    onPress={() => {
                      tapHaptic(HapticFeedbackTypes.impactMedium)
                      onCheckinPress()
                    }}
                  >
                    {/* <View style={styles.badge}>
                    <Text style={[styles.badgeText, { textShadowColor: theme.colors.background }]}> */}
                    {/* <Dart2con
                      width={40}
                      height={40}
                      color={theme.colors.text}
                      style={{ marginRight: theme.spacing.xs }}
                    /> */}
                    {/* </Text>
                  </View> */}
                  </TouchableOpacity>
                </View>
              </View>
              <Text variant="body2" style={{ margin: 0, lineHeight: 12 }}>
                {item.description}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: theme.spacing.xs,
                  marginTop: theme.spacing.sm,
                }}
              >
                <CheckCircleIcon width={16} height={16} color={theme.colors.success} />
                <Text variant="body2" style={{ color: theme.colors.text }}>
                  {t('openHours', { start: '09:00', end: '22:00' })}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.topRightIcons,
                { flexDirection: 'row', flex: 1, gap: theme.spacing.sm },
              ]}
            >
              <TouchableOpacity onPress={handleShowMenu} style={[styles.iconButton]}>
                <RestaurantIcon width={20} height={20} color={'#fff'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare} style={[styles.iconButton]}>
                <ShareIcon width={20} height={20} color={'#fff'} />
              </TouchableOpacity>
              {item.phone && (
                <TouchableOpacity
                  style={[styles.iconButton]}
                  onPress={() => handleCall(item.phone)}
                >
                  <PhoneIcon width={20} height={20} color={'#fff'} />
                </TouchableOpacity>
              )}
              {user && (
                <View ref={heartRef} collapsable={false}>
                  <TouchableOpacity
                    onPress={onLikePress}
                    style={[
                      styles.iconButton,
                      {
                        flexDirection: 'row',
                        display: 'flex',
                        gap: theme.spacing.sm,
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                    ]}
                  >
                    <HeartIcon
                      width={20}
                      height={20}
                      color={isFavorite ? theme.colors.danger : '#fff'}
                      fill={isFavorite ? theme.colors.danger : 'transparent'}
                    />
                    <Text variant="subtitle2" style={{ opacity: 0.8, color: '#fff' }}>
                      {likeCount}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
        {/* Tags FlatList carousel üzerinde, en alt */}
        {item.tags && item.tags.length > 0 && (
          <View
            style={[styles.tagsContainer, { top: insets.top, height: HERO_HEIGHT - 100 }]}
            onTouchEnd={handleDoubleTapLike}
          >
            <FlatList
              data={item.tags}
              keyExtractor={(tag, index) => `${tag}-${index}`}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ width: theme.spacing.sm }} />}
              renderItem={({ item: tag }) => (
                <View style={{ alignSelf: 'flex-end' }}>
                  <View
                    style={{
                      // marginBottom: theme.spacing.xs,
                      paddingVertical: theme.spacing.xs,
                      paddingHorizontal: theme.spacing.sm,
                      borderRadius: theme.radius.md,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <Text
                      variant="h1"
                      style={{
                        color: '#fff',
                        textAlign: 'center',
                        opacity: 0.4,
                      }}
                    >
                      {tag}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        )}
        <View>
          <View style={{ marginBottom: 16, marginTop: 0, margin: 16 }}>
            <View
              style={{
                width: 300,
                marginRight: 10,
                borderRadius: 8,
                overflow: 'hidden',
                backgroundColor: '#222',
              }}
            >
              <Image
                source={{ uri: 'https://digitalvol.com/richmedias/serkan/ads/000.jpeg' }}
                style={{ width: '100%', height: 64 }}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: 8,
                  left: 8,
                  right: 8,
                }}
              >
                <Text style={{ color: 'white', fontWeight: '700' }}>{item.name}</Text>
              </View>
            </View>
          </View>
        </View>

        <Animated.View
          {...panResponder.panHandlers}
          style={{
            zIndex: 7,
            transform: [{ translateY: contentTranslateY }],
          }}
        >
          {/* <Image
            source={require('../../assets/images/bg.png')}
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: theme.colors.background,
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
              },
            ]}
          /> */}
          {/* <GameArea /> */}
          <Animated.View style={{ height: GAME_HEIGHT_COLLAPSED, zIndex: 2 }}>
            <GameArea />
          </Animated.View>
        </Animated.View>
        <Animated.View
          pointerEvents={infoOpen ? 'auto' : 'none'}
          style={[
            styles.infoPanel,
            { top: 160 - insets.top },
            {
              transform: [{ translateX: infoAnim }],
            },
          ]}
        >
          <View style={styles.infoContent}>
            {/* <BlurView style={{ ...StyleSheet.absoluteFillObject }} blurAmount={10} /> */}
            <LinearGradient
              useAngle={true}
              // angle={180}
              colors={[theme.colors.background, 'transparent']}
              style={[styles.gradient, styles.topGradient]}
            />
            <View style={{ flexDirection: 'row', zIndex: 2 }}>
              <Text variant="body2" style={{ fontWeight: 'bold' }}>
                Kapasite:{' '}
              </Text>
              <Text variant="body2">{item.capacity}</Text>
            </View>
            <View style={{ flexDirection: 'row', zIndex: 2 }}>
              <Text variant="body2" style={{ fontWeight: 'bold' }}>
                Alan:{' '}
              </Text>
              <Text variant="body2">120m2</Text>
            </View>
            <View style={{ flexDirection: 'row', zIndex: 2 }}>
              <Text variant="body2" style={{ fontWeight: 'bold' }}>
                Çalışma Saatleri:{' '}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', zIndex: 2 }}>
              <Text variant="body2">09:00 - 22:00</Text>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
      {menuVisible && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              zIndex: 9999,
            },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => {
              Animated.parallel([
                Animated.timing(menuScale, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: true,
                }),
                Animated.timing(menuOpacity, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start(() => setMenuVisible(false))
            }}
          />

          <Animated.View
            style={{
              position: 'absolute',
              top: menuOrigin.y - 20,
              bottom: 20,
              left: 20,
              right: 20,
              borderRadius: 20,
              padding: theme.spacing.lg,
              transform: [
                { translateY: -100 }, // yaklaşık height / 2
                { scale: menuScale },
              ],
              opacity: menuOpacity,
              overflow: 'hidden',
              gap: theme.spacing.md,
            }}
          >
            <BlurView style={StyleSheet.absoluteFillObject} />
            <View
              style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
            >
              <Text variant="h4" style={{ flex: 1 }}>
                Menü
              </Text>
              <TouchableOpacity
                onPress={() => {
                  tapHaptic(HapticFeedbackTypes.impactMedium)
                  setMenuVisible(false)
                }}
              >
                <CloseIcon width={20} height={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: theme.spacing.lg }}>
              <View>
                <Text variant="body1" style={{ fontWeight: 'bold' }}>
                  Sıcak Aperatifler
                </Text>
                <Text variant="body2">Pizza</Text>
                <Text variant="body2">Burger</Text>
                <Text variant="body2">Kahve</Text>
              </View>
              <View>
                <Text variant="body1" style={{ fontWeight: 'bold' }}>
                  Sıcak Aperatifler
                </Text>
                <Text variant="body2">Pizza</Text>
                <Text variant="body2">Burger</Text>
                <Text variant="body2">Kahve</Text>
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      )}
      {checkinPanelVisible && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 9999 }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeCheckinPanel} />
          <Animated.View
            style={{
              position: 'absolute',
              top: SCREEN_HEIGHT / 2 - 60,
              left: 20,
              right: 20,
              borderRadius: 20,
              padding: theme.spacing.lg,
              backgroundColor: colorWithOpacity(theme.colors.backgroundSecondary, 0.95),
              transform: [{ scale: checkinPanelScale }],
              opacity: checkinPanelOpacity,
              overflow: 'hidden',
            }}
          >
            <BlurView style={StyleSheet.absoluteFillObject} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text variant="h6" style={{ flex: 1, textAlign: 'center', opacity: 0.9 }}>
                Bugün mekanı nasıl buldun?
              </Text>
              <TouchableOpacity onPress={closeCheckinPanel}>
                <CloseIcon width={20} height={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', gap: theme.spacing.sm, justifyContent: 'center' }}>
              <Button
                title=""
                iconLeft={<ThumbUpIcon width={30} height={30} color={theme.colors.text} />}
                textStyle={{ color: theme.colors.text }}
                onPress={() => {
                  // onCheckin()
                  // ref && typeof ref !== 'function' && ref.current?.close()
                }}
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'transparent',
                }}
              />
              <Button
                title=""
                iconLeft={<ThumbDownIcon width={30} height={30} color={theme.colors.text} />}
                textStyle={{ color: theme.colors.text }}
                onPress={() => {
                  // onCheckin()
                  // ref && typeof ref !== 'function' && ref.current?.close()
                }}
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'transparent',
                }}
              />
            </View>
          </Animated.View>
        </View>
      )}
      <MarkedView ref={modalRef} onCheckin={handleCheckin} />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  iconButton: {
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    width: 44,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 200,
    zIndex: 2,
  },
  topGradient: {
    top: 0,
  },
  bottomGradient: {
    bottom: 0,
  },
  tagsContainer: {
    position: 'absolute',
    top: 16, // carousel altına yasla
    // left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 3,
    display: 'flex',
    flexDirection: 'column',
    // overflow: 'scroll',
  },
  topRightIcons: {
    position: 'absolute',
    zIndex: 41,
    // justifyContent: 'space-between',
    bottom: 0, // carousel altına yasla
    // top: 10,
    left: 8,
    right: 16,
  },
  infoPanel: {
    position: 'absolute',
    right: 0,
    width: 260,
    overflow: 'hidden',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    zIndex: 5,

    shadowColor: '#000',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 12,
  },
  infoContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    left: '50%',
    marginLeft: -20,
    bottom: 0,
    paddingVertical: 2,
    paddingHorizontal: 4,
    zIndex: 5,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
})
