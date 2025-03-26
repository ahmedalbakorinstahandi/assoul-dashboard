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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { measurementTypes, units } from "@/data/data"
import { getData } from "@/lib/apiHelper"

export function BloodSugarReadingsEditDialog({ game, open, onOpenChange, onSave }) {
  if (!game) return null

  // Set up state for form values
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    patient_id: game.patient_id ? game.patient_id.toString() : "",
    measurement_type: game.measurement_type || "",
    value: game.value || "",
    unit: game.unit || "",
    measured_at: game.measured_at || "",
    notes: game.notes || "",
  })

  // Update form state whenever `game` prop changes.
  useEffect(() => {
    if (game) {
      setForm({
        patient_id: game.patient_id ? game.patient_id.toString() : "",
        measurement_type: game.measurement_type || "",
        value: game.value || "",
        unit: game.unit || "",
        measured_at: game.measured_at || "",
        notes: game.notes || "",
      })
    }
  }, [game])

  // State for the list of children (patients)
  const [gamesIds, setGamesId] = useState([])

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
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    setIsLoading(true)
    let formattedMeasuredAt
    // Format the datetime value (assuming form.measured_at is in "YYYY-MM-DDTHH:mm" format)
    if (form.measured_at != game.measured_at) {

      formattedMeasuredAt = form.measured_at.replace("T", " ") + ":00"
    } else {
      formattedMeasuredAt = form.measured_at.replace("T", " ")

    }

    const newGame = {
      ...form,
      measured_at: formattedMeasuredAt,
    }

    onSave(newGame)
    onOpenChange(false)
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>تعديل بيانات قراءات سكر الدم</DialogTitle>
          <DialogDescription>
            قم بتعديل بيانات قراءات سكر الدم {game.id}
          </DialogDescription>
        </DialogHeader>
        <form>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="patient_id">الطفل</Label>
              <Select
              disabled
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
            <div className="space-y-2">
              <Label htmlFor="measurement_type">نوع القياس</Label>
              <Select
                name="measurement_type"
                value={form.measurement_type}
                onValueChange={(value) => handleChange("measurement_type", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر نوع القياس" />
                </SelectTrigger>
                <SelectContent>
                  {measurementTypes.map((type, idx) => (
                    <SelectItem key={idx} value={type.name}>
                      {type.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">القيمة</Label>
              <Input
                id="value"
                type="number"
                value={form.value}
                placeholder="أدخل القيمة"
                onChange={(e) => handleChange("value", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">وحدة القياس</Label>
              <Select
                name="unit"
                value={form.unit}
                onValueChange={(value) => handleChange("unit", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر وحدة القياس" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit, idx) => (
                    <SelectItem key={idx} value={unit.name}>
                      {unit.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="measured_at">تقاس في</Label>
              <Input
                id="measured_at"
                type="datetime-local"
                value={form.measured_at}
                onChange={(e) => handleChange("measured_at", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Input
                id="notes"
                type="text"
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button style={{ marginInline: "1rem" }} variant="outline" type="button" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button
              className="bg-[#ffac33] hover:bg-[#f59f00]"
              disabled={isLoading}
              type="button"
              onClick={handleSubmit}
            >
              {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
