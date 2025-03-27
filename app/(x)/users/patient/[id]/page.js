"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ClipboardList, FileText, MessageSquare, User, Ruler, Award, Droplet, Eye } from "lucide-react"
import Lottie from 'lottie-react';
import animationData from '@/public/loading.json'; // Adjust the path to your Lottie JSON file

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/ui/spinner"
import { deleteData, getData } from "@/lib/apiHelper"
import { MedicalRecordsDialog } from "@/components/dialogs/patient/medical-records/medical-records-dialog"
import toast from "react-hot-toast"
import { NoteDialog } from "@/components/dialogs/patient/notes/notes-dialog"
import { InstructionDialog } from "@/components/dialogs/patient/instructions/instructions-dialog"
import { GuardianDetailsDialog } from "@/components/dialogs/users/guardians/GuardianDetailsDialog";
import { AppointmentsChildren } from "@/components/appointments-children";
import { TasksChildren } from "@/components/tasks-children";

export default function PatientDetails() {
    const params = useParams()
    const { id } = params;


    const [patient, setPatient] = useState({});
    const [isAddMedical, setIsAddMedical] = useState(false);
    const [isEditMedical, setIsEditMedical] = useState(false);
    const [showGuardian, setShowGuardian] = useState(false)

    const [isAddNote, setIsAddNote] = useState(false);
    const [isEditNote, setIsEditNote] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [isAddInstruction, setIsAddInstruction] = useState(false);
    const [isEditInstruction, setIsEditInstruction] = useState(false);
    const handleShowGuardian = (user) => {
        setSelectedItem(user)
        setShowGuardian(true)
    }
    const fetchPatientData = async () => {
        const response = await getData(`users/children/${id}`);
        console.log("ddd", response.data);

        setPatient(response.data);
        setLoading(false)
    };
    const refreshDataMedical = async () => {
        fetchPatientData()
        setActiveTab("medical")
    };
    const handleDeleteMedical = async (recordId) => {
        const response = await deleteData("patients/medical-records", recordId)
        if (response.data.success) {
            toast.success(response.data.message)
            fetchPatientData()
            setActiveTab("medical")
        } else {
            toast.error(response.data.message)
        }
    }
    const handleDeleteNote = async (recordId) => {
        const response = await deleteData("patients/notes", recordId)
        if (response.data.success) {
            toast.success(response.data.message)
            fetchPatientData()
            setActiveTab("notes")

        } else {
            toast.error(response.data.message)
        }
    }
    const handleDeleteInstruction = async (recordId) => {
        const response = await deleteData("patients/instructions", recordId)
        if (response.data.success) {
            toast.success(response.data.message)
            fetchPatientData()
            setActiveTab("instructions")

        } else {
            toast.error(response.data.message)
        }
    }

    useEffect(() => {
        setLoading(true)
        const fetchPatientData = async () => {
            const response = await getData(`users/children/${id}`);
            console.log("ddd", response.data);

            setPatient(response.data);
            setLoading(false)
        };

        fetchPatientData();
    }, [id]);

    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("overview")

    // في التطبيق الحقيقي، سنقوم بجلب البيانات باستخدام معرف المريض
    // const { id } = params;
    // useEffect(() => { fetchPatientData(id) }, [id]);

    // const patient = patientData
    const fullName = `${patient.user?.first_name} ${patient.user?.last_name}`

    // حساب عمر المريض
    const birthDate = new Date(patient.birth_date)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()

    // تنسيق التاريخ بالعربية
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("EN-ca", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
        })
    }

    // تحديد لون شريط التقدم بناءً على النقاط
    const getProgressColor = (points) => {
        if (points < 1000) return "bg-red-500"
        if (points < 2000) return "bg-yellow-500"
        return "bg-green-500"
    }

    if (!patient) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <Lottie animationData={animationData} loop={true} style={{ width: 100, height: 100 }} />
            </div>
        )
    }

    return (
        <div className="66 mx-auto  ">
            {/* بطاقة الملف الشخصي الرئيسية */}
            <Card className="border-honey/30 shadow-lg">
                <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20 border-2 border-honey">
                                <AvatarImage src={patient.user?.avatar || "/placeholder.svg?height=80&width=80"} alt={fullName} />
                                <AvatarFallback className="bg-honey/20 text-honey text-xl">
                                    {patient.user?.first_name.charAt(0)}
                                    {patient.user?.last_name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-2xl font-bold text-primary">{fullName}</CardTitle>
                                <CardDescription className="text-lg">
                                    {age} سنة • تم تشخيصه بالسكري في عمر {patient.diabetes_diagnosis_age} سنوات
                                </CardDescription>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="bg-honey/10 text-honey border-honey/30">
                                        {patient.points} نقطة
                                    </Badge>
                                    <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
                                        {patient.gender === "male" ? "ذكر" : "أنثى"}
                                    </Badge>
                                    <Badge variant="outline" className="bg-pink-500/10 text-pink-500 border-pink-500/30">
                                        {patient.insulin_doses} جرعات أنسولين
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {/* <Button variant="outline" className="border-honey text-honey hover:bg-honey hover:text-white">
                                تعديل البيانات
                            </Button> */}
                            {/* <Button className="bg-primary text-white hover:bg-honey/90">إضافة قراءة سكر</Button> */}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid grid-cols-5 md:w-fit">
                            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                            <TabsTrigger value="medical">السجلات الطبية</TabsTrigger>
                            <TabsTrigger value="appointments"> الحجوزات</TabsTrigger>

                            <TabsTrigger value="instructions">التعليمات</TabsTrigger>
                            <TabsTrigger value="notes">الملاحظات</TabsTrigger>
                        </TabsList>

                        {/* نظرة عامة */}
                        <TabsContent value="overview" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
                                {/* بطاقة المعلومات الشخصية */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <User className="h-5 w-5 text-honey" />
                                            المعلومات الشخصية
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">تاريخ الميلاد:</span>
                                            <span className="font-medium">{formatDate(patient.birth_date)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">العمر:</span>
                                            <span className="font-medium">{age} سنة</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">الجنس:</span>
                                            <span className="font-medium">{patient.gender === "male" ? "ذكر" : "أنثى"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">الحالة:</span>
                                            <Badge variant={patient.user?.status === "Active" ? "default" : "outline"}>
                                                {patient.user?.status === "Active" ? "نشط" : "غير نشط"}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* بطاقة القياسات الجسدية */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Ruler className="h-5 w-5 text-blue-500" />
                                            القياسات الجسدية
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">الطول:</span>
                                            <span className="font-medium">{patient.height} سم</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">الوزن:</span>
                                            <span className="font-medium">{patient.weight} كجم</span>
                                        </div>
                                        {/* <div className="flex justify-between">
                                            <span className="text-muted-foreground">مؤشر كتلة الجسم:</span>
                                            <span className="font-medium">
                                                {(patient.weight / Math.pow(patient.height / 100, 2)).toFixed(1)}
                                            </span>
                                        </div> */}
                                    </CardContent>
                                </Card>

                                {/* بطاقة معلومات السكري */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Droplet className="h-5 w-5 text-pink-500" />
                                            معلومات السكري
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">عمر التشخيص:</span>
                                            <span className="font-medium">{patient.diabetes_diagnosis_age} سنوات</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">جرعات الأنسولين:</span>
                                            <span className="font-medium">{patient.insulin_doses} جرعات يومياً</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">مدة الإصابة:</span>
                                            <span className="font-medium">{age - patient.diabetes_diagnosis_age} سنوات</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* بطاقة الولي/الوصي */}
                                {patient.guardian && <>
                                    <Card >
                                        <CardHeader className="pb-2 flex flex-row content-between">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <User className="h-5 w-5 text-green-500" />
                                                معلومات الولي/الوصي
                                            </CardTitle>
                                            {/* <Button variant="ghost" size="icon" onClick={() => handleShowGuardian(parent, guardia)}> */}

                                        </CardHeader>
                                        <CardContent>
                                            {patient.guardian?.map((guardian) => (
                                                <div key={guardian.id} className="flex flex-col h-full" >
                                                    <div className="flex items-center gap-4  h-full">
                                                        <Avatar>
                                                            <AvatarImage
                                                                src={guardian?.user?.avatar}
                                                                alt={`${guardian.user?.first_name} ${guardian.user?.last_name}`}
                                                            />
                                                            <AvatarFallback className="bg-green-500/20 text-green-500">
                                                                {guardian.user?.first_name.charAt(0)}
                                                                {guardian.user?.last_name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium">
                                                                {guardian.user?.first_name} {guardian.user?.last_name}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">{guardian.user?.email}</p>
                                                            <p className="text-sm text-muted-foreground">{guardian.user?.phone}</p>
                                                        </div>
                                                    </div>

                                                    <Button onClick={() => handleShowGuardian(guardian)} className="bg-[#ffac33] hover:bg-[#f59f00] max-w-max mr-auto">
                                                        <Eye className="h-4 w-4 ml-2" />
                                                        <span className="hidden sm:inline">    عرض المزيد</span>
                                                        <span className="sm:hidden"> عرض المزيد</span>
                                                    </Button>
                                                    {/* <p className="underline-offset-2 text-blue-500  cursor-pointer" >
                                                        عرض المزيد
                                                    </p> */}
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </>}
                                {/* بطاقة التقدم والإنجازات */}
                                {/* <Card className="md:col-span-2">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Award className="h-5 w-5 text-honey" />
                                            التقدم والإنجازات
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="font-medium">النقاط المكتسبة</span>
                                                <span className="font-medium">{patient.points} / 3000</span>
                                            </div>
                                            <Progress value={(patient.points / 3000) * 100} className={getProgressColor(patient.points)} />
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                                            <div className="flex flex-col items-center p-3 bg-honey/10 rounded-lg">
                                                <span className="text-2xl font-bold text-honey">24</span>
                                                <span className="text-xs text-center">مهمة مكتملة</span>
                                            </div>
                                            <div className="flex flex-col items-center p-3 bg-blue-500/10 rounded-lg">
                                                <span className="text-2xl font-bold text-blue-500">18</span>
                                                <span className="text-xs text-center">لعبة تعليمية</span>
                                            </div>
                                            <div className="flex flex-col items-center p-3 bg-pink-500/10 rounded-lg">
                                                <span className="text-2xl font-bold text-pink-500">156</span>
                                                <span className="text-xs text-center">قراءة سكر</span>
                                            </div>
                                            <div className="flex flex-col items-center p-3 bg-green-500/10 rounded-lg">
                                                <span className="text-2xl font-bold text-green-500">7</span>
                                                <span className="text-xs text-center">شارات مكتسبة</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card> */}
                            </div>
                        </TabsContent>
                        {/* {patient.medical_records && <> */}
                        {/* السجلات الطبية */}
                        <TabsContent value="medical" className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">السجلات الطبية ({patient?.medical_records?.length})</h3>
                                <Button size="sm" className="bg-primary text-white hover:bg-honey/90" onClick={() => setIsAddMedical(true)}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    إضافة سجل طبي
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {patient?.medical_records?.length <= 0 ? "لا يوجد سجلات طبية" : patient.medical_records?.map((record) => (
                                    <Card key={record.id} className="border-honey/20">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between">
                                                <CardTitle>{record.title}</CardTitle>
                                                <Badge variant="outline" className="bg-honey/10 text-honey border-honey/30">
                                                    {formatDate(record.created_at)}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p>{record.description}</p>
                                        </CardContent>
                                        <CardFooter className="pt-0 flex justify-end gap-2">
                                            <Button variant="ghost" size="sm"
                                                onClick={() => handleDeleteMedical(record.id)}
                                            >
                                                حذف
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedItem(record)
                                                    setIsEditMedical(true)
                                                }
                                                }
                                                className="border-honey text-honey hover:bg-honey hover:text-white"
                                            >
                                                تعديل
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                        {/* </>} */}
                        {/* التعليمات */}
                        <TabsContent value="instructions" className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">التعليمات الطبية ({patient.instructions?.length})</h3>
                                <Button size="sm" className="bg-blue-500 text-white hover:bg-honey/90"
                                    onClick={() => setIsAddInstruction(true)}
                                >
                                    <ClipboardList className="h-4 w-4 mr-2" />
                                    إضافة تعليمات
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {patient.instructions?.length <= 0 ? "لا يوجد تعليمات" : patient.instructions?.map((instruction) => (
                                    <Card key={instruction.id} className="border-blue-500/20">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between">
                                                <CardTitle className="text-blue-500">تعليمات طبية</CardTitle>
                                                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
                                                    {formatDate(instruction.created_at)}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p>{instruction.content}</p>
                                        </CardContent>
                                        <CardFooter className="pt-0 flex justify-end gap-2">
                                            <Button variant="ghost" size="sm"
                                                onClick={() => handleDeleteInstruction(instruction.id)}

                                            >
                                                حذف
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedItem(instruction)
                                                    setIsEditInstruction(true)
                                                }}
                                                className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                                            >
                                                تعديل
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="appointments" className="space-y-4">
                            <AppointmentsChildren childId={patient.id} />
                        </TabsContent>
                        <TabsContent value="tasks" className="space-y-4">
                            <TasksChildren childId={patient.id} />
                        </TabsContent>
                        {/* الملاحظات */}
                        <TabsContent value="notes" className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">الملاحظات ({patient.notes?.length})</h3>
                                <Button size="sm" className="bg-pink-500 text-white hover:bg-honey/90"
                                    onClick={() => setIsAddNote(true)}
                                >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    إضافة ملاحظة
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {patient.notes?.length <= 0 ? "لا يوجد" : patient.notes?.map((note) => (
                                    <Card key={note.id} className="border-pink-500/20">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between">
                                                <CardTitle className="text-pink-500">ملاحظة</CardTitle>
                                                <Badge variant="outline" className="bg-pink-500/10 text-pink-500 border-pink-500/30">
                                                    {formatDate(note.created_at)}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p>{note.content}</p>
                                        </CardContent>
                                        <CardFooter className="pt-0 flex justify-end gap-2">
                                            <Button variant="ghost" size="sm"
                                                onClick={() => handleDeleteNote(note.id)}

                                            >
                                                حذف
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedItem(note)
                                                    setIsEditNote(true)
                                                }}
                                                size="sm"
                                                className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
                                            >
                                                تعديل
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
            <MedicalRecordsDialog
                isOpen={isAddMedical}
                onClose={() => {

                    setSelectedItem(null)

                    setIsAddMedical(false)
                }}
                id={id}
                // initialData={patient?.medical_records}
                refreshData={() => {
                    fetchPatientData()
                    setActiveTab("medical")


                }}
            />
            <MedicalRecordsDialog
                isOpen={isEditMedical}
                onClose={() =>

                    setIsEditMedical(false)}
                id={id}
                initialData={selectedItem}
                refreshData={() => {
                    fetchPatientData()
                    setActiveTab("medical")
                    setSelectedItem(null)
                }}
            />
            <NoteDialog
                isOpen={isAddNote}
                onClose={() => {

                    setSelectedItem(null)

                    setIsAddNote(false)
                }}
                id={id}
                // initialData={patient?.medical_records}
                refreshData={() => {
                    fetchPatientData()
                    setActiveTab("notes")


                }}
            />
            <NoteDialog
                isOpen={isEditNote}
                onClose={() =>

                    setIsEditNote(false)}
                id={id}
                initialData={selectedItem}
                refreshData={() => {
                    fetchPatientData()
                    setActiveTab("notes")
                    setSelectedItem(null)
                }}
            />


            <InstructionDialog
                isOpen={isAddInstruction}
                onClose={() => {

                    setSelectedItem(null)

                    setIsAddInstruction(false)
                }}
                id={id}
                // initialData={patient?.medical_records}
                refreshData={() => {
                    fetchPatientData()
                    setActiveTab("instructions")


                }}
            />
            <InstructionDialog
                isOpen={isEditInstruction}
                onClose={() =>

                    setIsEditInstruction(false)}
                id={id}
                initialData={selectedItem}
                refreshData={() => {
                    fetchPatientData()
                    setActiveTab("instructions")
                    setSelectedItem(null)
                }}
            />
            <GuardianDetailsDialog
                isOpen={showGuardian}
                onClose={() => setShowGuardian(false)}
                // onSave={handleSaveItem}
                // initialData={selectedItem}
                userData={selectedItem}
            />
        </div>
    )
}

