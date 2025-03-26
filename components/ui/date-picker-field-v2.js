"use client"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import DatePickerV2 from "@/components/ui/date-picker-v2"

const DatePickerFieldV2 = ({
    form,
    name,
    label,
    description,
    placeholder = "اختر تاريخ",
    dateFormat = "dd/MM/yyyy",
    ...props
}) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <DatePickerV2
                            value={field.value}
                            onChange={field.onChange}
                            dateFormat={dateFormat}
                            placeholder={placeholder}
                            clearable={true}
                            {...props}
                        />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default DatePickerFieldV2

