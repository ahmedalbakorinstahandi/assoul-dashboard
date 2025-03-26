"use client";

import React, { useEffect, useState } from "react";
// import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { CircleChevronLeft, CircleChevronRight, Minus, Plus } from "lucide-react";
import DatePickerV2 from "@/components/ui/date-picker-v2"

import SimpleDatePicker, { DateOnlyPicker, DateTimePicker, YearPicker } from "@/components/ui/date-picker"
// تعريف القيم المبدئية للفلتر
const initialFilter = {
    patient_id: "",
    measured_at_from: null,
    measured_at_to: null,
    taken_date_from: null,
    taken_date_to: null,
    consumed_date_from: null,
    consumed_date_to: null,
    activity_date_from: null,
    activity_date_to: null,
};

export function DateFilter({ activeTab, filter, setFilter }) {
    const [selectedDate, setSelectedDate] = useState(null);

    // دالة لضبط بداية ونهاية اليوم للتاريخ المختار
    const getStartAndEndOfDay = (date) => {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        return { startOfDay, endOfDay };
    };

    // تحديث الفلتر بناءً على التاريخ والتاب النشط
    const handleDateChange = (date) => {
        setSelectedDate(date);
        if (date) {
            const { startOfDay, endOfDay } = getStartAndEndOfDay(date);
            switch (activeTab) {
                case "blood-sugar-readings":
                    setFilter((prev) => ({ ...prev, measured_at_from: startOfDay, measured_at_to: endOfDay }));
                    break;
                case "insulin-doses":
                    setFilter((prev) => ({ ...prev, taken_date_from: startOfDay, taken_date_to: endOfDay }));
                    break;
                case "meals":
                    setFilter((prev) => ({ ...prev, consumed_date_from: startOfDay, consumed_date_to: endOfDay }));
                    break;
                case "physical-activities":
                    setFilter((prev) => ({ ...prev, activity_date_from: startOfDay, activity_date_to: endOfDay }));
                    break;
                default:
                    break;
            }
        } else {
            // عند حذف التاريخ، يتم إعادة تعيين القيم الخاصة بالتاب النشط
            switch (activeTab) {
                case "blood-sugar-readings":
                    setFilter((prev) => ({ ...prev, measured_at_from: null, measured_at_to: null }));
                    break;
                case "insulin-doses":
                    setFilter((prev) => ({ ...prev, taken_date_from: null, taken_date_to: null }));
                    break;
                case "meals":
                    setFilter((prev) => ({ ...prev, consumed_date_from: null, consumed_date_to: null }));
                    break;
                case "physical-activities":
                    setFilter((prev) => ({ ...prev, activity_date_from: null, activity_date_to: null }));
                    break;
                default:
                    break;
            }
        }
    };

    // أمثلة على أزرار التقليب: اختيار تاريخ اليوم أو الأمس
    const handleDateOffset = (offset) => {
        const currentDate = selectedDate || new Date(); // إذا لم يكن هناك تاريخ محدد، استخدم التاريخ الحالي
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + offset);
        handleDateChange(newDate);
    };
    // مراقبة التغييرات في الفلتر وتحديث selectedDate بناءً على التواريخ في الفلتر
    useEffect(() => {
        if (activeTab === "blood-sugar-readings") {
            setSelectedDate(filter.measured_at_from ? new Date(filter.measured_at_from) : null);
        } else if (activeTab === "insulin-doses") {
            setSelectedDate(filter.taken_date_from ? new Date(filter.taken_date_from) : null);
        } else if (activeTab === "meals") {
            setSelectedDate(filter.consumed_date_from ? new Date(filter.consumed_date_from) : null);
        } else if (activeTab === "physical-activities") {
            setSelectedDate(filter.activity_date_from ? new Date(filter.activity_date_from) : null);
        }
    }, [filter, activeTab]);
    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2">

                <Button size={"sm"} onClick={() => handleDateOffset(-1)} className="bg-[#ffac33] hover:bg-[#f59f00] w-full sm:w-auto">
                    <CircleChevronRight Icon className="w-10 h-10 " />

                </Button>
                <DatePickerV2
                    value={selectedDate}
                    onChange={handleDateChange}
                    placeholderText="اختر التاريخ"
                    dateFormat="yyyy/MM/dd"
                // className="p-2 border border-gray-300 rounded"
                />
                <Button size={"sm"} onClick={() => handleDateOffset(1)} className="bg-[#ffac33] hover:bg-[#f59f00] w-full sm:w-auto">
                    <CircleChevronLeft />

                </Button>
                {/* أزرار للتنقل بين أيام متعددة */}
                {/* <button onClick={() => handleDateOffset(-7)} className="px-3 py-1 bg-blue-500 text-white rounded">
                    7 أيام سابقة
                </button>
                <button onClick={() => handleDateOffset(7)} className="px-3 py-1 bg-blue-500 text-white rounded">
                    7 أيام قادمة
                </button> */}
            </div>
            {/* اختيار التاريخ من الكالندر */}

        </div>
    );
}
