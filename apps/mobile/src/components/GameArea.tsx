import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet, ImageBackground, Dimensions, Image } from 'react-native'
import Matter from 'matter-js'
import { GameEngine } from 'react-native-game-engine'
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors'
import { CenterProgress } from './CenterProgress'
import { useTheme } from '@vyve/ui-native'
import { colorWithOpacity } from '@vyve/gotham'
import LottieView from 'lottie-react-native'

const { width, height: windowHeight } = Dimensions.get('window')
const avatars = [
  { id: '1', size: 48, x: 0.16, y: 1 },
  { id: '2', size: 48, x: 0.32, y: 1 },
  { id: '3', size: 48, x: 0.48, y: 1 },
  { id: '4', size: 48, x: 0.48, y: 1 },
  { id: '5', size: 48, x: 0.8, y: 1 },
  { id: '6', size: 48, x: 0.96, y: 1 },
  { id: '1', size: 48, x: 0.16, y: 1 },
  { id: '2', size: 48, x: 0.32, y: 1 },
  { id: '3', size: 48, x: 0.48, y: 1 },
  { id: '4', size: 48, x: 0.48, y: 1 },
  { id: '1', size: 48, x: 0.16, y: 1 },
  { id: '2', size: 48, x: 0.32, y: 1 },
  { id: '3', size: 48, x: 0.48, y: 1 },
  { id: '4', size: 48, x: 0.48, y: 1 },
  { id: '5', size: 48, x: 0.8, y: 1 },
]

const Ball = ({ body, size, random }: any) => {
  const x = body.position.x - size / 2
  const y = body.position.y - size / 2
  const { theme } = useTheme()

  const COLORS = [
    theme.colors.primary,
    theme.colors.info,
    theme.colors.warning,
    theme.colors.danger,
    theme.colors.success,
  ]
  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colorWithOpacity(theme.colors.text, 0.08), // 'rgba(255,255,255,0.08)',
        borderWidth: 1,
      }}
    >
      <Image
        source={{ uri: `https://picsum.photos/${size}/${size}?random=${random}` }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: colorWithOpacity(theme.colors.primary, 0.2),
        }}
      />
    </View>
  )
}

export const GameArea = ({ backgroundUri }: { backgroundUri?: any }) => {
  const { theme } = useTheme()
  const [heightValue, setHeightValue] = useState(windowHeight) // fallback olarak ekran yüksekliği
  const engineRef = useRef(Matter.Engine.create())
  const worldRef = useRef(engineRef.current.world)
  const entitiesRef = useRef<any>({})
  const gameEngineRef = useRef<any>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      Matter.Engine.update(engineRef.current, 16)
    }, 16)
    return () => clearInterval(interval)
  }, [])

  // Accelerometer
  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 50)
    const subscription = accelerometer.subscribe(({ x, y }) => {
      worldRef.current.gravity.x = x * 1.5
      worldRef.current.gravity.y = y * -1.5
    })
    return () => subscription.unsubscribe()
  }, [])

  const setupWorld = (h: number) => {
    const world = worldRef.current
    Matter.World.clear(world, false)
    Matter.Engine.clear(engineRef.current)

    const newEntities: any = {}
    avatars.forEach((a, i) => {
      const random = Math.floor(Math.random() * (5 - 1 + 1) + 1) // random number between 1 and 5
      const ball = Matter.Bodies.circle(a.x * width, a.y * h, a.size / 2, {
        restitution: 0.9,
        friction: 0.005,
        frictionAir: 0.02,
      })
      Matter.World.add(world, ball)
      newEntities[`ball_${i}`] = { body: ball, size: a.size, random, renderer: Ball }
    })

    const floor = Matter.Bodies.rectangle(width / 2, h + 25, width, 50, { isStatic: true })
    const ceiling = Matter.Bodies.rectangle(width / 2, -25, width, 50, { isStatic: true })
    const leftWall = Matter.Bodies.rectangle(-25, h / 2, 50, h, { isStatic: true })
    const rightWall = Matter.Bodies.rectangle(width + 25, h / 2, 50, h, { isStatic: true })
    Matter.World.add(world, [floor, ceiling, leftWall, rightWall])

    entitiesRef.current = newEntities
    if (gameEngineRef.current) gameEngineRef.current.swap(entitiesRef.current)
  }

  return (
    <View
      style={{ flex: 1, width: '100%' }}
      onLayout={(e) => {
        const h = e.nativeEvent.layout.height
        if (h > 0 && h !== heightValue) {
          setHeightValue(h)
          setupWorld(h)
        }
      }}
    >
      {/* 🔥 BACKGROUND LOTTIE */}
      {/* <LottieView
        source={require('../assets/lotties/space.json')}
        autoPlay
        loop
        resizeMode="cover"
        style={StyleSheet.absoluteFillObject}
      /> */}
      {/* <ImageBackground
        source={backgroundUri || require('../assets/images/bg.svg')}
        style={{ width: '100%', height: heightValue }}
        imageStyle={{ resizeMode: 'cover' }}
      > */}
      <GameEngine ref={gameEngineRef} style={{ flex: 1 }} entities={entitiesRef.current} />
      <View
        pointerEvents="none"
        style={{
          ...StyleSheet.absoluteFillObject,
          justifyContent: 'center',
          // alignItems: 'center',
          paddingBottom: 100,
        }}
      >
        <CenterProgress
          size={280}
          color1={theme.colors.primary}
          color2={theme.colors.backgroundSecondary}
        />
      </View>
      {/* </ImageBackground> */}
    </View>
  )
}
