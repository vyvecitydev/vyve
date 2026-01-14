import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback'

export const tapHaptic = (type: HapticFeedbackTypes) => {
  HapticFeedback.trigger(type, {
    enableVibrateFallback: true,
  })
}
