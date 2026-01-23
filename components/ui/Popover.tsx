'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'

interface PopoverProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface PopoverContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const PopoverContext = React.createContext<PopoverContextValue | undefined>(undefined)

function Popover({ children, open: controlledOpen, onOpenChange }: PopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [controlledOpen, onOpenChange]
  )

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative">{children}</div>
    </PopoverContext.Provider>
  )
}

function PopoverTrigger({ asChild, children, ...props }: { asChild?: boolean; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(PopoverContext)
  if (!context) throw new Error('PopoverTrigger must be used within Popover')

  const handleClick = () => {
    context.setOpen(!context.open)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { ...props, onClick: handleClick } as any)
  }

  return (
    <button type="button" onClick={handleClick} {...props}>
      {children}
    </button>
  )
}

function PopoverContent({
  children,
  className,
  align = 'start',
  ...props
}: {
  children: React.ReactNode
  className?: string
  align?: 'start' | 'center' | 'end'
} & React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(PopoverContext)
  if (!context) throw new Error('PopoverContent must be used within Popover')

  if (!context.open) return null

  const alignClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={() => context.setOpen(false)}
      />
      <div
        className={cn(
          'absolute z-50 mt-2 rounded-md border border-border/40 bg-surface shadow-lg ring-1 ring-border/40',
          alignClasses[align],
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  )
}

export { Popover, PopoverTrigger, PopoverContent }
