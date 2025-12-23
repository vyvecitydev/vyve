export const colorWithOpacity = (hex: string, opacity: number): string => {
  // HEX kodunu normalize et
  const normalized = hex.replace('#', '')

  // RGB değerlerini çıkar
  const bigint = parseInt(normalized, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}
