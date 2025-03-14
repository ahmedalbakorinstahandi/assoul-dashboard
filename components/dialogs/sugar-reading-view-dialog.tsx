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
import { FileText } from "lucide-react"

interface SugarReadingViewDialogProps {
  reading: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SugarReadingViewDialog({ reading, open, onOpenChange }: SugarReadingViewDialogProps) {
  if (!reading) return null

  const getStatusBadge = (status) => {
    switch (status) {
      case "طبيعي":
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">{status}</span>
      case "مرتفع":
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">{status}</span>
      case "منخفض":
        return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">{status}</span>
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">{status}</span>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>تفاصيل قراءة السكر</DialogTitle>
          <DialogDescription>عرض تفاصيل قراءة السكر للطفل {reading.childName}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center justify-center mb-6">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{reading.readingValue}</div>
              <div className="text-sm text-gray-500">mg/dL</div>
              <div className="mt-2">{getStatusBadge(reading.status)}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-sm text-gray-500">اسم الطفل</Label>
              <p className="font-medium">{reading.childName}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">ولي الأمر</Label>
              <p className="font-medium">{reading.parentName}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">وقت القراءة</Label>
              <p className="font-medium">{reading.readingTime}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">الحالة</Label>
              <p>{getStatusBadge(reading.status)}</p>
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <Label className="text-sm text-gray-500 mb-2 block">ملاحظات</Label>
            <p className="text-sm">
              {reading.status === "طبيعي"
                ? "مستوى السكر ضمن المعدل الطبيعي."
                : reading.status === "مرتفع"
                  ? "مستوى السكر مرتفع. يرجى مراجعة الطبيب إذا استمر الارتفاع."
                  : "مستوى السكر منخفض. يرجى تناول وجبة خفيفة وإعادة القياس بعد 15 دقيقة."}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إغلاق
          </Button>
          <Button className="bg-[#ffac33] hover:bg-[#f59f00]">
            <FileText className="h-4 w-4 ml-2" />
            تصدير التقرير
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

