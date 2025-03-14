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
import { XCircle } from "lucide-react"

interface TaskRejectionDialogProps {
  task: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (task: any, reason: string) => void
}

export function TaskRejectionDialog({ task, open, onOpenChange, onConfirm }: TaskRejectionDialogProps) {
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!task) return null

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      // هنا يمكن إضافة طلب API لرفض المهمة
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onConfirm(task, reason)
      onOpenChange(false)
    } catch (error) {
      console.error("Error rejecting task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>رفض المهمة</DialogTitle>
          <DialogDescription>هل أنت متأكد من رفض المهمة "{task?.title}"؟</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">سبب الرفض</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="أدخل سبب رفض المهمة"
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={handleConfirm}
            disabled={isLoading || !reason.trim()}
          >
            {isLoading ? (
              "جاري التأكيد..."
            ) : (
              <>
                <XCircle className="h-4 w-4 ml-2" />
                تأكيد الرفض
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

