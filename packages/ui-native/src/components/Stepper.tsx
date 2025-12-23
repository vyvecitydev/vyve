// packages/ui-native/src/components/Stepper.tsx
import React, { useState } from 'react'
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
import { Button, useTheme } from '../'

export interface Step {
  id: string
  image: any // require('...') veya uri
  title: string
  description: string
  buttonText: string
  content?: React.ReactNode
  onNext?: () => Promise<void> | void // <-- eklendi
}

interface StepperProps {
  steps: Step[]
  onChangeStep?: (index: number) => void
}

export const Stepper: React.FC<StepperProps> = ({ steps, onChangeStep }) => {
  const { theme } = useTheme()
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = async () => {
    const step = steps[currentStep]

    if (step?.onNext) {
      await step.onNext() // izin ister
    }

    const nextIndex = currentStep + 1
    setCurrentStep(nextIndex)
    onChangeStep?.(nextIndex)
  }

  return (
    <View style={[styles.container]}>
      {/* Step içerik */}
      <View style={{ marginBottom: 24 }}>{steps[currentStep].image}</View>
      <Text style={[styles.title, { color: theme.colors.text }]}>{steps[currentStep].title}</Text>
      <Text style={[styles.description, { color: theme.colors.text }]}>
        {steps[currentStep].description}
      </Text>
      {steps[currentStep].content && (
        <View style={{ marginBottom: 24, width: '100%' }}>{steps[currentStep].content}</View>
      )}
      {/* Pagination */}
      <View style={styles.pagination}>
        {steps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === currentStep ? theme.colors.primary : theme.colors.border,
              },
            ]}
          />
        ))}
      </View>

      {/* Step button */}
      <Button
        onPress={handleNext}
        title={steps[currentStep].buttonText}
        style={{ width: '100%' }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  image: {
    width: Dimensions.get('window').width * 0.7,
    height: 200,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
})
