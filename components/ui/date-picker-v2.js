"use client"

import { forwardRef, useState, useEffect } from "react"
import { format, isValid } from "date-fns"
import { ar } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const DatePickerV2 = forwardRef(
    (
        {
            value,
            onChange,
            placeholder = "اختر تاريخ",
            className,
            disabled = false,
            dateFormat = "dd/MM/yyyy",
            clearable = true,
            ...props
        },
        ref,
    ) => {
        const [date, setDate] = useState(value)

        useEffect(() => {
            setDate(value)
        }, [value])

        const handleSelect = (selectedDate) => {
            setDate(selectedDate)
            if (onChange) {
                onChange(selectedDate)
            }
        }

        const handleClear = (e) => {
            e.stopPropagation()
            setDate(null)
            if (onChange) {
                onChange(null)
            }
        }

        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        variant="outline"
                        className={cn(" min-w-64 justify-between text-right", !date && "text-muted-foreground", className)}
                        disabled={disabled}
                    >
                        {date && isValid(date) ? (
                            <span>{format(date, dateFormat, { locale: ar })}</span>
                        ) : (
                            <span>{placeholder}</span>
                        )}
                        <div className="flex items-center">
                            {date && clearable && (
                                <Button variant="ghost" size="sm" className="h-5 w-5 p-0 mr-1 rounded-full" onClick={handleClear}>
                                    <span className="sr-only">مسح التاريخ</span>
                                    <span className="text-xs">×</span>
                                </Button>
                            )}
                            <CalendarIcon className="h-4 w-4 opacity-50" />
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleSelect}
                        locale={ar}
                        disabled={disabled || props.minDate ? (date) => date < props.minDate : undefined}
                        initialFocus
                        {...props}
                    />
                </PopoverContent>
            </Popover>
        )
    },
)

DatePickerV2.displayName = "DatePickerV2"

export default DatePickerV2

