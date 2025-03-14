"use client"

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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle } from "lucide-react"

interface TaskCompletionDialogProps {
  task: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (task: any, notes: string) => void
}

export function TaskCompletionDialog({ task, open, onOpenChange, onConfirm }: TaskCompletionDialogProps) {
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!task) return null

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      // هنا يمكن إضافة طلب API لتأكيد إكمال المهمة
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onConfirm(task, notes)
      onOpenChange(false)
    } catch (error) {
      console.error("Error completing task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>تأكيد إكمال المهمة</DialogTitle>
          <DialogDescription>هل أنت متأكد من إكمال المهمة "{task?.title}"؟</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات (اختياري)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أدخل أي ملاحظات حول إكمال المهمة"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? (
              "جاري التأكيد..."
            ) : (
              <>
                <CheckCircle className="h-4 w-4 ml-2" />
                تأكيد الإكمال
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

