"use client"

import { SetStateAction, useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Search, Edit, Trash2, Eye, Code, CalendarDays, Baby, LoaderIcon, LucidePhoneOutgoing } from "lucide-react"
import { UserViewDialog } from "@/components/dialogs/user-view-dialog"
import { UserEditDialog } from "@/components/dialogs/user-edit-dialog"
import { GuardianDialog } from "@/components/dialogs/users/guardians/guardian-dialog"
import { DoctorDialog } from "@/components/dialogs/users/doctors/doctor-dialog"
import { ChildrenDialog } from "@/components/dialogs/users/childrens/children-dialog"
import { OTPComponent } from "@/components/OTPComponent"
import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog"
import { DoctorDetailsDialog } from "@/components/dialogs/users/doctors/DoctorDetailsDialog"
import { GuardianDetailsDialog } from "@/components/dialogs/users/guardians/GuardianDetailsDialog"

import { deleteData, getData, postData, putData } from "@/lib/apiHelper"
import { PaginationControls } from "./ui/pagination-controls"
import toast from "react-hot-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { calculateAge } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

export function UserManagement() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("guardians")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddGameOpen, setIsAddGameOpen] = useState(false)
  const [isAddLevelOpen, setIsAddLevelOpen] = useState(false)
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false)
  const [isAddAnswerOpen, setIsAddAnswerOpen] = useState(false)
  const initialFilter = { guardian_id: "", level_id: "", question_id: "", sort_id: "asc" };
  const [filter, setFilter] = useState(initialFilter)

  const [isEnabled, setIsEnabled] = useState(true);
  const [gameColor, setGameColor] = useState("#ffffff"); // اللون الافتراضي
  const [imagePreview, setImagePreview] = useState(null); // Store image preview
  const [selectedGameId, setSelectedGameId] = useState("");
  const [selectedLevelId, setSelectedLevelId] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState("");

  const [selectedGuardian, setSelectedGuardian] = useState("");

  useEffect(() => {
    console.log("🔄 Guardian ID Updated:", filter);
    setSelectedGuardian(filter.guardian_id.toString()); // تحديث القيمة عند تغيير `filter.guardian_id`
    console.log(selectedGuardian);

  }, [filter]);


  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editDoctorDialogOpen, setEditDoctorDialogOpen] = useState(false)
  //show doctor 
  const [showDoctor, setShowDoctor] = useState(false)
  const [editChildDialogOpen, setEditChildDialogOpen] = useState(false)
  // show guardian
  const [showGuardian, setShowGuardian] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedItemLevel, setSelectedItemLevel] = useState(null)
  const [selectedItemQuestion, setSelectedItemQuestion] = useState(null)

  const [loading, setLoading] = useState(false)

  // بيانات الكيانات
  const [gamesData, setGamesData] = useState([])
  const [levelsData, setLevelsData] = useState([])
  const [questionsData, setQuestionsData] = useState([])
  const [answersData, setAnswersData] = useState([])
  const [pageSize, setPageSize] = useState(50); // number of items per page

  const [gamesPage, setGamesPage] = useState(1);
  const [levelsPage, setLevelsPage] = useState(1);
  const [questionsPage, setQuestionsPage] = useState(1);
  const [answersPage, setAnswersPage] = useState(1);

  const [gamesMeta, setGamesMeta] = useState({});
  const [levelsMeta, setLevelsMeta] = useState({});
  const [questionsMeta, setQuestionsMeta] = useState({});
  const [answersMeta, setAnswersMeta] = useState({});
  const [gamesIds, setGamesId] = useState([]);
  const [levelsIds, setLevelsId] = useState([]);
  const [questionsIds, setQuestionsId] = useState([]);
  useEffect(() => {
    const fetchGamesId = async () => {
      const response = await getData(`users/guardians`);
      // console.log("ddd", response);

      setGamesId(response.data);
    };


    fetchGamesId();
  }, [selectedItem, selectedLevelId]);



  // بيانات وهمية لل
  // الدالة المسؤولة عن جلب البيانات مع pagination والبحث
  const fetchEntityData = async (endpoint, setData, setMeta, page, searchTerm, filter) => {
    setLoading(true)
    const response = await getData(
      `${endpoint}?page=${page}&limit=${pageSize}&search=${searchTerm}`, filter
    );
    if (response.success) {
      setData(response.data);
      setMeta(response.meta); // Save metadata for pagination logic
      setLoading(false)
    } else {
      toast.error(response.message);
    }
  };

  // دالة لمزامنة جلب البيانات بناءً على التبويب النشط
  useEffect(() => {
    if (activeTab === "children") {
      fetchEntityData("users/children", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);
    } else if (activeTab === "guardians") {
      fetchEntityData("users/guardians", setLevelsData, setLevelsMeta, levelsPage, searchTerm, filter);
    } else if (activeTab === "doctors") {
      fetchEntityData("users/doctors", setQuestionsData, setQuestionsMeta, questionsPage, searchTerm, filter);
    } else if (activeTab === "answers") {
      fetchEntityData("games/answers", setAnswersData, setAnswersMeta, answersPage, searchTerm, filter);
    }
  }, [activeTab, gamesPage, levelsPage, questionsPage, answersPage, searchTerm, pageSize, filter]);
  // العمليات CRUD
  const handleAddEntity = async (endpoint, newEntity, file = null) => {
    let dataToSend = { ...newEntity }; // نسخ البيانات إلى كائن جديد

    console.log("Sending Data:", dataToSend);
    try {


      // إرسال البيانات كـ JSON
      const response = await postData(endpoint, dataToSend, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.success) {
        toast.success(response.message);
        console.log(response);

        // تحديث البيانات حسب نوع الكيان المضاف
        if (endpoint.includes("guardians")) {
          setIsAddGameOpen(false);
          setImagePreview(null);

          fetchEntityData("users/guardians", setLevelsData, setLevelsMeta, levelsPage, searchTerm, filter);
        }
        if (endpoint.includes("doctors")) {
          setSelectedGameId("")
          setIsAddLevelOpen(false);

          fetchEntityData("users/doctors", setQuestionsData, setQuestionsMeta, questionsPage, searchTerm, filter);
        };
        if (endpoint.includes("children")) {
          setSelectedGameId("")
          setSelectedLevelId("")

          setIsAddQuestionOpen(false);
          fetchEntityData("users/children", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);
        }
        if (endpoint.includes("answers")) {
          setSelectedGameId("")
          setSelectedLevelId("")
          setSelectedQuestionId("")


          setIsAddQuestionOpen(false);
          fetchEntityData("games/answers", setAnswersData, setAnswersMeta, answersPage, searchTerm, filter)

        };
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);


    }
  };


  const handleUpdateEntity = async (endpoint, updatedEntity) => {
    let response
    if (endpoint.includes("children")) {
      response = await putData(endpoint + `/${selectedItem.id}`, updatedEntity, true)
    } else {
      response = await putData(endpoint + `/${selectedItem.id}`, updatedEntity)

    }
    console.log(response);

    if (response.success) {
      toast.success(response.message)
      if (endpoint.includes("guardians")) {
        setEditDialogOpen(false);
        setImagePreview(null);

        fetchEntityData("users/guardians", setLevelsData, setLevelsMeta, levelsPage, searchTerm, filter);
      }
      if (endpoint.includes("doctors")) {
        // setSelectedGameId("")
        // setIsAddLevelOpen(false);
        setEditDoctorDialogOpen(false)
        fetchEntityData("users/doctors", setQuestionsData, setQuestionsMeta, questionsPage, searchTerm, filter);
      };
      if (endpoint.includes("children")) {
        // setSelectedGameId("")
        // setSelectedQuestionType("")
        // setSelectedLevelId("")
        // setSelectedQuestionView("")

        setEditChildDialogOpen(false);

        fetchEntityData("users/children", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);
      }
      if (endpoint.includes("answers")) fetchEntityData("games/answers", setAnswersData, answersPage)
    } else {
      toast.error(response.message)
    }
  }

  const handleDeleteEntity = async (endpoint, entityId) => {
    const response = await deleteData(endpoint, entityId)
    if (response.data.success) {
      toast.success(response.data.message)
      if (endpoint.includes("guardians")) fetchEntityData("users/guardians", setLevelsData, setLevelsMeta, levelsPage, searchTerm, filter);
      ;

      if (endpoint.includes("children")) fetchEntityData("users/children", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);
      ;

      if (endpoint.includes("doctors")) fetchEntityData("users/doctors", setQuestionsData, setQuestionsMeta, questionsPage, searchTerm, filter);


      if (endpoint.includes("answers")) fetchEntityData("games/answers", setAnswersData, answersPage)
    } else {
      toast.error(response.data.message)
    }
  }

  const handleViewChildren = (value) => {
    console.log("👤 Selected Guardian ID:", value);

    setFilter((prev) => ({
      ...prev,
      guardian_id: value.toString(),
    }));

    setSelectedGuardian(value.toString()); // تحديث القيمة فورًا
    setActiveTab("children");
  };

  // معالجة تعديل المستخدم
  const handleEditUser = (user) => {
    setSelectedItem(user)
    setEditDialogOpen(true)
  }
  const handleShowAppointments = (doctor) => {
    localStorage.setItem("doctor_id", doctor.id)
    router.push("/appointments")
  }
  const handleEditDoctor = (user) => {
    setSelectedItem(user)
    setEditDoctorDialogOpen(true)
  }
  const handleShowDoctor = (user) => {
    setSelectedItem(user)
    setShowDoctor(true)
  }
  const handleShowGuardian = (user) => {
    setSelectedItem(user)
    setShowGuardian(true)
  }
  const handleEditChild = (user) => {
    setSelectedItem(user)
    setEditChildDialogOpen(true)
  }
  // معالجة حذف المستخدم
  const handleDeleteUser = (user) => {
    setSelectedItem(user)
    setDeleteDialogOpen(true)
  }
  const handleGetCode = async (child) => {
    try {


      const response = await postData(`users/children/${child.id}/generate-code`, {}, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.success) {
        toast.success(response.message)
        fetchEntityData("users/children", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }



  // معالجة تأكيد حذف المستخدم
  const handleConfirmDelete = () => {
    let endpoint = ""
    if (activeTab === "guardians") endpoint = "users/guardians"
    if (activeTab === "doctors") endpoint = "users/doctors"
    if (activeTab === "children") endpoint = "users/children"
    if (activeTab === "answers") endpoint = "games/answers"
    handleDeleteEntity(endpoint, selectedItem?.id)
    setDeleteDialogOpen(false)
  }

  const handleAddItem = (updatedItem) => {
    console.log(updatedItem);

    let endpoint = ""
    if (activeTab === "guardians") endpoint = "users/guardians"
    if (activeTab === "doctors") endpoint = "users/doctors"
    if (activeTab === "children") endpoint = "users/children"
    if (activeTab === "answers") endpoint = "games/answers"
    handleAddEntity(endpoint, updatedItem)
  }
  const handleSaveItem = (updatedItem) => {
    console.log(updatedItem);

    let endpoint = ""
    if (activeTab === "guardians") endpoint = "users/guardians"
    if (activeTab === "doctors") endpoint = "users/doctors"
    if (activeTab === "children") endpoint = "users/children"
    if (activeTab === "answers") endpoint = "games/answers"
    handleUpdateEntity(endpoint, updatedItem)
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-3xl font-bold">إدارة المستخدمين</h2>
        {activeTab === "guardians" && (
          <>

            <Button onClick={() => setIsAddGameOpen(true)} className="bg-[#ffac33] hover:bg-[#f59f00]">
              <Plus className="h-4 w-4 ml-2" />
              <span className="hidden sm:inline">إضافة حساب أهل جديد</span>
              <span className="sm:hidden">إضافة</span>
            </Button>
          </>
        )}

        {activeTab === "doctors" && (
          <>

            <Button onClick={() => setIsAddLevelOpen(true)} className="bg-[#ffac33] hover:bg-[#f59f00]">
              <Plus className="h-4 w-4 ml-2" />
              <span className="hidden sm:inline">إضافة حساب طبيب جديد</span>
              <span className="sm:hidden">إضافة</span>
            </Button>
          </>
        )}
        {activeTab === "children" && (
          <>

            <Button onClick={() => setIsAddQuestionOpen(true)} className="bg-[#ffac33] hover:bg-[#f59f00]">
              <Plus className="h-4 w-4 ml-2" />
              <span className="hidden sm:inline">إضافة حساب طفل جديد</span>
              <span className="sm:hidden">إضافة</span>
            </Button>
          </>
        )}
        {/* <Dialog open={isAddGameOpen} onOpenChange={setIsAddGameOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#ffac33] hover:bg-[#f59f00]">
              <Plus className="h-4 w-4 ml-2" />
              <span className="hidden sm:inline">إضافة مستخدم جديد</span>
              <span className="sm:hidden">إضافة</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>إضافة مستخدم جديد</DialogTitle>
              <DialogDescription>أدخل بيانات المستخدم الجديد هنا. اضغط على حفظ عند الانتهاء.</DialogDescription>
            </DialogHeader>
            {renderUserForm()}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                إلغاء
              </Button>
              <Button className="bg-[#ffac33] hover:bg-[#f59f00]" onClick={() => setIsAddUserOpen(false)}>
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-2 sm:space-x-reverse">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search style={{ left: "10px" }} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="بحث..."
            className="pr-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {activeTab === "children" && <>
          <div className="space-y-2 " style={{ width: "10rem" }}>
            {/* <Label htmlFor="game">اللعبة</Label> */}
            <Select
              name="guardian_id"
              key={selectedGuardian}
              value={selectedGuardian} // استخدم الحالة لضمان التحديث
              onValueChange={(value) => {
                setFilter((prev) => ({
                  ...prev,
                  guardian_id: prev.guardian_id === value ? "" : value,
                }));
                setSelectedGuardian(value); // تحديث `selectedGuardian` لتجنب التأخير
              }}
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
          <Button variant="outline" onClick={() => setFilter(initialFilter)}>
            مسح الكل
          </Button>
        </>}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex grid-cols-2">
          <TabsTrigger value="guardians" className="flex-1">حسابات الأهل</TabsTrigger>
          <TabsTrigger value="doctors" className="flex-1">حسابات الأطباء</TabsTrigger>
          <TabsTrigger value="children" className="flex-1">حسابات الأطفال</TabsTrigger>
        </TabsList>

        <TabsContent value="guardians">
          <Card className="rtl">
            <CardHeader>
              <CardTitle>حسابات الأهل</CardTitle>
              <CardDescription>إدارة حسابات أولياء الأمور في النظام</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المعرف</TableHead>

                      <TableHead className="text-nowrap">الصورة الشخصية</TableHead>
                      <TableHead>الاسم</TableHead>

                      <TableHead className="text-nowrap">البريد الإلكتروني</TableHead>
                      <TableHead className="text-nowrap">رقم الهاتف</TableHead>
                      <TableHead className="text-nowrap">عدد الأطفال</TableHead>
                      <TableHead className="text-nowrap">الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ?
                      <TableRow>
                        <TableCell className="text-center " colSpan={8}>
                          <div className="flex w-full align-middle justify-center">
                            <LoaderIcon />
                          </div>
                        </TableCell>
                      </TableRow>
                      :
                      levelsData.map((parent) => (
                        <TableRow key={parent.id}>
                          <TableCell>{parent.id}</TableCell>

                          <TableCell>
                            <img src={parent.user.avatar || "/placeholder.svg"} className="rounded-lg h-10 w-10 object-cover  m-auto" />
                          </TableCell>
                          <TableCell className="font-medium text-nowrap">{parent.user.first_name + " " + parent.user.last_name}</TableCell>
                          <TableCell className="text-nowrap">{parent.user.email}</TableCell>
                          <TableCell className="switch-custom ">
                            {parent.user.phone}</TableCell>
                          <TableCell>2</TableCell>
                          <TableCell className="text-nowrap">
                            <span className={`px - 2 py - 1  text - nowrap rounded - full ${parent.user.status == "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} text - xs`}>
                              {parent.user.status == "Active" ? "نشط" : "غير نشط"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2 space-x-reverse justify-center">

                              <Button variant="ghost" size="icon" onClick={() => handleShowGuardian(parent)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleEditUser(parent)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(parent)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              {/* <Button className="bg-[#ffac33] hover:bg-[#f59f00] p-1" onClick={() => handleViewChildren(parent.id)}
                            >
                              <span>
                                عرض الاطفال

                              </span>
                            </Button> */}

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger >
                                    <Button variant="ghost" size="icon" onClick={() => handleViewChildren(parent.id)}>
                                      <Baby className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-[400px] text-wrap" side="top">
                                    عرض الاطفال
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>


                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <PaginationControls
                currentPage={levelsPage}
                setPage={setLevelsPage}
                totalItems={levelsMeta.total}
                pageSize={pageSize}
                setPageSize={setPageSize}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctors">
          <Card>
            <CardHeader>
              <CardTitle>حسابات الأطباء</CardTitle>
              <CardDescription>إدارة حسابات الأطباء في النظام</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المعرف</TableHead>

                      <TableHead className="text-nowrap">الصورة الشخصية</TableHead>
                      <TableHead>الاسم</TableHead>

                      <TableHead className="text-nowrap">البريد الإلكتروني</TableHead>
                      <TableHead className="text-nowrap">رقم الهاتف</TableHead>
                      <TableHead>التخصص</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ?
                      <TableRow>
                        <TableCell className="text-center " colSpan={8}>
                          <div className="flex w-full align-middle justify-center">
                            <LoaderIcon />
                          </div>
                        </TableCell>
                      </TableRow>
                      : questionsData.map((doctor) => (
                        <TableRow key={doctor.id}>
                          <TableCell>{doctor.id}</TableCell>

                          <TableCell>
                            <img src={doctor.user.avatar || "/placeholder.svg"} className="rounded-lg h-10 w-10 object-cover  m-auto" />
                          </TableCell>
                          <TableCell className="font-medium text-nowrap">{doctor.user.first_name + " " + doctor.user.last_name}</TableCell>
                          <TableCell>{doctor.user.email}</TableCell>
                          <TableCell className="switch-custom ">{doctor.user.phone}</TableCell>
                          <TableCell>{doctor.specialization}</TableCell>
                          <TableCell className="text-nowrap">
                            <span className={`px - 2 py - 1 text - nowrap rounded - full ${doctor.user.status == "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} text - xs`}>
                              {doctor.user.status == "Active" ? "نشط" : "غير نشط"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2 space-x-reverse justify-center">

                              <Button variant="ghost" size="icon" onClick={() => handleShowDoctor(doctor)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleEditDoctor(doctor)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(doctor)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger >
                                    <Button variant="ghost" size="icon" onClick={() => handleShowAppointments(doctor)}>
                                      <CalendarDays className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-[400px] text-wrap" side="top">
                                    عرض الحجوزات
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <PaginationControls
                currentPage={questionsPage}
                setPage={setQuestionsPage}
                totalItems={questionsMeta.total}
                pageSize={pageSize}
                setPageSize={setPageSize}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="children">
          <Card>
            <CardHeader>
              <CardTitle>حسابات الأطفال</CardTitle>
              <CardDescription>إدارة حسابات الأطفال ومتابعة بياناتهم</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المعرف</TableHead>

                      <TableHead className="text-nowrap">الصورة الشخصية</TableHead>
                      <TableHead>الاسم</TableHead>

                      <TableHead>الجنس</TableHead>
                      <TableHead>العمر</TableHead>
                      <TableHead>الطول</TableHead>
                      <TableHead>الوزن</TableHead>
                      <TableHead className="text-nowrap"> سنة الاصابة</TableHead>
                      <TableHead className="text-nowrap"> رمز الدخول </TableHead>

                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ?
                      <TableRow>
                        <TableCell className="text-center " colSpan={11}>
                          <div className="flex w-full align-middle justify-center">
                            <LoaderIcon />
                          </div>
                        </TableCell>
                      </TableRow>
                      : gamesData.map((child) => (
                        <TableRow key={child.id}>
                          <TableCell>{child.id}</TableCell>

                          <TableCell>
                            <img src={child.user.avatar || "/placeholder.svg"} className="rounded-lg h-10 w-10 object-cover  m-auto" />
                          </TableCell>
                          <TableCell className="font-medium text-nowrap">{child.user.first_name + " " + child.user.last_name}</TableCell>
                          <TableCell className="text-nowrap">{child.gender == "male" ? "ذكر" : "انثى"}</TableCell>
                          <TableCell className="text-nowrap">{calculateAge(child.birth_date)}</TableCell>
                          <TableCell className="text-nowrap">{(child.height)} سم</TableCell>
                          <TableCell className="text-nowrap">{(child.weight)} سم</TableCell>
                          <TableCell className="text-nowrap">{(child.diabetes_diagnosis_age)} سنة</TableCell>
                          <TableCell>
                            <OTPComponent otp={child.user.otp} otp_expire_at={child.user.otp_expide_at} />

                          </TableCell>

                          <TableCell>
                            <span className={`px - 2 py - 1 text - nowrap rounded - full ${child.user.status == "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} text - xs`}>
                              {child.user.status == "Active" ? "نشط" : "غير نشط"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2 space-x-reverse justify-center">

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger >
                                    <Button variant="ghost" size="icon" onClick={() => handleGetCode(child)}>
                                      <LucidePhoneOutgoing className="h-4 w-4" />
                                    </Button>

                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-[400px] text-wrap" side="top">
                                    الحصول على رمز للدخول
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <Button variant="ghost" size="icon" onClick={() => { router.push(`users/patient/${child.id}`) }} >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleEditChild(child)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(child)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <PaginationControls
                currentPage={gamesPage}
                setPage={setGamesPage}
                totalItems={gamesMeta.total}
                pageSize={pageSize}
                setPageSize={setPageSize}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <GuardianDialog
        isOpen={isAddGameOpen}
        onClose={() => setIsAddGameOpen(false)}
        onSave={handleAddItem}
      // initialData={selectedUser}
      />
      <GuardianDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSaveItem}
        initialData={selectedItem}
      />

      <DoctorDialog
        isOpen={isAddLevelOpen}
        onClose={() => setIsAddLevelOpen(false)}
        onSave={handleAddItem}
      // initialData={selectedItem}
      />

      <DoctorDialog
        isOpen={editDoctorDialogOpen}
        onClose={() => setEditDoctorDialogOpen(false)}
        onSave={handleSaveItem}
        initialData={selectedItem}
      />

      <DoctorDetailsDialog
        isOpen={showDoctor}
        onClose={() => setShowDoctor(false)}
        // onSave={handleSaveItem}
        // initialData={selectedItem}
        details={selectedItem}
      />
      <GuardianDetailsDialog
        isOpen={showGuardian}
        onClose={() => setShowGuardian(false)}
        // onSave={handleSaveItem}
        // initialData={selectedItem}
        userData={selectedItem}
      />

      {/* childern */}
      <ChildrenDialog
        isOpen={isAddQuestionOpen}
        onClose={() => setIsAddQuestionOpen(false)}
        onSave={handleAddItem}
        gamesIds={gamesIds}
      // initialData={selectedItem}
      />

      <ChildrenDialog
        isOpen={editChildDialogOpen}
        onClose={() => setEditChildDialogOpen(false)}
        gamesIds={gamesIds}

        onSave={handleSaveItem}
        initialData={selectedItem}
      />

      <DeleteConfirmationDialog
        title="حذف المستخدم"
        description={`هل أنت متأكد من حذف المستخدم ؟ هذا الإجراء لا يمكن التراجع عنه.`}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </div >
  )
}

