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
import { getData } from "@/lib/apiHelper";
import AsyncSelect from "react-select/async";

export function AppointmentDialog({ isOpen, onClose, onSave, children, doctors, guardian, initialData, childId }) {
    // Initialize form data state using a similar pattern to the InsulinDosesDialog
    const initialForm = {
        patient_id: initialData?.patient_id != null
            ? initialData.patient_id.toString()
            : childId != null
                ? childId.toString()
                : "", // or some default value if both are missing
        guardian_id: initialData?.guardian_id || "",
        doctor_id: initialData?.doctor_id || "",
        title: initialData?.title || "",
        appointment_date: initialData?.appointment_date || "",
        patient_status: initialData?.patient_status || "",
        notes: initialData?.notes || "",
        patient_status: initialData?.patient_status || "",
        status: initialData?.status || "",



    };
    console.log(initialForm);

    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState(initialForm);
    const [defaultOptions, setDefaultOptions] = useState([]);
    const [defaultOptionsTow, setDefaultOptionsTow] = useState([]);
    const [defaultOptionsThree, setDefaultOptionsThree] = useState([]);

    useEffect(() => {
        const fetchInitialProviders = async () => {
            try {
                // Adjust your endpoint to limit the results (if supported by your API)
                const response = await getData(`users/doctors?limit=20`);
                const providers = response.data.map((item) => ({
                    label: `${item.user.first_name + " " + item.user.last_name}`,
                    value: item.id,
                }));
                setDefaultOptions(providers);
            } catch (error) {
                console.error("Error fetching initial providers:", error);
            }
        };
        const fetchInitialProviders2 = async () => {
            try {
                // Adjust your endpoint to limit the results (if supported by your API)
                const response = await getData(`users/guardians?limit=20`);
                const providers = response.data.map((item) => ({
                    label: `${item.user.first_name + " " + item.user.last_name}`,
                    value: item.id,
                }));
                setDefaultOptionsTow(providers);
            } catch (error) {
                console.error("Error fetching initial providers:", error);
            }
        };
        const fetchInitialProviders3 = async () => {
            try {
                // Adjust your endpoint to limit the results (if supported by your API)
                const response = await getData(`users/children?limit=20`);
                const providers = response.data.map((item) => ({
                    label: `${item.user.first_name + " " + item.user.last_name}`,
                    value: item.id,
                }));
                setDefaultOptionsThree(providers);
            } catch (error) {
                console.error("Error fetching initial providers:", error);
            }
        };
        fetchInitialProviders3()
        fetchInitialProviders2()
        fetchInitialProviders();
    }, []);
    const loadOptions = async (inputValue, callback) => {
        try {
            // Call your API with the search query
            // const response = await fetchData(`public/services`);

            const response = await getData(`users/doctors?search=${inputValue}`);
            const providers = response.data.map((item) => ({
                label: `${item.user.first_name + " " + item.user.last_name}`,
                value: item.id,
            }));
            callback(providers);
        } catch (error) {
            console.error("Error fetching providers on search:", error);
            callback([]);
        }
    };
    const loadOptionsTow = async (inputValue, callback) => {
        try {
            // Call your API with the search query
            // const response = await fetchData(`public/services`);

            const response = await getData(`users/guardians?search=${inputValue}`);
            const providers = response.data.map((item) => ({
                label: `${item.user.first_name + " " + item.user.last_name}`,
                value: item.id,
            }));
            callback(providers);
        } catch (error) {
            console.error("Error fetching providers on search:", error);
            callback([]);
        }
    };
    const loadOptionsThree = async (inputValue, callback) => {
        try {
            // Call your API with the search query
            // const response = await fetchData(`public/services`);

            const response = await getData(`users/children?search=${inputValue}`);
            const providers = response.data.map((item) => ({
                label: `${item.user.first_name + " " + item.user.last_name}`,
                value: item.id,
            }));
            callback(providers);
        } catch (error) {
            console.error("Error fetching providers on search:", error);
            callback([]);
        }
    };
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
        e.preventDefault();
        setIsLoading(true)


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
                <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
                    <div>
                        <AsyncSelect
                            cacheOptions
                            // className="mt-2"
                            defaultOptions={defaultOptionsThree}
                            className="min-w-48"
                            value={defaultOptionsThree.find(option => option.value == formData.patient_id.toString() || childId) || ""} // Set the value to be the object
                            loadOptions={loadOptionsThree}
                            isDisabled={childId ? true : false || initialData ? true : false}

                            onChange={(value) => handleChange("patient_id", value ? value.value : "")}
                            placeholder="اختر الطفل"
                            isClearable
                        />
                    </div>
                    {/* <div className="space-y-2">
                        <Label htmlFor="patient_id">الطفل</Label>
                        <Select
                            name="patient_id"
                            disabled={childId ? true : false || initialData ? true : false}
                            value={formData.patient_id.toString() || childId}
                            onValueChange={(value) => handleChange("patient_id", value)}
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
                    </div> */}
                    <div>
                        <AsyncSelect
                            cacheOptions
                            // className="mt-2"
                            className="min-w-48"
                            isDisabled={initialData ? true : false}

                            defaultOptions={defaultOptionsTow}
                            value={defaultOptionsTow.find(option => option.value == formData.guardian_id.toString()) || ""} // Set the value to be the object
                            loadOptions={loadOptionsTow}
                            onChange={(value) => handleChange("guardian_id", value ? value.value : "")}
                            placeholder="اختر ولي الامر"
                            isClearable
                        />
                    </div>
                    {/* <div className="space-y-2">
                        <Label htmlFor="guardian_id">ولي الامر</Label>
                        <Select
                            disabled={initialData ? true : false}

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
                    </div> */}
                    <div>
                        <AsyncSelect
                            cacheOptions
                            // className="mt-2"
                            className="min-w-48"
                            isDisabled={initialData ? true : false}

                            defaultOptions={defaultOptions}
                            value={defaultOptions.find(option => option.value.toString() == formData.doctor_id.toString()) || ""} // Set the value to be the object
                            loadOptions={loadOptions}
                            onChange={(value) => handleChange("doctor_id", value ? value.value : "")}
                            placeholder="اختر الطبيب"
                        // isClearable
                        />
                    </div>
                    {/* <div className="space-y-2">
                        <Label htmlFor="doctor_id">الطبيب</Label>
                        <Select
                            name="doctor_id"
                            disabled={initialData ? true : false}

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
                    </div> */}
                    <div className="space-y-2">
                        <Label>العنوان</Label>
                        <Input name="title" required value={formData.title} onChange={(e) => handleChange("title", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label> الوصف</Label>
                        <Textarea name="notes" required value={formData.notes} onChange={(e) => handleChange("notes", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label> تاريخ ووقت الزيارة</Label>
                        <Input required type="datetime-local" name="appointment_date" value={formatDateTime(formData.appointment_date)} onChange={(e) => handleChange("appointment_date", e.target.value)} />
                    </div>

                    {!initialData ? <>

                        <div className="space-y-2">
                            <Label htmlFor="patient_status"> حالة المريض</Label>
                            <Select
                                name="patient_status"
                                required={true}
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
                                            {item.name_ar}
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
                                            {item.name_ar}
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
                            type="submit"
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
