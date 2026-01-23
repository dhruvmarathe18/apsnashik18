'use client'

import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import { cn } from '@/lib/utils/cn'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium text-text',
        nav: 'space-x-1 flex items-center',
        button_previous: 'absolute left-1',
        button_next: 'absolute right-1',
        month_caption: 'flex justify-center pt-1 relative items-center',
        month_grid: 'w-full border-collapse space-y-1',
        weekdays: 'flex',
        weekday: 'text-text-muted rounded-md w-9 font-normal text-[0.8rem]',
        week: 'flex w-full mt-2',
        day: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-muted/30 [&:has([aria-selected])]:bg-muted/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day_button: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
        range_end: 'day-range-end',
        selected: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90',
        today: 'bg-surface-2 text-text font-semibold',
        outside: 'day-outside text-text-dim opacity-50 aria-selected:bg-muted/30 aria-selected:text-text-dim aria-selected:opacity-30',
        disabled: 'text-text-dim opacity-50',
        range_middle: 'aria-selected:bg-muted/50 aria-selected:text-text',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <span className="text-text-muted">‹</span>,
        IconRight: ({ ...props }) => <span className="text-text-muted">›</span>,
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
