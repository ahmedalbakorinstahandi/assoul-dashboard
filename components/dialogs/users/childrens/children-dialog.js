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
export function ChildrenDialog({ isOpen, onClose, onSave, initialData, gamesIds }) {
    // Initialize form data state using a similar pattern to the InsulinDosesDialog
    const initialForm = {
        first_name: initialData?.user?.first_name || "",
        last_name: initialData?.user?.last_name || "",
        gender: initialData?.gender || "",
        birth_date: initialData?.birth_date || "",
        height: initialData?.height || "",
        weight: initialData?.weight || "",
        diabetes_diagnosis_age: initialData?.diabetes_diagnosis_age || "",
        guardian_id: initialData?.guardian?.[0]?.id || "",  // ✅ حل المشكلة هنا

    };
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        if (initialData) {
            // console.log(initialData);

            setFormData({
                first_name: initialData?.user?.first_name || "",
                last_name: initialData?.user?.last_name || "",
                gender: initialData?.gender || "",
                birth_date: initialData?.birth_date || "",
                height: initialData?.height || "",
                weight: initialData?.weight || "",
                guardian_id: initialData?.guardian?.[0]?.id || "",  // ✅ حل المشكلة هنا

                diabetes_diagnosis_age: initialData?.diabetes_diagnosis_age || "",
            });
            setImagePreview(initialData?.user?.avatar)
        } else {
            setFormData(initialForm);
        }
    }, [initialData]);

    const [imagePreview, setImagePreview] = useState(initialData?.user?.avatar || "");
    // console.log(initialData?.user?.avatar);
    
    const [imageLink, setImageLink] = useState(null);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }
    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            // const response = await postData("general/upload-image", { image: file, folder: "games" }, {});
            // if (response.success) {
            setImageLink(file);
            setImagePreview(URL.createObjectURL(file));
            // } else {
            //     toast.error("فشل رفع الصورة");
            // }
        }
    };

    const handleSubmit = (e) => {
        setIsLoading(true)

        e.preventDefault();

        // Basic validation
        if (!formData.first_name) return toast.error("الاسم الأول مطلوب");
        if (!formData.last_name) return toast.error("اسم العائلة مطلوب");

        // if (!initialData && formData.password.length < 6) return toast.error("يجب أن تكون كلمة المرور 6 أحرف على الأقل");
        // if (formData.password !== formData.password_confirmation) return toast.error("كلمات المرور غير متطابقة");

        // Build payload with keys as user[first_name], etc.
        const payload = {

            avatar: imageLink,
            status: !initialData ? "Active" : formData.status,
            first_name: formData.first_name,
            last_name: formData.last_name,
            gender: formData.gender,
            birth_date: formData?.birth_date,
            height: formData?.height,
            weight: formData?.weight,
            diabetes_diagnosis_age: formData?.diabetes_diagnosis_age,
            guardian_id: formData.guardian_id

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
                        <Label>الجنس</Label>
                        <div className="flex gap-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <Input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={formData.gender === "male"}
                                    onChange={(e) => handleChange("gender", e.target.value)}
                                />
                                <span style={{ marginInline: "0.5rem" }}>ذكر</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <Input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={formData.gender === "female"}
                                    onChange={(e) => handleChange("gender", e.target.value)}
                                />
                                <span style={{ marginInline: "0.5rem" }}>أنثى</span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label> تاريخ الولادة</Label>
                        <Input name="birth_date" value={formData.birth_date}
                            type="date"
                            onChange={(e) => handleChange("birth_date", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>    الطول</Label>
                        <Input type="number" name="height" value={formData.height} onChange={(e) => handleChange("height", e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label>    الوزن</Label>
                        <Input type="number" name="weight" value={formData.weight} onChange={(e) => handleChange("weight", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>    تشخيص مرض السكري حسب العمر</Label>
                        <Input type="number" name="diabetes_diagnosis_age" value={formData.diabetes_diagnosis_age} onChange={(e) => handleChange("diabetes_diagnosis_age", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="game_id">ولي الأمر</Label>
                        <Select
                            // disabled

                            name="guardian_id"
                            value={formData.guardian_id}
                            onValueChange={(value) => handleChange("guardian_id", value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="اختر ولي الأمر" />
                            </SelectTrigger>
                            <SelectContent>
                                {gamesIds.map((game, idx) => (
                                    <SelectItem key={idx} value={game.id.toString()}>
                                        {game.user.first_name + " " + game.user.last_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
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
