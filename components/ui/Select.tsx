import React from 'react'
import { cn } from '@/lib/utils/cn'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
}

export function Select({ className, label, error, options, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text mb-2">
          {label}
          {props.required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <select
        className={cn(
          'flex h-10 w-full rounded-md border border-input-border/60 bg-input px-3 py-2 text-sm',
          'text-text',
          'ring-offset-bg',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-input text-text">
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  )
}
