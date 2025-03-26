"use client"

import { forwardRef } from "react"
import ReactDatePicker from "react-datepicker"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ar } from "date-fns/locale"

import "react-datepicker/dist/react-datepicker.css"

// Custom input component for the date picker
const CustomInput = forwardRef(({ value, onClick, placeholder, className, disabled }, ref) => (
  <Button
    variant="outline"
    className={cn("w-full justify-start text-right pr-3 font-normal", !value && "text-muted-foreground", className)}
    onClick={onClick}
    ref={ref}
    disabled={disabled}
  >
    {value ? value : <span>{placeholder || "اختر تاريخ"}</span>}
    <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
  </Button>
))

CustomInput.displayName = "CustomInput"

const SimpleDatePicker = ({
  selected,
  onChange,
  placeholder,
  className,
  dateFormat = "dd/MM/yyyy",
  disabled = false,
  minDate,
  maxDate,
  filterDate,
  excludeDates,
  includeDates,
  isClearable = false,
  ...props
}) => {
  return (
    <div className={cn("relative", className)}>
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        customInput={<CustomInput placeholder={placeholder} disabled={disabled} />}
        dateFormat={dateFormat}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        filterDate={filterDate}
        excludeDates={excludeDates}
        includeDates={includeDates}
        isClearable={isClearable}
        locale={ar}
        calendarClassName="bg-background border border-border rounded-md shadow-md p-2 rtl"
        dayClassName={(date) => cn("rounded hover:bg-primary hover:text-primary-foreground")}
        popperClassName="z-50"
        popperPlacement="bottom-end"
        popperModifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
        ]}
        {...props}
      />
    </div>
  )
}

export default SimpleDatePicker

