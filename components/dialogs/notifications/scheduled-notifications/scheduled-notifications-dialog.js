"use client"

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postData } from "@/lib/apiHelper";
import toast from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function ScheduledNotificationsDialog({ isOpen, onClose, onSave, initialData }) {
    // القيم المبدئية للنموذج
    const initialForm = {
        title: initialData?.title || "",
        content: initialData?.content || "",
        image: initialData?.image || "",
        type: initialData?.type || "",
        month: initialData?.month || "",
        week: initialData?.week || "",
        day: initialData?.day || "",
        time: initialData?.time || "",
        status: initialData?.status || "",
    };

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData?.title || "",
                content: initialData?.content || "",
                image: initialData?.image || "",
                type: initialData?.type || "",
                month: initialData?.month || "",
                week: initialData?.week || "",
                day: initialData?.day || "",
                time: initialData?.time || "",
                status: initialData?.status || "",
            });
        } else {
            setFormData(initialForm);
        }
    }, [initialData]);

    const [imagePreview, setImagePreview] = useState(initialData?.image || "");
    const [imageLink, setImageLink] = useState(initialData?.image || "");

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        console.log(formData);

    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const response = await postData("general/upload-image", { image: file, folder: "games" }, {});
            if (response.success) {
                setImageLink(response.data.image_name);
                setImagePreview(URL.createObjectURL(file));
            } else {
                toast.error("فشل رفع الصورة");
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            title: formData.title,
            content: formData.content,
            image: imageLink,
            type: formData.type,
            month: formData.month,
            week: formData.week,
            day: formData.day,
            time: formData.time,
            status: formData.status,
        };

        console.log("Submitting payload:", payload);
        onSave(payload);
        setIsLoading(false);
    };

    // دالة لحساب عدد الأيام في الشهر مع اعتبار السنة الكبيسة
    const getDaysInMonth = (month, year) => {
        month = parseInt(month);
        year = parseInt(year) || new Date().getFullYear();
        if (month === 2) {
            return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
        } else if ([4, 6, 9, 11].includes(month)) {
            return 30;
        }
        return 31;
    };

    // تحديد خيارات الأيام حسب نوع التكرار: في التكرار السنوي يتم تقييد الأيام بناءً على الشهر المختار
    let dayOptions = [];
    if (formData.type === "yearly" && formData.month) {
        const maxDay = getDaysInMonth(formData.month, new Date().getFullYear());
        dayOptions = Array.from({ length: maxDay }, (_, i) => i + 1);
    } else {
        dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "تحديث المستخدم" : "إضافة مستخدم جديد"}</DialogTitle>
                    <DialogDescription>
                        {initialData ? "قم بتحديث بيانات المستخدم هنا." : "أدخل بيانات المستخدم الجديد هنا."}
                    </DialogDescription>
                </DialogHeader>
                <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="title">عنوان المنبه</Label>
                        <Input
                            id="title"
                            required
                            value={formData.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            placeholder="أدخل عنوان المنبه"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">محتوى المنبه</Label>
                        <Textarea
                            required
                            id="content"
                            value={formData.content}
                            onChange={(e) => handleChange("content", e.target.value)}
                            placeholder="أدخل محتوى المنبه"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="type">نوع التكرار</Label>
                        <Select
                            value={formData.type.toString()}
                            onValueChange={(value) => handleChange("type", value)}
                        >
                            <SelectTrigger id="type">
                                <SelectValue placeholder="اختر نوع التكرار" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daily">يومي</SelectItem>
                                <SelectItem value="weekly">أسبوعي</SelectItem>
                                <SelectItem value="monthly">شهري</SelectItem>
                                <SelectItem value="yearly">سنوي</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* حقول إضافية حسب نوع التكرار */}
                    {formData.type === "weekly" && (
                        <div className="space-y-2">
                            <Label htmlFor="day">اليوم (للتكرار الأسبوعي)</Label>
                            <Select
                                value={formData.day.toString()}
                                onValueChange={(value) => handleChange("day", value)}
                            >
                                <SelectTrigger id="day">
                                    <SelectValue placeholder="اختر اليوم" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 7 }, (_, i) => (
                                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                                            اليوم {i + 1}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    {formData.type === "yearly" && (
                        <div className="space-y-2">
                            <Label htmlFor="month">الشهر (للتكرار السنوي)</Label>
                            <Select
                                value={formData.month.toString()}

                                onValueChange={(value) => handleChange("month", value)}
                            >
                                <SelectTrigger id="month">
                                    <SelectValue placeholder="اختر الشهر" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                                            {new Date(2023, i, 1).toLocaleString('ar-SA', { month: 'long' })}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {(formData.type === "monthly" || formData.type === "yearly") && (
                        <div className="space-y-2">
                            <Label htmlFor="day">اليوم</Label>
                            <Select
                                value={formData.day.toString()}
                                onValueChange={(value) => handleChange("day", value)}
                            >
                                <SelectTrigger id="day">
                                    <SelectValue placeholder="اختر اليوم" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dayOptions.map(day => (
                                        <SelectItem key={day} value={day.toString()}>
                                            {day}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}


                    <div className="space-y-2">
                        <Label htmlFor="time">الوقت</Label>
                        <Input
                            required
                            name="time"
                            id="time"
                            type="time"
                            value={formData.time || ""}
                            onChange={(e) => handleChange("time", e.target.value)}
                        />

                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">الحالة</Label>
                        <Select required value={formData.status.toString()} onValueChange={(value) => handleChange("status", value)}>
                            <SelectTrigger id="status">
                                <SelectValue placeholder="اختر الحالة" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">نشط</SelectItem>
                                <SelectItem value="inactive">غير نشط</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>الصورة</Label>
                        <Input required type="file" onChange={handleImageChange} />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="h-[100px] w-[100px] object-cover rounded border border-gray-300"
                            />
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" style={{ marginInline: "1rem" }} variant="outline" onClick={onClose}>
                            إلغاء
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-[#ffac33] hover:bg-[#f59f00]">
                            {initialData ? "تحديث" : "إضافة"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
