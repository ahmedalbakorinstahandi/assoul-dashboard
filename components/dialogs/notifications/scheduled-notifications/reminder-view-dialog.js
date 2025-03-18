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
import { CalendarIcon, ClockIcon, RepeatIcon, InfoIcon } from 'lucide-react'

export function ReminderViewDialog({ reminder, open, onOpenChange }) {
    if (!reminder) return null

    // تحويل نوع المنبه إلى نص عربي
    const getTypeText = (type) => {
        switch (type) {
            case 'yearly':
                return 'سنوي'
            case 'monthly':
                return 'شهري'
            case 'weekly':
                return 'أسبوعي'
            case 'daily':
                return 'يومي'
            default:
                return type
        }
    }

    // تحويل الشهر إلى اسم الشهر بالعربية
    const getMonthName = (month) => {
        if (!month) return ''
        return new Date(2023, month - 1, 1).toLocaleString('ar', { month: 'long' })
    }

    // تنسيق التاريخ بالعربية
    const formatDate = (dateString) => {
        if (!dateString) return ''
        return new Date(dateString).toLocaleString('ar', {
            year: 'numeric',
            month: 'long',
            timeZone: "UTC",
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-right">
                        {reminder.title}
                    </DialogTitle>
                    <DialogDescription className="text-right">
                        تفاصيل المنبه
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* حالة المنبه */}
                    <div className="flex justify-end">
                        <Badge variant={reminder.status === 'active' ? 'success' : 'destructive'}>
                            {reminder.status === 'active' ? 'نشط' : 'غير نشط'}
                        </Badge>
                    </div>

                    {/* محتوى المنبه */}
                    {reminder.content && (
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-right">المحتوى</h3>
                            <div className="bg-muted p-4 rounded-lg text-right">
                                {reminder.content}
                            </div>
                        </div>
                    )}

                    {/* معلومات التكرار */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-right">معلومات التكرار</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* نوع التكرار */}
                            <div className="bg-muted/50 p-3 rounded-lg flex items-center justify-between">
                                <div className="font-medium text-right">نوع التكرار</div>
                                <div className="flex items-center gap-2">
                                    <RepeatIcon className="h-4 w-4 text-muted-foreground" />
                                    <span>{getTypeText(reminder.type)}</span>
                                </div>
                            </div>

                            {/* الوقت */}
                            <div className="bg-muted/50 p-3 rounded-lg flex items-center justify-between">
                                <div className="font-medium text-right">الوقت</div>
                                <div className="flex items-center gap-2">
                                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                                    <span>{reminder.time ? new Date(reminder.time).toISOString().slice(11, 16) : ""}</span>
                                </div>
                            </div>

                            {/* الشهر (للتكرار الشهري والسنوي) */}
                            {(reminder.type === 'monthly' || reminder.type === 'yearly') && reminder.month && (
                                <div className="bg-muted/50 p-3 rounded-lg flex items-center justify-between">
                                    <div className="font-medium text-right">الشهر</div>
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                        <span>{getMonthName(reminder.month)}</span>
                                    </div>
                                </div>
                            )}

                            {/* الأسبوع (للتكرار الأسبوعي) */}
                            {reminder.type === 'weekly' && reminder.week && (
                                <div className="bg-muted/50 p-3 rounded-lg flex items-center justify-between">
                                    <div className="font-medium text-right">الأسبوع</div>
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                        <span>الأسبوع {reminder.week}</span>
                                    </div>
                                </div>
                            )}

                            {/* اليوم */}
                            {reminder.day && (
                                <div className="bg-muted/50 p-3 rounded-lg flex items-center justify-between">
                                    <div className="font-medium text-right">اليوم</div>
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                        <span>{reminder.day}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* معلومات إضافية */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-right">معلومات إضافية</h3>

                        <div className="grid grid-cols-1 gap-4">
                            {/* تاريخ الإنشاء */}
                            <div className="bg-muted/50 p-3 rounded-lg flex items-center justify-between">
                                <div className="font-medium text-right">تاريخ الإنشاء</div>
                                <div className="flex items-center gap-2">
                                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                    <span>{formatDate(reminder.created_at)}</span>
                                </div>
                            </div>

                            {/* تاريخ التحديث */}
                            <div className="bg-muted/50 p-3 rounded-lg flex items-center justify-between">
                                <div className="font-medium text-right">تاريخ التحديث</div>
                                <div className="flex items-center gap-2">
                                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                    <span>{formatDate(reminder.updated_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="sm:justify-start">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="w-full sm:w-auto"
                    >
                        إغلاق
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
