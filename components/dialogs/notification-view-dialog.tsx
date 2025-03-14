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

interface NotificationViewDialogProps {
  notification: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotificationViewDialog({ notification, open, onOpenChange }: NotificationViewDialogProps) {
  if (!notification) return null

  const isNotification = notification.content !== undefined
  const isReminder = notification.frequency !== undefined

  const getStatusBadge = (status) => {
    switch (status) {
      case "مرسل":
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">{status}</span>
      case "مجدول":
        return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">{status}</span>
      case "نشط":
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">{status}</span>
      case "غير نشط":
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">{status}</span>
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">{status}</span>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>عرض بيانات {isNotification ? "الإشعار" : "المنبه"}</DialogTitle>
          <DialogDescription>
            عرض تفاصيل بيانات {isNotification ? "الإشعار" : "المنبه"} {notification.title}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">{notification.title}</h3>
            <div className="text-sm text-gray-500">{getStatusBadge(notification.status)}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-sm text-gray-500">العنوان</Label>
              <p className="font-medium">{notification.title}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">الفئة المستهدفة</Label>
              <p className="font-medium">{notification.target}</p>
            </div>

            {isNotification && (
              <>
                <div>
                  <Label className="text-sm text-gray-500">تاريخ الإرسال</Label>
                  <p className="font-medium">{notification.sentDate}</p>
                </div>
              </>
            )}

            {isReminder && (
              <>
                <div>
                  <Label className="text-sm text-gray-500">التكرار</Label>
                  <p className="font-medium">{notification.frequency}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">الوقت</Label>
                  <p className="font-medium">{notification.time}</p>
                </div>
              </>
            )}

            <div>
              <Label className="text-sm text-gray-500">الحالة</Label>
              <p>{getStatusBadge(notification.status)}</p>
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <Label className="text-sm text-gray-500 mb-2 block">
              {isNotification ? "محتوى الإشعار" : "وصف المنبه"}
            </Label>
            <p className="text-sm">{isNotification ? notification.content : notification.description}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

