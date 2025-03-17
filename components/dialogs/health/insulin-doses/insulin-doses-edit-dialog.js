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
import { getData } from "@/lib/apiHelper"
import { injectionSites, takenTime } from "@/data/data"

export function InsulinDosesDialog({ insulinDose, open, onOpenChange, onSave }) {
  // Initialize form state; if editing, load the existing dose data, otherwise use defaults.
  const initialForm = {
    patient_id: insulinDose?.patient_id ? insulinDose.patient_id.toString() : "",
    taken_date: insulinDose?.taken_date || "",
    taken_time: insulinDose?.taken_time || "",
    insulin_type: insulinDose?.insulin_type || "",
    dose_units: insulinDose?.dose_units || "",
    injection_site: insulinDose?.injection_site || "",
  }
  const [form, setForm] = useState(initialForm)
  const [isLoading, setIsLoading] = useState(false)
  const [gamesIds, setGamesId] = useState([])

  // Update form state when insulinDose prop changes (for example when selecting a different record)
  useEffect(() => {
    if (insulinDose) {
      setForm({
        patient_id: insulinDose.patient_id ? insulinDose.patient_id.toString() : "",
        taken_date: insulinDose.taken_date || "",
        taken_time: insulinDose.taken_time || "",
        insulin_type: insulinDose.insulin_type || "",
        dose_units: insulinDose.dose_units || "",
        injection_site: insulinDose.injection_site || "",
      })
    } else {
      setForm(initialForm)
    }
  }, [insulinDose])

  // Fetch the list of children (patients) for the select input.
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
    // Directly pass the form data to the onSave callback.
    onSave(form)
    onOpenChange(false)
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {insulinDose ? "تعديل جرعات الأنسولين" : "إضافة جرعات الأنسولين جديدة"}
          </DialogTitle>
          <DialogDescription>
            {insulinDose
              ? "قم بتعديل بيانات جرعات الأنسولين هنا."
              : "أدخل جرعات الأنسولين الجديدة هنا. اضغط على حفظ عند الانتهاء."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
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
          <div className="space-y-2">
            <Label htmlFor="taken_date">تاريخ الاخذ</Label>
            <Input
              id="taken_date"
              type="date"
              value={form.taken_date}
              onChange={(e) => handleChange("taken_date", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taken_time">وقت الأخذ</Label>
            <Select
              name="taken_time"
              value={form.taken_time}
              onValueChange={(value) => handleChange("taken_time", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر وقت الأخذ" />
              </SelectTrigger>
              <SelectContent>
                {takenTime.map((timeOption, idx) => (
                  <SelectItem key={idx} value={timeOption.name.toString()}>
                    {timeOption.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="insulin_type">نوع الأنسولين</Label>
            <Input
              id="insulin_type"
              type="text"
              placeholder="أدخل نوع الأنسولين"
              value={form.insulin_type}
              onChange={(e) => handleChange("insulin_type", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dose_units">وحدات الجرعة</Label>
            <Input
              id="dose_units"
              type="number"
              placeholder="أدخل وحدات الجرعة"
              value={form.dose_units}
              onChange={(e) => handleChange("dose_units", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="injection_site">موقع الحقن</Label>
            <Select
              name="injection_site"
              value={form.injection_site}
              onValueChange={(value) => handleChange("injection_site", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر موقع الحقن" />
              </SelectTrigger>
              <SelectContent>
                {injectionSites.map((site, idx) => (
                  <SelectItem key={idx} value={site.name.toString()}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            style={{
              marginInline: "1rem"
            }}
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
