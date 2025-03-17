"use client"

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postData } from "@/lib/apiHelper";
import toast from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { statusUser } from "@/data/data"
import { Eye, EyeOff } from "lucide-react";
export function DoctorDialog({ isOpen, onClose, onSave, initialData }) {
    // Initialize form data state using a similar pattern to the InsulinDosesDialog
    const initialForm = {
        first_name: initialData?.user?.first_name || "",
        last_name: initialData?.user?.last_name || "",
        email: initialData?.user?.email || "",
        phone: initialData?.user?.phone || "",
        specialization: initialData?.specialization || "",
        classification_number: initialData?.classification_number || "",
        workplace_clinic_location: initialData?.workplace_clinic_location || "",


        password: "",
        status: initialData?.user?.status,

        password_confirmation: "",
        avatar: initialData?.user?.avatar || "",
    };
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        if (initialData) {
            console.log(initialData);

            setFormData({
                first_name: initialData?.user?.first_name || "",
                last_name: initialData?.user?.last_name || "",
                email: initialData?.user?.email || "",
                phone: initialData?.user?.phone || "",
                specialization: initialData?.specialization || "",
                classification_number: initialData?.classification_number || "",
                workplace_clinic_location: initialData?.workplace_clinic_location || "",

                password: "",
                status: initialData?.user?.status || "Active",

                password_confirmation: "",
                avatar: initialData?.user?.avatar || "",
            });
        } else {
            setFormData(initialForm);
        }
    }, [initialData]);

    const [imagePreview, setImagePreview] = useState(initialData?.user?.avatar || "");
    const [imageLink, setImageLink] = useState(initialData?.user?.avatar || "");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }
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
        setIsLoading(true)

        e.preventDefault();

        // Basic validation
        if (!formData.first_name) return toast.error("الاسم الأول مطلوب");
        if (!formData.last_name) return toast.error("اسم العائلة مطلوب");
        if (!formData.email.includes("@")) return toast.error("البريد الإلكتروني غير صالح");
        if (!formData.phone) return toast.error("رقم الهاتف مطلوب");
        if (!initialData && formData.password.length < 6) return toast.error("يجب أن تكون كلمة المرور 6 أحرف على الأقل");
        if (formData.password !== formData.password_confirmation) return toast.error("كلمات المرور غير متطابقة");

        // Build payload with keys as user[first_name], etc.
        const payload = {
            "user[first_name]": formData.first_name,
            "user[last_name]": formData.last_name,
            "user[email]": formData.email,
            "user[phone]": formData.phone,
            "user[password]": formData.password,
            "user[password_confirmation]": formData.password_confirmation,
            "user[avatar]": imageLink,
            "user[status]": !initialData ? "Active" : formData.status,
            "specialization": formData.specialization,
            "classification_number": formData.classification_number,
            "workplace_clinic_location": formData.workplace_clinic_location,


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
                        <Label>الاسم الأول</Label>
                        <Input name="first_name" value={formData.first_name} onChange={(e) => handleChange("first_name", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>اسم العائلة</Label>
                        <Input name="last_name" value={formData.last_name} onChange={(e) => handleChange("last_name", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label> التخصص</Label>
                        <Input name="specialization" value={formData.specialization} onChange={(e) => handleChange("specialization", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label> رقم التصنيف</Label>
                        <Input name="classification_number" value={formData.classification_number} onChange={(e) => handleChange("classification_number", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label> موقع عيادة مكان العمل</Label>
                        <Input name="workplace_clinic_location" value={formData.workplace_clinic_location} onChange={(e) => handleChange("workplace_clinic_location", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>البريد الإلكتروني</Label>
                        <Input type="email" name="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>رقم الهاتف</Label>
                        <Input name="phone" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                    </div>
                    {!initialData ? <>



                        <div className="space-y-2 relative">
                            <Label>كلمة المرور</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={(e) => handleChange("password", e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 end-3 flex items-center text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 relative">
                            <Label>تأكيد كلمة المرور</Label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={(e) => handleChange("password_confirmation", e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 end-3 flex items-center text-gray-500"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
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
                                    {statusUser.map((item, idx) => (
                                        <SelectItem key={idx} value={item.name.toString()}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                    </>}
                    <div className="space-y-2">
                        <Label>الصورة الشخصية</Label>
                        <Input type="file" onChange={handleImageChange} />
                        {imagePreview && (
                            <img src={imagePreview} alt="Preview" className="h-[100px] w-[100px] object-cover rounded border border-gray-300" />
                        )}
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
