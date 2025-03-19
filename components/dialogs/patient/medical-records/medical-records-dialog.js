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
import { deleteData, getData, postData, putData } from "@/lib/apiHelper"
import toast from "react-hot-toast";

export function MedicalRecordsDialog({ isOpen, onClose, refreshData, id, initialData }) {
    // Initialize form data state using a similar pattern to the InsulinDosesDialog
    const initialForm = {
        patient_id: id || "",
        title: initialData?.title || "",
        description: initialData?.description || "",



    };
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        if (initialData) {
            console.log(initialData);

            setFormData({
                patient_id: id || "",
                title: initialData?.title || "",
                description: initialData?.description || "",

            });
            console.log("formData", formData);

        } else {
            setFormData(initialForm);
        }
    }, [initialData]);


    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }


    const handleSubmit = async (e) => {
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
            patient_id: id || "",
            title: formData?.title || "",
            description: formData?.description || "",


        };

        console.log("Submitting payload:", payload);
        if (initialData) {
            const response = await putData(`patients/medical-records/${initialData?.id}`, payload,
            );
            if (response.success) {
                toast.success(response.message)
                onClose();

                setIsLoading(false)
                refreshData()
            }
        } else {
            const response = await postData(`patients/medical-records`, payload, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response.success) {
                toast.success(response.message)
                setFormData({
                    patient_id: "",
                    title: "",
                    description: "",

                });
                onClose();

                setIsLoading(false)
                refreshData()
            }
        }
        // onSave(payload);

    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "تحديث السجل الطبي" : "إضافة سجل طبي جديد"}</DialogTitle>
                    <DialogDescription>
                        {initialData ? "قم بتحديث بيانات السجل الطبي هنا." : "أدخل بيانات السجل الطبي الجديد هنا."}
                    </DialogDescription>
                </DialogHeader>
                <form className="grid gap-4 py-4">

                    <div className="space-y-2">
                        <Label>العنوان</Label>
                        <Input name="title" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label> الوصف</Label>
                        <Textarea name="description" value={formData.description} onChange={(e) => handleChange("description", e.target.value)} />
                    </div>

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
