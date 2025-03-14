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

interface TaskEditDialogProps {
  task: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (task: any) => void
}

export function TaskEditDialog({ task, open, onOpenChange, onSave }: TaskEditDialogProps) {
  const [editedTask, setEditedTask] = useState(task || {})
  const [isLoading, setIsLoading] = useState(false)

  if (!task) return null

  const isChildTask = task.parent !== undefined

  const handleChange = (field: string, value: any) => {
    setEditedTask({ ...editedTask, [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // هنا يمكن إضافة طلب API لتحديث بيانات المهمة
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSave(editedTask)
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>تعديل المهمة</DialogTitle>
          <DialogDescription>قم بتعديل بيانات المهمة</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان المهمة</Label>
              <Input
                id="title"
                value={editedTask.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="أدخل عنوان المهمة"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">وصف المهمة</Label>
              <Textarea
                id="description"
                value={editedTask.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="أدخل وصف المهمة"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignedTo">معين إلى</Label>
                <Select
                  value={editedTask.assignedTo || ""}
                  onValueChange={(value) => handleChange("assignedTo", value)}
                >
                  <SelectTrigger id="assignedTo">
                    <SelectValue placeholder="اختر المستخدم" />
                  </SelectTrigger>
                  <SelectContent>
                    {isChildTask ? (
                      <>
                        <SelectItem value="ياسر أحمد">ياسر أحمد</SelectItem>
                        <SelectItem value="نورة أحمد">نورة أحمد</SelectItem>
                        <SelectItem value="عمر سارة">عمر سارة</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="أحمد محمد">أحمد محمد</SelectItem>
                        <SelectItem value="سارة علي">سارة علي</SelectItem>
                        <SelectItem value="محمد خالد">محمد خالد</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              {isChildTask && (
                <div className="space-y-2">
                  <Label htmlFor="parent">ولي الأمر</Label>
                  <Select value={editedTask.parent || ""} onValueChange={(value) => handleChange("parent", value)}>
                    <SelectTrigger id="parent">
                      <SelectValue placeholder="اختر ولي الأمر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="أحمد محمد">أحمد محمد</SelectItem>
                      <SelectItem value="سارة علي">سارة علي</SelectItem>
                      <SelectItem value="محمد خالد">محمد خالد</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="dueDate">تاريخ الاستحقاق</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={editedTask.dueDate || ""}
                  onChange={(e) => handleChange("dueDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">الحالة</Label>
                <Select
                  value={editedTask.status || "قيد التنفيذ"}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
                    <SelectItem value="مكتمل">مكتمل</SelectItem>
                    <SelectItem value="متأخر">متأخر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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

