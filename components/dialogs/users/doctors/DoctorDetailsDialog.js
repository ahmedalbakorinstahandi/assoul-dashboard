"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User, Phone, Mail, MapPin, Award, Briefcase, Calendar } from 'lucide-react'

export function DoctorDetailsDialog({ isOpen, onClose, details }) {
    const [imageError, setImageError] = useState(false)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hid22den" dir="rtl">
                {/* Header with avatar */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 flex flex-col items-center sm:flex-row sm:items-start gap-4">
                    <div className="relative">
                        {!imageError && details?.user?.avatar ? (
                            <img
                                src={details.user.avatar || "/placeholder.svg"}
                                alt={`${details?.user?.first_name || ''} ${details?.user?.last_name || ''}`}
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
                                {details?.user?.first_name || ''} {details?.user?.last_name || ''}
                            </DialogTitle>
                            <DialogDescription className="text-base">
                                عرض بيانات الطبيب
                            </DialogDescription>
                        </DialogHeader>
                        {details?.specialization && (
                            <Badge variant="secondary" className="text-sm font-medium">
                                {details.specialization}
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="p-6  overflow-y-auto">
                    <div className="grid gap-6">
                        <Card className="p-4 shadow-sm">
                            <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                                <Award className="h-4 w-4" />
                                <span>المعلومات المهنية</span>
                            </h3>
                            <div className="grid gap-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground text-sm">التخصص</Label>
                                        <p className="font-medium">{details?.specialization || "غير متوفر"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground text-sm">رقم التصنيف</Label>
                                        <p className="font-medium">{details?.classification_number || "غير متوفر"}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground text-sm flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        <span>موقع العيادة</span>
                                    </Label>
                                    <p className="font-medium">{details?.workplace_clinic_location || "غير متوفر"}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 shadow-sm">
                            <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>معلومات الاتصال</span>
                            </h3>
                            <div className="grid gap-4">
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground text-sm flex items-center gap-1">
                                        <Mail className="h-3.5 w-3.5" />
                                        <span>البريد الإلكتروني</span>
                                    </Label>
                                    <p className="font-medium">{details?.user?.email || "غير متوفر"}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground text-sm flex items-center gap-1">
                                        <Phone className="h-3.5 w-3.5" />
                                        <span>رقم الهاتف</span>
                                    </Label>
                                    <p className="font-medium">{details?.user?.phone || "غير متوفر"}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground text-sm">الحالة</Label>
                                    <div>
                                        {details?.user?.status ? (
                                            <Badge
                                                variant={details.user.status === "active" ? "success" : "secondary"}
                                                className="rounded-full px-3"
                                            >
                                                {details.user.status === "active" ? "نشط" : details.user.status}
                                            </Badge>
                                        ) : (
                                            <p>غير متوفر</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
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
