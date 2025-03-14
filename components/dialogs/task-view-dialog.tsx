"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle } from "lucide-react"

interface TaskViewDialogProps {
  task: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (task: any) => void
  onReject: (task: any) => void
}

export function TaskViewDialog({ task, open, onOpenChange, onComplete, onReject }: TaskViewDialogProps) {
  if (!task) return null

  const getStatusBadge = (status) => {
    switch (status) {
      case "مكتمل":
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">{status}</span>
      case "قيد التنفيذ":
        return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">{status}</span>
      case "متأخر":
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">{status}</span>
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">{status}</span>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>تفاصيل المهمة</DialogTitle>
          <DialogDescription>عرض تفاصيل المهمة</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">{task.title}</h3>
            <div className="text-sm text-gray-500">{getStatusBadge(task.status)}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-sm text-gray-500">معين إلى</Label>
              <p className="font-medium">{task.assignedTo}</p>
            </div>
            {task.parent && (
              <div>
                <Label className="text-sm text-gray-500">ولي الأمر</Label>
                <p className="font-medium">{task.parent}</p>
              </div>
            )}
            <div>
              <Label className="text-sm text-gray-500">تاريخ الاستحقاق</Label>
              <p className="font-medium">{task.dueDate}</p>
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <Label className="text-sm text-gray-500 mb-2 block">وصف المهمة</Label>
            <p className="text-sm">{task.description || "لا يوجد وصف للمهمة."}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إغلاق
          </Button>
          {task.status !== "مكتمل" ? (
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => onComplete(task)}>
              <CheckCircle className="h-4 w-4 ml-2" />
              تأكيد الإكمال
            </Button>
          ) : (
            <Button
              variant="outline"
              className="text-red-500 border-red-500 hover:bg-red-50"
              onClick={() => onReject(task)}
            >
              <XCircle className="h-4 w-4 ml-2" />
              إلغاء الإكمال
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

