"use client"

import type React from "react"

import { useState } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"

interface NotificationEditDialogProps {
  notification: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (notification: any) => void
}

export function NotificationEditDialog({ notification, open, onOpenChange, onSave }: NotificationEditDialogProps) {
  const [editedNotification, setEditedNotification] = useState(notification || {})
  const [isLoading, setIsLoading] = useState(false)
  const [isScheduled, setIsScheduled] = useState(notification?.status === "مجدول" || false)

  if (!notification) return null

  const isNotification = notification.content !== undefined
  const isReminder = notification.frequency !== undefined

  const handleChange = (field: string, value: any) => {
    setEditedNotification({ ...editedNotification, [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // هنا يمكن إضافة طلب API لتحديث بيانات الإشعار
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSave(editedNotification)
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating notification:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>تعديل بيانات {isNotification ? "الإشعار" : "المنبه"}</DialogTitle>
          <DialogDescription>
            قم بتعديل بيانات {isNotification ? "الإشعار" : "المنبه"} {notification.title}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">العنوان</Label>
              <Input
                id="title"
                value={editedNotification.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder={`أدخل عنوان ${isNotification ? "الإشعار" : "المنبه"}`}
              />
            </div>

            {isNotification && (
              <div className="space-y-2">
                <Label htmlFor="content">محتوى الإشعار</Label>
                <Textarea
                  id="content"
                  value={editedNotification.content || ""}
                  onChange={(e) => handleChange("content", e.target.value)}
                  placeholder="أدخل محتوى الإشعار"
                />
              </div>
            )}

            {isReminder && (
              <div className="space-y-2">
                <Label htmlFor="description">وصف المنبه</Label>
                <Textarea
                  id="description"
                  value={editedNotification.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="أدخل وصف المنبه"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="target">الفئة المستهدفة</Label>
              <Select value={editedNotification.target || ""} onValueChange={(value) => handleChange("target", value)}>
                <SelectTrigger id="target">
                  <SelectValue placeholder="اختر الفئة المستهدفة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="الجميع">الجميع</SelectItem>
                  <SelectItem value="الأهل">الأهل</SelectItem>
                  <SelectItem value="الأطفال">الأطفال</SelectItem>
                  <SelectItem value="الأطباء">الأطباء</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isNotification && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="scheduleCheck">جدولة الإشعار</Label>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id="scheduleCheck" checked={isScheduled} onCheckedChange={setIsScheduled} />
                    <Label htmlFor="scheduleCheck" className="text-sm font-normal">
                      إرسال الإشعار لاحقاً
                    </Label>
                  </div>
                </div>

                {isScheduled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="scheduleDate">تاريخ الإرسال</Label>
                      <Input
                        id="scheduleDate"
                        type="date"
                        value={editedNotification.scheduleDate || ""}
                        onChange={(e) => handleChange("scheduleDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scheduleTime">وقت الإرسال</Label>
                      <Input
                        id="scheduleTime"
                        type="time"
                        value={editedNotification.scheduleTime || ""}
                        onChange={(e) => handleChange("scheduleTime", e.target.value)}
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {isReminder && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="frequency">تكرار المنبه</Label>
                  <Select
                    value={editedNotification.frequency || ""}
                    onValueChange={(value) => handleChange("frequency", value)}
                  >
                    <SelectTrigger id="frequency">
                      <SelectValue placeholder="اختر تكرار المنبه" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="يومي">يومي</SelectItem>
                      <SelectItem value="أسبوعي">أسبوعي</SelectItem>
                      <SelectItem value="شهري">شهري</SelectItem>
                      <SelectItem value="مرة واحدة">مرة واحدة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">وقت المنبه</Label>
                  <Input
                    id="time"
                    type="time"
                    value={editedNotification.time || ""}
                    onChange={(e) => handleChange("time", e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="status">الحالة</Label>
              <Select value={editedNotification.status || ""} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  {isNotification ? (
                    <>
                      <SelectItem value="مرسل">مرسل</SelectItem>
                      <SelectItem value="مجدول">مجدول</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="نشط">نشط</SelectItem>
                      <SelectItem value="غير نشط">غير نشط</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" className="bg-[#ffac33] hover:bg-[#f59f00]" disabled={isLoading}>
              {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

