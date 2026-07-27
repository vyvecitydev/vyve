// ParallaxMisket.tsx
import React, { useEffect, useRef } from 'react'
import { View, StyleSheet, Dimensions, ImageBackground } from 'react-native'
import Matter from 'matter-js'
import { GameEngine } from 'react-native-game-engine'
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors'

const { width } = Dimensions.get('window')

const avatars = [
  { id: '1', size: 72, x: 0.18, y: 0.22 },
  { id: '2', size: 56, x: 0.5, y: 0.15 },
  { id: '3', size: 44, x: 0.8, y: 0.25 },
  { id: '4', size: 60, x: 0.22, y: 0.6 },
  { id: '5', size: 36, x: 0.72, y: 0.6 },
  { id: '6', size: 48, x: 0.42, y: 0.78 },
  { id: '7', size: 72, x: 0.18, y: 0.22 },
  { id: '8', size: 56, x: 0.5, y: 0.15 },
  { id: '9', size: 44, x: 0.8, y: 0.25 },
  { id: '10', size: 60, x: 0.22, y: 0.6 },
  { id: '11', size: 36, x: 0.72, y: 0.6 },
  { id: '12', size: 48, x: 0.42, y: 0.78 },
  { id: '13', size: 72, x: 0.18, y: 0.22 },
  { id: '14', size: 56, x: 0.5, y: 0.15 },
  { id: '15', size: 44, x: 0.8, y: 0.25 },
  { id: '16', size: 60, x: 0.22, y: 0.6 },
  { id: '17', size: 36, x: 0.72, y: 0.6 },
  { id: '18', size: 48, x: 0.42, y: 0.78 },
]

const Ball = ({ body, size }: any) => {
  const x = body.position.x - size / 2
  const y = body.position.y - size / 2
  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
      }}
    />
  )
}

export const ParallaxMisket = ({
  backgroundUri,
  height, // Animated.Value
}: {
  backgroundUri?: any
  height: any
}) => {
  const engine = useRef(Matter.Engine.create()).current
  const world = engine.world

  world.gravity.scale = 0.001
  world.gravity.x = 0
  world.gravity.y = 0

  const entities: any = {}
  const balls: any[] = []

  // Topları oluştur
  avatars.forEach((a, i) => {
    const ball = Matter.Bodies.circle(a.x * width, a.y * 300, a.size / 2, {
      restitution: 0.9,
      friction: 0.005,
      frictionAir: 0.02,
    })
    Matter.World.add(world, ball)
    entities[`ball_${i}`] = { body: ball, size: a.size, renderer: Ball }
    balls.push(ball)
  })

  // Duvarları oluştur
  const floor = Matter.Bodies.rectangle(width / 2, 300 + 25, width, 50, { isStatic: true })
  const ceiling = Matter.Bodies.rectangle(width / 2, -25, width, 50, { isStatic: true })
  const leftWall = Matter.Bodies.rectangle(-25, 300 / 2, 50, 300, { isStatic: true })
  const rightWall = Matter.Bodies.rectangle(width + 25, 300 / 2, 50, 300, { isStatic: true })
  Matter.World.add(world, [floor, ceiling, leftWall, rightWall])

  // Accelerometer
  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 50)
    const subscription = accelerometer.subscribe(({ x, y }) => {
      world.gravity.x = x * 1.5
      world.gravity.y = y * -1.5
    })
    return () => subscription.unsubscribe()
  }, [])

  // Engine update loop
  useEffect(() => {
    const interval = setInterval(() => {
      Matter.Engine.update(engine, 16)
    }, 16)
    return () => clearInterval(interval)
  }, [])

  // height değişince topları ve duvarları güncelle
  useEffect(() => {
    const listener = height.addListener(({ value }: { value: number }) => {
      // Duvarları güncelle
      Matter.Body.setPosition(floor, { x: width / 2, y: value + 25 })
      Matter.Body.setPosition(ceiling, { x: width / 2, y: -25 })
      Matter.Body.setPosition(leftWall, { x: -25, y: value / 2 })
      Matter.Body.setPosition(rightWall, { x: width + 25, y: value / 2 })

      // Topları yeniden scale et
      balls.forEach((b, i) => {
        const origY = avatars[i].y
        Matter.Body.setPosition(b, { x: b.position.x, y: value * origY })
      })
    })

    return () => height.removeListener(listener)
  }, [height])

  return (
    <View style={styles.container}>
      <ImageBackground
        source={backgroundUri || require('../../assets/images/bg.svg')}
        style={[styles.bg, { height: height.__getValue() }]} // başlangıç için
        imageStyle={{ resizeMode: 'cover' }}
      >
        <GameEngine style={{ flex: 1 }} entities={entities} />
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: { flex: 1, width },
})
