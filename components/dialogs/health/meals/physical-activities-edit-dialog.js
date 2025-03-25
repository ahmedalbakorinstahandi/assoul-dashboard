"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getData } from "@/lib/apiHelper"
import { typeMeals } from "@/data/data"

export function MealsDialog({ meal, open, onOpenChange, onSave }) {
  // Define initial state; if editing, load the meal data, else default values
  const initialForm = {
    patient_id: meal?.patient_id ? meal.patient_id.toString() : "",
    consumed_date: meal?.consumed_date || "",
    type: meal?.type || "",
    carbohydrates_calories: meal?.carbohydrates_calories || "",
    description: meal?.description || "",
    notes: meal?.notes || "",
  }

  const [form, setForm] = useState(initialForm)
  const [isLoading, setIsLoading] = useState(false)
  const [gamesIds, setGamesId] = useState([])

  // Update form state when meal prop changes (for editing existing meal)
  useEffect(() => {
    if (meal) {
      setForm({
        patient_id: meal.patient_id ? meal.patient_id.toString() : "",
        consumed_date: meal.consumed_date || "",
        type: meal.type || "",
        carbohydrates_calories: meal.carbohydrates_calories || "",
        description: meal.description || "",
        notes: meal.notes || "",
      })
    } else {
      setForm(initialForm)
    }
  }, [meal])

  // Fetch the list of children (patients)
  useEffect(() => {
    const fetchGamesId = async () => {
      try {
        const response = await getData("users/children")
        setGamesId(response.data)
      } catch (error) {
        console.error("Error fetching children:", error)
      }
    }
    fetchGamesId()
  }, [])

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    setIsLoading(true)
    onSave(form)
    onOpenChange(false)
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {meal ? "تعديل الوجبات" : "إضافة وجبات جديدة"}
          </DialogTitle>
          <DialogDescription>
            {meal
              ? "قم بتعديل بيانات الوجبة هنا."
              : "أدخل الوجبات الجديدة هنا. اضغط على حفظ عند الانتهاء."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Child Selection */}
          <div className="space-y-2">
            <Label htmlFor="patient_id">الطفل</Label>
            <Select
              name="patient_id"
              value={form.patient_id}
              onValueChange={(value) => handleChange("patient_id", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر الطفل" />
              </SelectTrigger>
              <SelectContent>
                {gamesIds.map((child, idx) => (
                  <SelectItem key={idx} value={child.id.toString()}>
                    {child.user.first_name + " " + child.user.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Consumed Date */}
          <div className="space-y-2">
            <Label htmlFor="consumed_date">تاريخ الاستهلاك</Label>
            <Input
              id="consumed_date"
              type="date"
              value={form.consumed_date}
              onChange={(e) => handleChange("consumed_date", e.target.value)}
            />
          </div>

          {/* Meal Type */}
          <div className="space-y-2">
            <Label htmlFor="type">نوع الوجبة</Label>
            <Select
              name="type"
              value={form.type}
              onValueChange={(value) => handleChange("type", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر نوع الوجبة" />
              </SelectTrigger>
              <SelectContent>
                {typeMeals.map((item, idx) => (
                  <SelectItem key={idx} value={item.name.toString()}>
                    {item.name_ar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Carbohydrates Calories */}
          <div className="space-y-2">
            <Label htmlFor="carbohydrates_calories">
              السعرات الحرارية الكربوهيدرات
            </Label>
            <Input
              id="carbohydrates_calories"
              placeholder="أدخل السعرات الحرارية الكربوهيدرات"
              value={form.carbohydrates_calories}
              onChange={(e) => handleChange("carbohydrates_calories", e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">الوصف</Label>
            <Textarea
              id="description"
              placeholder="أدخل الوصف"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea
              id="notes"
              placeholder="أدخل ملاحظات"
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>

          <Button
            style={{ marginInline: "1rem" }}

            variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button
            className="bg-[#ffac33] hover:bg-[#f59f00]"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "جاري الحفظ..." : "حفظ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
