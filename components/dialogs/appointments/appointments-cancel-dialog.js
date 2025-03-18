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
export function AppointmentCancelDialog({ isOpen, onClose, onSave, initialData }) {
    // Initialize form data state using a similar pattern to the InsulinDosesDialog
    const initialForm = {
        cancel_reason: initialData?.cancel_reason || "",



    };
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        if (initialData) {
            console.log(initialData);

            setFormData({
                cancel_reason: initialData?.cancel_reason || "",


            });
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
            cancel_reason: formData?.cancel_reason || "",



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
                    <DialogTitle>{initialData ? "الغاء موعد " : "إضافة مستخدم جديد"}</DialogTitle>
                    {/* <DialogDescription>
                        {initialData ? "قم بتحديث بيانات المستخدم هنا." : "أدخل بيانات المستخدم الجديد هنا."}
                    </DialogDescription> */}
                </DialogHeader>
                <form className="grid gap-4 py-4">

                    <div className="space-y-2">
                        <Label> سبب الالغاء</Label>
                        <Textarea name="cancel_reason" value={formData.cancel_reason} onChange={(e) => handleChange("cancel_reason", e.target.value)} />
                    </div>


                    <DialogFooter>
                        <Button type="button" style={{ marginInline: "1rem" }} variant="outline" onClick={onClose}>
                            رجوع
                        </Button>
                        <Button
                            onClick={handleSubmit}

                            disabled={isLoading}

                            className="bg-[#ffac33] hover:bg-[#f59f00]">
                            {initialData ? "الغاء الموعد" : "إضافة"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
