import React from 'react'
import { useTheme } from '../../hooks/useTheme'

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  children: React.ReactNode
}

export const Button = ({ variant = 'primary', children, style, ...props }: ButtonProps) => {
  const { theme } = useTheme()

  const backgroundColor = theme.colors[variant] || theme.colors.primary
  const textColor = '#fff'

  return (
    <button
      {...props}
      style={{
        backgroundColor,
        color: textColor,
        padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
        border: 'none',
        borderRadius: theme.borderRadius,
        fontSize: theme.fontSize.md,
        // fontWeight: theme..fontWeights.medium,
        cursor: 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  )
}
