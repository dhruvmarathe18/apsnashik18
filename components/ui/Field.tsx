'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'

interface FieldProps {
  children: React.ReactNode
  className?: string
}

export function Field({ children, className }: FieldProps) {
  return <div className={cn('flex flex-col gap-2', className)}>{children}</div>
}

interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
}

export function FieldLabel({ children, className, ...props }: FieldLabelProps) {
  return (
    <label className={cn('text-sm font-medium text-text-muted', className)} {...props}>
      {children}
    </label>
  )
}
