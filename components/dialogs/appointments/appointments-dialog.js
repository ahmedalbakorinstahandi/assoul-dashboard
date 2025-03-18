"use client"

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { statusUser } from "@/data/data"
import { Eye, EyeOff } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { patientStatus, statusAppointment } from "@/data/data"
import { formatDateTime } from "@/lib/utils"
export function AppointmentDialog({ isOpen, onClose, onSave, children, doctors, guardian, initialData }) {
    // Initialize form data state using a similar pattern to the InsulinDosesDialog
    const initialForm = {
        patient_id: initialData?.patient_id || "",
        guardian_id: initialData?.guardian_id || "",
        doctor_id: initialData?.doctor_id || "",
        title: initialData?.title || "",
        appointment_date: initialData?.appointment_date || "",
        patient_status: initialData?.patient_status || "",
        notes: initialData?.notes || "",
        patient_status: initialData?.patient_status || "",
        status: initialData?.status || "",



    };
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        if (initialData) {
            console.log(initialData);

            setFormData({
                patient_id: initialData?.patient_id || "",
                guardian_id: initialData?.guardian_id || "",
                doctor_id: initialData?.doctor_id || "",
                title: initialData?.title || "",
                appointment_date: initialData?.appointment_date || "",
                patient_status: initialData?.patient_status || "",
                notes: initialData?.notes || "",
                patient_status: initialData?.patient_status || "",
                status: initialData?.status || "",

            });
            console.log("formData", formData);

        } else {
            setFormData(initialForm);
        }
    }, [initialData]);


    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }


    const handleSubmit = (e) => {
        setIsLoading(true)

        e.preventDefault();

        // Basic validation
        // if (!formData.first_name) return toast.error("الاسم الأول مطلوب");
        // if (!formData.last_name) return toast.error("اسم العائلة مطلوب");
        // if (!formData.email.includes("@")) return toast.error("البريد الإلكتروني غير صالح");
        // if (!formData.phone) return toast.error("رقم الهاتف مطلوب");
        // if (!initialData && formData.password.length < 6) return toast.error("يجب أن تكون كلمة المرور 6 أحرف على الأقل");
        // if (formData.password !== formData.password_confirmation) return toast.error("كلمات المرور غير متطابقة");

        // Build payload with keys as user[first_name], etc.
        const payload = {
            patient_id: formData?.patient_id || "",
            guardian_id: formData?.guardian_id || "",
            doctor_id: formData?.doctor_id || "",
            title: formData?.title || "",
            appointment_date: formData?.appointment_date || "",
            patient_status: formData?.patient_status || "",
            notes: formData?.notes || "",
            patient_status: formData?.patient_status || "",
            status: formData?.status || "",


        };

        console.log("Submitting payload:", payload);
        onSave(payload);
        // onClose();
        setIsLoading(false)

    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "تحديث المستخدم" : "إضافة مستخدم جديد"}</DialogTitle>
                    <DialogDescription>
                        {initialData ? "قم بتحديث بيانات المستخدم هنا." : "أدخل بيانات المستخدم الجديد هنا."}
                    </DialogDescription>
                </DialogHeader>
                <form className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="patient_id">الطفل</Label>
                        <Select
                            name="patient_id"
                            value={formData.patient_id.toString()}
                            onValueChange={(value) => handleChange("patient_id", value)}
                        // onValueChange={(e) => handleChange(e)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="اختر الطفل " />
                            </SelectTrigger>
                            <SelectContent>
                                {children.map((item, idx) => (
                                    <SelectItem key={idx} value={item.id.toString()}>
                                        {item.user.first_name + " " + item.user.last_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="guardian_id">ولي الامر</Label>
                        <Select
                            name="guardian_id"
                            value={formData.guardian_id.toString()}
                            onValueChange={(value) => handleChange("guardian_id", value)}
                        // onValueChange={(e) => handleChange(e)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="اختر ولي الامر " />
                            </SelectTrigger>
                            <SelectContent>
                                {guardian.map((item, idx) => (
                                    <SelectItem key={idx} value={item.id.toString()}>
                                        {item.user.first_name + " " + item.user.last_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="doctor_id">الطبيب</Label>
                        <Select
                            name="doctor_id"
                            value={formData.doctor_id.toString()}
                            onValueChange={(value) => handleChange("doctor_id", value)}
                        // onValueChange={(e) => handleChange(e)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="اختر  الطبيب " />
                            </SelectTrigger>
                            <SelectContent>
                                {doctors.map((item, idx) => (
                                    <SelectItem key={idx} value={item.id.toString()}>
                                        {item.user.first_name + " " + item.user.last_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>العنوان</Label>
                        <Input name="title" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label> الوصف</Label>
                        <Textarea name="notes" value={formData.notes} onChange={(e) => handleChange("notes", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label> تاريخ ووقت الزيارة</Label>
                        <Input type="datetime-local" name="appointment_date" value={formatDateTime(formData.appointment_date)} onChange={(e) => handleChange("appointment_date", e.target.value)} />
                    </div>

                    {!initialData ? <>

                        <div className="space-y-2">
                            <Label htmlFor="patient_status"> حالة المريض</Label>
                            <Select
                                name="patient_status"
                                value={formData.status}
                                onValueChange={(value) => handleChange("patient_status", value)}
                            // onValueChange={(e) => handleChange(e)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="اختر حالة المريض " />
                                </SelectTrigger>
                                <SelectContent>
                                    {patientStatus.map((item, idx) => (
                                        <SelectItem key={idx} value={item.name.toString()}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </> : <>

                        <div className="space-y-2">
                            <Label htmlFor="status">الحالة</Label>
                            <Select
                                name="status"
                                value={formData.status}
                                onValueChange={(value) => handleChange("status", value)}
                            // onValueChange={(e) => handleChange(e)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="اختر الحالة " />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusAppointment.map((item, idx) => (
                                        <SelectItem key={idx} value={item.name.toString()}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                    </>}

                    <DialogFooter>
                        <Button type="button" style={{ marginInline: "1rem" }} variant="outline" onClick={onClose}>
                            إلغاء
                        </Button>
                        <Button
                            onClick={handleSubmit}

                            disabled={isLoading}

                            className="bg-[#ffac33] hover:bg-[#f59f00]">
                            {initialData ? "تحديث" : "إضافة"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
