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

interface ContentEditDialogProps {
  content: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (content: any) => void
}

export function ContentEditDialog({ content, open, onOpenChange, onSave }: ContentEditDialogProps) {
  const [editedContent, setEditedContent] = useState(content || {})
  const [isLoading, setIsLoading] = useState(false)

  if (!content) return null

  const isArticle = content.author !== undefined
  const isVideo = content.duration !== undefined
  const isImage = content.dimensions !== undefined

  const handleChange = (field: string, value: any) => {
    setEditedContent({ ...editedContent, [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // هنا يمكن إضافة طلب API لتحديث بيانات المحتوى
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSave(editedContent)
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating content:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>تعديل بيانات المحتوى</DialogTitle>
          <DialogDescription>قم بتعديل بيانات المحتوى {content.title}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">العنوان</Label>
              <Input
                id="title"
                value={editedContent.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="أدخل العنوان"
              />
            </div>

            {isArticle && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="content">المحتوى</Label>
                  <Textarea
                    id="content"
                    value={editedContent.content || ""}
                    onChange={(e) => handleChange("content", e.target.value)}
                    placeholder="أدخل المحتوى"
                    className="h-40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">الكاتب</Label>
                  <Select value={editedContent.author || ""} onValueChange={(value) => handleChange("author", value)}>
                    <SelectTrigger id="author">
                      <SelectValue placeholder="اختر الكاتب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="د. فاطمة أحمد">د. فاطمة أحمد</SelectItem>
                      <SelectItem value="د. خالد عبدالله">د. خالد عبدالله</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {isVideo && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="description">وصف الفيديو</Label>
                  <Textarea
                    id="description"
                    value={editedContent.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="أدخل وصف الفيديو"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">المدة</Label>
                  <Input
                    id="duration"
                    value={editedContent.duration || ""}
                    onChange={(e) => handleChange("duration", e.target.value)}
                    placeholder="أدخل مدة الفيديو"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="video">ملف الفيديو</Label>
                  <Input id="video" type="file" />
                </div>
              </>
            )}

            {isImage && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="description">وصف الصورة</Label>
                  <Textarea
                    id="description"
                    value={editedContent.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="أدخل وصف الصورة"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimensions">الأبعاد</Label>
                  <Input
                    id="dimensions"
                    value={editedContent.dimensions || ""}
                    onChange={(e) => handleChange("dimensions", e.target.value)}
                    placeholder="أدخل أبعاد الصورة"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">ملف الصورة</Label>
                  <Input id="image" type="file" />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="category">التصنيف</Label>
              <Select value={editedContent.category || ""} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {isArticle && (
                    <>
                      <SelectItem value="تعليمي">تعليمي</SelectItem>
                      <SelectItem value="تغذية">تغذية</SelectItem>
                      <SelectItem value="رياضة">رياضة</SelectItem>
                    </>
                  )}
                  {isVideo && (
                    <>
                      <SelectItem value="تعليمي">تعليمي</SelectItem>
                      <SelectItem value="ترفيهي">ترفيهي</SelectItem>
                    </>
                  )}
                  {isImage && (
                    <>
                      <SelectItem value="تغذية">تغذية</SelectItem>
                      <SelectItem value="شخصيات">شخصيات</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">الحالة</Label>
              <Select value={editedContent.status || "منشور"} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="منشور">منشور</SelectItem>
                  <SelectItem value="مسودة">مسودة</SelectItem>
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

