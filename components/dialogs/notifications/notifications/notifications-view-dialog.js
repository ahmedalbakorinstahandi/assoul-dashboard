"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Calendar, Clock, Info, User, Tag, CheckCircle, AlertCircle, MessageSquare } from "lucide-react"

export function NotificationViewDialog({ notification, open, onOpenChange }) {
    if (!notification) return null

    // تحديد نوع الإشعار وتنسيقه
    const getNotificationType = (type) => {
        switch (type) {
            case "info":
                return { label: "معلومات", variant: "default", icon: <Info className="h-4 w-4 ml-1" /> }
            case "success":
                return { label: "نجاح", variant: "success", icon: <CheckCircle className="h-4 w-4 ml-1" /> }
            case "warning":
                return { label: "تحذير", variant: "warning", icon: <AlertCircle className="h-4 w-4 ml-1" /> }
            case "error":
                return { label: "خطأ", variant: "destructive", icon: <AlertCircle className="h-4 w-4 ml-1" /> }
            case "alert":
                return { label: "انذار", variant: "destructive", icon: <Info className="h-4 w-4 ml-1" /> }
            default:
                return { label: type, variant: "default", icon: <Info className="h-4 w-4 ml-1" /> }
        }
    }

    const notificationType = getNotificationType(notification.type)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">عرض الإشعار</DialogTitle>
                    <DialogDescription>تفاصيل الإشعار المرسل للمستخدم</DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="space-y-6">
                        {/* عنوان الإشعار */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2 flex items-center">
                                <Bell className="h-5 w-5 ml-2 text-[#ffac33]" />
                                {notification.title}
                            </h3>
                            <div className="flex items-center mt-1">
                                <Badge variant={notificationType.variant} className="flex items-center">
                                    {notificationType.icon}
                                    {notificationType.label}
                                </Badge>
                            </div>
                        </div>

                        {/* محتوى الإشعار */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium flex items-center">
                                <MessageSquare className="h-4 w-4 ml-1 text-gray-500" />
                                محتوى الإشعار
                            </h4>
                            <ScrollArea className="h-[100px] w-full rounded-md border p-4">
                                <p className="text-sm text-gray-700 dark:text-gray-300">{notification.message}</p>
                            </ScrollArea>
                        </div>

                        {/* معلومات إضافية */}
                        <div className="space-y-3 text-sm">
                            <h4 className="font-medium">معلومات إضافية</h4>

                            {/* المستخدم المستهدف */}
                            {notification.notifiable && (
                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                    <User className="h-4 w-4 ml-2" />
                                    <span className="font-medium ml-1">المستخدم المستهدف:</span>
                                    <span>
                                        {notification.notifiable.type.split("\\").pop()} (ID: {notification.notifiable.id})
                                    </span>
                                </div>
                            )}

                            {/* البيانات الوصفية */}
                            {/* {notification.metadata && (
                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                    <Tag className="h-4 w-4 ml-2" />
                                    <span className="font-medium ml-1">البيانات الوصفية:</span>
                                    <span>{JSON.stringify(notification.metadata)}</span>
                                </div>
                            )} */}

                            {/* تاريخ القراءة */}
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <CheckCircle className="h-4 w-4 ml-2" />
                                <span className="font-medium ml-1">حالة القراءة:</span>
                                <span>
                                    {notification.read_at
                                        ? `تمت القراءة في ${new Date(notification.read_at).toLocaleString("EN-ca")}`
                                        : "لم تتم القراءة بعد"}
                                </span>
                            </div>

                            {/* تاريخ الإنشاء */}
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <Calendar className="h-4 w-4 ml-2" />
                                <span className="font-medium ml-1">تاريخ الإنشاء:</span>
                                <span>{new Date(notification.created_at).toLocaleString("EN-ca")}</span>
                            </div>

                            {/* تاريخ التحديث */}
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <Clock className="h-4 w-4 ml-2" />
                                <span className="font-medium ml-1">تاريخ التحديث:</span>
                                <span>{new Date(notification.updated_at).toLocaleString("EN-ca")}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>إغلاق</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

