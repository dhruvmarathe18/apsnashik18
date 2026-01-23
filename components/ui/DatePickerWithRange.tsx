'use client'

import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { Calendar } from '@/components/ui/Calendar'
import { Field, FieldLabel } from '@/components/ui/Field'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { type DateRange } from 'react-day-picker'

interface DatePickerWithRangeProps {
  date?: DateRange | undefined
  onDateChange?: (date: DateRange | undefined) => void
  label?: string
  className?: string
}

export function DatePickerWithRange({ 
  date, 
  onDateChange, 
  label = 'Date Range',
  className 
}: DatePickerWithRangeProps) {
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(date)
  const [open, setOpen] = React.useState(false)

  const currentDate = date !== undefined ? date : internalDate

  const handleDateChange = (newDate: DateRange | undefined) => {
    if (date === undefined) {
      setInternalDate(newDate)
    }
    onDateChange?.(newDate)
  }

  return (
    <Field className={className}>
      <FieldLabel htmlFor="date-picker-range">{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-range"
            className="w-full justify-start px-3 text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {currentDate?.from ? (
              currentDate.to ? (
                <>
                  {format(currentDate.from, 'LLL dd, y')} -{' '}
                  {format(currentDate.to, 'LLL dd, y')}
                </>
              ) : (
                format(currentDate.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={currentDate?.from}
            selected={currentDate}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
