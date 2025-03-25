"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User, Phone, Mail, Shield } from "lucide-react"

export function GuardianDetailsDialog({ isOpen, onClose, userData }) {
    const [imageError, setImageError] = useState(false)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow22-hidden" dir="rtl">
                {/* Header with avatar */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 flex flex-col items-center sm:flex-row sm:items-start gap-4">
                    <div className="relative">
                        {!imageError && userData?.user?.avatar ? (
                            <img
                                src={userData.user.avatar || "/placeholder.svg"}
                                alt={`${userData?.user?.first_name || ""} ${userData?.user?.last_name || ""}`}
                                className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center border-4 border-white shadow-md">
                                <User className="h-12 w-12 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                    <div className="text-center sm:text-right flex-1">
                        <DialogHeader className="mb-2 space-y-1">
                            <DialogTitle className="text-2xl font-bold">
                                {userData?.user?.first_name || ""} {userData?.user?.last_name || ""}
                            </DialogTitle>
                            <DialogDescription className="text-base">هنا يمكنك عرض تفاصيل المستخدم بدون تعديل</DialogDescription>
                        </DialogHeader>
                        <Badge variant="secondary" className="text-sm font-medium">
                            <Shield className="h-3 w-3 ml-1" /> ولي أمر
                        </Badge>
                    </div>
                </div>

                <div className="p-6  overflow-y-auto">
                    <Card className="p-4 shadow-sm">
                        <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>معلومات الاتصال</span>
                        </h3>
                        <div className="grid gap-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-sm flex items-center gap-1">
                                        <User className="h-3.5 w-3.5" />
                                        <span>الاسم الأول</span>
                                    </p>
                                    <p className="font-medium">{userData?.user?.first_name || "غير متوفر"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-sm flex items-center gap-1">
                                        <User className="h-3.5 w-3.5" />
                                        <span>اسم العائلة</span>
                                    </p>
                                    <p className="font-medium">{userData?.user?.last_name || "غير متوفر"}</p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-muted-foreground text-sm flex items-center gap-1">
                                    <Mail className="h-3.5 w-3.5" />
                                    <span>البريد الإلكتروني</span>
                                </p>
                                <p className="font-medium">{userData?.user?.email || "غير متوفر"}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-muted-foreground text-sm flex items-center gap-1">
                                    <Phone className="h-3.5 w-3.5" />
                                    <span>رقم الهاتف</span>
                                </p>
                                <p className="font-medium">{userData?.user?.phone || "غير متوفر"}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-muted-foreground text-sm">الحالة</p>
                                <div>
                                    {userData?.user?.status ? (
                                        <Badge
                                            variant={userData.user.status === "active" ? "success" : "secondary"}
                                            className="rounded-full px-3"
                                        >
                                            {userData.user.status === "active" ? "نشط" : userData.user.status}
                                        </Badge>
                                    ) : (
                                        <p>غير متوفر</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <Separator />

                <DialogFooter className="p-4 flex-row-reverse sm:flex-row justify-between">
                    <Button type="button" onClick={onClose} className="w-full sm:w-auto">
                        إغلاق
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

