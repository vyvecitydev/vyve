export interface OnboardingState {
  hasSeenWelcome: boolean
}

export interface OnboardingActions {
  setHasSeenWelcome: (v: boolean) => void
  resetOnboarding: () => void
}
