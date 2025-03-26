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
import { activityTime, intensity } from "@/data/data"

export function PhysicalActivitiesDialog({ activity, open, onOpenChange, onSave }) {
  // initial form state - if editing an existing activity, load its values, otherwise use defaults
  const initialForm = {
    patient_id: activity?.patient_id ? activity.patient_id.toString() : "",
    activity_date: activity?.activity_date || "",
    activity_time: activity?.activity_time || "",
    description: activity?.description || "",
    intensity: activity?.intensity || "",
    duration: activity?.duration || "",
    notes: activity?.notes || "",
  }
  const [form, setForm] = useState(initialForm)
  const [isLoading, setIsLoading] = useState(false)
  const [gamesIds, setGamesId] = useState([])

  // Update form state when "activity" prop changes (if editing an existing record)
  useEffect(() => {
    if (activity) {
      setForm({
        patient_id: activity.patient_id ? activity.patient_id.toString() : "",
        activity_date: activity.activity_date || "",
        activity_time: activity.activity_time || "",
        description: activity.description || "",
        intensity: activity.intensity || "",
        duration: activity.duration || "",
        notes: activity.notes || "",
      })
    } else {
      setForm(initialForm)
    }
  }, [activity])

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
    setForm((prev) => ({ ...prev, [field]: value }))
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
            {activity ? "تعديل الأنشطة البدنية" : "إضافة أنشطة بدنية جديدة"}
          </DialogTitle>
          <DialogDescription>
            {activity
              ? "قم بتعديل بيانات الأنشطة البدنية هنا."
              : "أدخل الأنشطة البدنية الجديدة هنا. اضغط على حفظ عند الانتهاء."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="patient_id">الطفل</Label>
            <Select
              name="patient_id"
              disabled

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
            <Label htmlFor="activity_date">تاريخ النشاط</Label>
            <Input
              id="activity_date"
              type="date"
              value={form.activity_date}
              onChange={(e) => handleChange("activity_date", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity_time">وقت النشاط</Label>
            <Select
              name="activity_time"
              value={form.activity_time}
              onValueChange={(value) => handleChange("activity_time", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر وقت النشاط" />
              </SelectTrigger>
              <SelectContent>
                {activityTime.map((timeOption, idx) => (
                  <SelectItem key={idx} value={timeOption.name.toString()}>
                    {timeOption.name_ar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">وصف</Label>
            <Input
              id="description"
              placeholder="أدخل وصف"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="intensity">الشدة</Label>
            <Select
              name="intensity"
              value={form.intensity}
              onValueChange={(value) => handleChange("intensity", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر الشدة" />
              </SelectTrigger>
              <SelectContent>
                {intensity.map((item, idx) => (
                  <SelectItem key={idx} value={item.name.toString()}>
                    {item.name_ar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">مدة</Label>
            <Input
              id="duration"
              type="number"
              placeholder="أدخل مدة"
              value={form.duration}
              onChange={(e) => handleChange("duration", e.target.value)}
            />
          </div>

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
