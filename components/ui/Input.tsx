import React from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ className, label, error, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text mb-2">
          {label}
          {props.required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <input
        className={cn(
          'flex h-10 w-full rounded-md border border-input-border/60 bg-input px-3 py-2 text-sm',
          'text-text',
          'ring-offset-bg file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-text-dim',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  )
}
