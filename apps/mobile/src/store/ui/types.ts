export interface UIState {
  isLoading: boolean
  modal: string | null
}

export interface UIActions {
  setLoading: (v: boolean) => void
  showModal: (id: string) => void
  hideModal: () => void
}
