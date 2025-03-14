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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserEditDialogProps {
  user: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (user: any) => void
}

export function UserEditDialog({ user, open, onOpenChange, onSave }: UserEditDialogProps) {
  const [editedUser, setEditedUser] = useState(user || {})
  const [isLoading, setIsLoading] = useState(false)

  if (!user) return null

  const isParent = user.childrenCount !== undefined
  const isDoctor = user.specialty !== undefined
  const isChild = user.age !== undefined

  const handleChange = (field: string, value: any) => {
    setEditedUser({ ...editedUser, [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // هنا يمكن إضافة طلب API لتحديث بيانات المستخدم
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSave(editedUser)
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>تعديل بيانات المستخدم</DialogTitle>
          <DialogDescription>قم بتعديل بيانات المستخدم {user.name}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input
                  id="name"
                  value={editedUser.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="أدخل الاسم الكامل"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedUser.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="أدخل البريد الإلكتروني"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  value={editedUser.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="أدخل رقم الهاتف"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">الحالة</Label>
                <Select value={editedUser.status || "نشط"} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="نشط">نشط</SelectItem>
                    <SelectItem value="غير نشط">غير نشط</SelectItem>
                    <SelectItem value="معلق">معلق</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isDoctor && (
                <div className="space-y-2">
                  <Label htmlFor="specialty">التخصص</Label>
                  <Input
                    id="specialty"
                    value={editedUser.specialty || ""}
                    onChange={(e) => handleChange("specialty", e.target.value)}
                    placeholder="أدخل التخصص"
                  />
                </div>
              )}

              {isChild && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="age">العمر</Label>
                    <Input
                      id="age"
                      type="number"
                      value={editedUser.age || ""}
                      onChange={(e) => handleChange("age", Number.parseInt(e.target.value))}
                      placeholder="أدخل العمر"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent">ولي الأمر</Label>
                    <Select value={editedUser.parent || ""} onValueChange={(value) => handleChange("parent", value)}>
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
                  <div className="space-y-2">
                    <Label htmlFor="diabetesType">نوع السكري</Label>
                    <Select
                      value={editedUser.diabetesType || ""}
                      onValueChange={(value) => handleChange("diabetesType", value)}
                    >
                      <SelectTrigger id="diabetesType">
                        <SelectValue placeholder="اختر نوع السكري" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="النوع 1">النوع 1</SelectItem>
                        <SelectItem value="النوع 2">النوع 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
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

