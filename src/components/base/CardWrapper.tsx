'use client'

import { FC, ReactNode } from 'react'

interface CardWrapperProps {
  children: ReactNode
  className?: string
  background?: string
}

const CardWrapper: FC<CardWrapperProps> = ({
  children,
  className = '',
  background,
}) => {
  return (
    <div
      className={`rounded-3xl p-6 w-full ${className}`}
      style={{
        boxShadow:
          '0 1px 2px 0 rgba(156, 140, 237, 0.1), 0 1px 3px 1px rgba(156, 140, 237, 0.1)',
        background: background || 'white',
      }}
    >
      {children}
    </div>
  )
}

export default CardWrapper
