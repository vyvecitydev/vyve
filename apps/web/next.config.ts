import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Ensure react-native imports resolve to react-native-web in the web build
    if (!config.resolve)
      config.resolve = { alias: {} } as unknown as { alias: Record<string, string> }
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native': 'react-native-web',
    }
    return config
  },
}

export default nextConfig
