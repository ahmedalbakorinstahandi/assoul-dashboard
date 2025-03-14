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

interface GameEditDialogProps {
  game: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (game: any) => void
}

export function GameEditDialog({ game, open, onOpenChange, onSave }: GameEditDialogProps) {
  const [editedGame, setEditedGame] = useState(game || {})
  const [isLoading, setIsLoading] = useState(false)

  if (!game) return null

  const handleChange = (field: string, value: any) => {
    setEditedGame({ ...editedGame, [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // هنا يمكن إضافة طلب API لتحديث بيانات اللعبة
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSave(editedGame)
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating game:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>تعديل بيانات اللعبة</DialogTitle>
          <DialogDescription>قم بتعديل بيانات اللعبة {game.name}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم اللعبة</Label>
              <Input
                id="name"
                value={editedGame.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="أدخل اسم اللعبة"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">وصف اللعبة</Label>
              <Textarea
                id="description"
                value={editedGame.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="أدخل وصف اللعبة"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="levels">عدد المستويات</Label>
                <Input
                  id="levels"
                  type="number"
                  value={editedGame.levels || ""}
                  onChange={(e) => handleChange("levels", Number.parseInt(e.target.value))}
                  placeholder="أدخل عدد المستويات"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">الحالة</Label>
                <Select value={editedGame.status || "نشط"} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="نشط">نشط</SelectItem>
                    <SelectItem value="غير نشط">غير نشط</SelectItem>
                    <SelectItem value="قيد التطوير">قيد التطوير</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">صورة اللعبة</Label>
              <Input id="image" type="file" />
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

