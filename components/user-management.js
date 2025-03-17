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
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { UserViewDialog } from "@/components/dialogs/user-view-dialog"
import { UserEditDialog } from "@/components/dialogs/user-edit-dialog"
import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog"
import { getData, postData } from "@/lib/apiHelper"
import { PaginationControls } from "./ui/pagination-controls"
import toast from "react-hot-toast"

export function UserManagement() {
  const [activeTab, setActiveTab] = useState("parents")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddGameOpen, setIsAddGameOpen] = useState(false)
  const [isAddLevelOpen, setIsAddLevelOpen] = useState(false)
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false)
  const [isAddAnswerOpen, setIsAddAnswerOpen] = useState(false)
  const initialFilter = { game_id: "", level_id: "", question_id: "" };
  const [filter, setFilter] = useState(initialFilter)

  const [isEnabled, setIsEnabled] = useState(true);
  const [gameColor, setGameColor] = useState("#ffffff"); // اللون الافتراضي
  const [imagePreview, setImagePreview] = useState(null); // Store image preview
  const [selectedGameId, setSelectedGameId] = useState("");
  const [selectedLevelId, setSelectedLevelId] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState("");

  const [selectedQuestionType, setSelectedQuestionType] = useState("");
  const [selectedQuestionView, setSelectedQuestionView] = useState("text");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Generate preview URL
    }
  };
  // حالات النوافذ المنبثقة
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [viewDialogLevelOpen, setViewDialogLevelOpen] = useState(false)
  const [viewDialogQuestionOpen, setViewDialogQuestionOpen] = useState(false)


  const [editDialogOpen, setEditDialogOpen] = useState(false)
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
  const [pageSize, setPageSize] = useState(10); // number of items per page

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

  const typQuestions = [
    { id: 1, name: "DragDrop" },
    { id: 2, name: "LetterArrangement" },
    { id: 3, name: "MCQ" },

  ]
  const viewQuestions = [
    { id: 1, name: "text", title: "نص" },
    { id: 2, name: "image", title: "صورة" },

  ]


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
    } else if (activeTab === "parents") {
      fetchEntityData("users/guardians", setLevelsData, setLevelsMeta, levelsPage, searchTerm, filter);
    } else if (activeTab === "questions") {
      fetchEntityData("games/questions", setQuestionsData, setQuestionsMeta, questionsPage, searchTerm, filter);
    } else if (activeTab === "answers") {
      fetchEntityData("games/answers", setAnswersData, setAnswersMeta, answersPage, searchTerm, filter);
    }
  }, [activeTab, gamesPage, levelsPage, questionsPage, answersPage, searchTerm, pageSize, filter]);
  // العمليات CRUD
  const handleAddEntity = async (endpoint, newEntity, file = null) => {
    let dataToSend = { ...newEntity }; // نسخ البيانات إلى كائن جديد
    let imageLink = "";

    if (file) {
      console.log("Before uploading image:", dataToSend);

      // رفع الصورة والحصول على الرابط
      const response = await postData("general/upload-image", { image: file, folder: `games` }, {});
      console.log("Upload response:", response);

      if (response.success) {
        imageLink = response.data.image_name;
        dataToSend.image = imageLink; // إضافة رابط الصورة إلى البيانات
      } else {
        toast.error("فشل رفع الصورة");
        return;
      }

      console.log("After adding image:", dataToSend);
    }

    console.log("Sending Data:", dataToSend);

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
      if (endpoint.includes("games")) {
        setIsAddGameOpen(false);
        setImagePreview(null);

        fetchEntityData("games/games", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);
      }
      if (endpoint.includes("levels")) {
        setSelectedGameId("")
        setIsAddLevelOpen(false);

        fetchEntityData("games/levels", setLevelsData, setLevelsMeta, levelsPage, searchTerm, filter)
      };
      if (endpoint.includes("questions")) {
        setSelectedGameId("")
        setSelectedQuestionType("")
        setSelectedLevelId("")
        setSelectedQuestionView("")

        setIsAddQuestionOpen(false);
        fetchEntityData("games/questions", setQuestionsData, setQuestionsMeta, questionsPage, searchTerm, filter);
      }
      if (endpoint.includes("answers")) {
        setSelectedGameId("")
        setSelectedQuestionType("")
        setSelectedLevelId("")
        setSelectedQuestionView("")
        setSelectedQuestionId("")


        setIsAddAnswerOpen(false);
        fetchEntityData("games/answers", setAnswersData, setAnswersMeta, answersPage, searchTerm, filter)

      };
    } else {
      toast.error(response.message);
    }
  };


  const handleUpdateEntity = async (endpoint, updatedEntity) => {
    const response = await putData(endpoint, updatedEntity)
    if (response.success) {
      toast.success("تم التعديل بنجاح")
      if (endpoint.includes("games")) fetchEntityData("games/games", setGamesData, gamesPage)
      if (endpoint.includes("levels")) fetchEntityData("games/levels", setLevelsData, levelsPage)
      if (endpoint.includes("questions")) fetchEntityData("games/questions", setQuestionsData, questionsPage)
      if (endpoint.includes("answers")) fetchEntityData("games/answers", setAnswersData, answersPage)
    } else {
      toast.error(response.message)
    }
  }

  const handleDeleteEntity = async (endpoint, entityId) => {
    const response = await deleteData(endpoint, entityId)
    if (response.success) {
      toast.success("تم الحذف بنجاح")
      if (endpoint.includes("games")) fetchEntityData("games/games", setGamesData, gamesPage)
      if (endpoint.includes("levels")) fetchEntityData("games/levels", setLevelsData, levelsPage)
      if (endpoint.includes("questions")) fetchEntityData("games/questions", setQuestionsData, questionsPage)
      if (endpoint.includes("answers")) fetchEntityData("games/answers", setAnswersData, answersPage)
    } else {
      toast.error(response.message)
    }
  }
  // Mock data for demonstration
  const parentsData = [
    { id: 1, name: "أحمد محمد", email: "ahmed@example.com", phone: "0501234567", childrenCount: 2, status: "نشط" },
    { id: 2, name: "سارة علي", email: "sara@example.com", phone: "0551234567", childrenCount: 1, status: "نشط" },
    { id: 3, name: "محمد خالد", email: "mohammed@example.com", phone: "0561234567", childrenCount: 3, status: "نشط" },
  ]

  const doctorsData = [
    {
      id: 1,
      name: "د. فاطمة أحمد",
      email: "dr.fatima@example.com",
      phone: "0501111111",
      specialty: "طب أطفال",
      status: "نشط",
    },
    {
      id: 2,
      name: "د. خالد عبدالله",
      email: "dr.khalid@example.com",
      phone: "0502222222",
      specialty: "غدد صماء",
      status: "نشط",
    },
  ]

  const childrenData = [
    { id: 1, name: "ياسر أحمد", age: 8, parent: "أحمد محمد", diabetesType: "النوع 1", status: "نشط" },
    { id: 2, name: "نورة أحمد", age: 10, parent: "أحمد محمد", diabetesType: "النوع 1", status: "نشط" },
    { id: 3, name: "عمر سارة", age: 9, parent: "سارة علي", diabetesType: "النوع 1", status: "نشط" },
  ]

  // الحصول على البيانات الحالية بناءً على التبويب النشط
  const getCurrentData = () => {
    switch (activeTab) {
      case "parents":
        return parentsData
      case "doctors":
        return doctorsData
      case "children":
        return childrenData
      default:
        return []
    }
  }

  // معالجة عرض المستخدم
  const handleViewUser = (user) => {
    setSelectedUser(user)
    setViewDialogOpen(true)
  }

  // معالجة تعديل المستخدم
  const handleEditUser = (user) => {
    setSelectedUser(user)
    setEditDialogOpen(true)
  }

  // معالجة حذف المستخدم
  const handleDeleteUser = (user) => {
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }

  // معالجة حفظ تعديلات المستخدم
  const handleSaveUser = (updatedUser) => {
    console.log("تم حفظ التعديلات:", updatedUser)
    // هنا يمكن إضافة منطق تحديث البيانات
  }

  // معالجة تأكيد حذف المستخدم
  const handleConfirmDelete = () => {
    console.log("تم حذف المستخدم:", selectedUser)
    // هنا يمكن إضافة منطق حذف البيانات
  }

  const renderUserForm = () => {
    if (activeTab === "parents") {
      return (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input id="name" placeholder="أدخل الاسم الكامل" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" placeholder="أدخل البريد الإلكتروني" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input id="phone" placeholder="أدخل رقم الهاتف" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input id="password" type="password" placeholder="أدخل كلمة المرور" />
            </div>
          </div>
        </>
      )
    } else if (activeTab === "doctors") {
      return (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input id="name" placeholder="أدخل الاسم الكامل" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" placeholder="أدخل البريد الإلكتروني" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input id="phone" placeholder="أدخل رقم الهاتف" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">التخصص</Label>
              <Input id="specialty" placeholder="أدخل التخصص" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input id="password" type="password" placeholder="أدخل كلمة المرور" />
            </div>
          </div>
        </>
      )
    } else {
      return (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم الطفل</Label>
              <Input id="name" placeholder="أدخل اسم الطفل" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">العمر</Label>
              <Input id="age" type="number" placeholder="أدخل العمر" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent">ولي الأمر</Label>
              <Input id="parent" placeholder="اختر ولي الأمر" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diabetesType">نوع السكري</Label>
              <Input id="diabetesType" placeholder="اختر نوع السكري" />
            </div>
          </div>
        </>
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-3xl font-bold">إدارة المستخدمين</h2>
        <Dialog open={isAddGameOpen} onOpenChange={setIsAddGameOpen}>
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
        </Dialog>
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
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex grid-cols-2">
          <TabsTrigger value="parents" className="flex-1">حسابات الأهل</TabsTrigger>
          {/* <TabsTrigger value="doctors" className="flex-1">حسابات الأطباء</TabsTrigger> */}
          <TabsTrigger value="children" className="flex-1">حسابات الأطفال</TabsTrigger>
        </TabsList>

        <TabsContent value="parents">
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
                      <TableHead>الاسم</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead>رقم الهاتف</TableHead>
                      <TableHead>عدد الأطفال</TableHead>
                      <TableHead>الحالة</TableHead>
                      {/* <TableHead>الإجراءات</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {levelsData.map((parent) => (
                      <TableRow key={parent.id}>
                        <TableCell className="font-medium">{parent.user.first_name + " " + parent.user.last_name}</TableCell>
                        <TableCell>{parent.user.email}</TableCell>
                        <TableCell>{parent.user.phone}</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full ${parent.user.status == "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}  text-xs`}>
                            {parent.user.status == "Active" ? "نشط" : "غير نشط"}
                          </span>
                        </TableCell>
                        {/* <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button variant="ghost" size="icon" onClick={() => handleViewUser(parent)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditUser(parent)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(parent)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell> */}
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
                      <TableHead>الاسم</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead>رقم الهاتف</TableHead>
                      <TableHead>التخصص</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {doctorsData.map((doctor) => (
                      <TableRow key={doctor.id}>
                        <TableCell className="font-medium">{doctor.name}</TableCell>
                        <TableCell>{doctor.email}</TableCell>
                        <TableCell>{doctor.phone}</TableCell>
                        <TableCell>{doctor.specialty}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                            {doctor.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button variant="ghost" size="icon" onClick={() => handleViewUser(doctor)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditUser(doctor)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(doctor)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
                      <TableHead>الاسم</TableHead>
                      <TableHead>الجنس</TableHead>
                      <TableHead> تارخ الولادة</TableHead>
                      <TableHead>الحالة</TableHead>
                      {/* <TableHead>الإجراءات</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gamesData.map((child) => (
                      <TableRow key={child.id}>
                        <TableCell className="font-medium">{child.user.first_name + " " + child.user.last_name}</TableCell>
                        <TableCell>{child.gender == "male" ? "ذكر" : "انثى"}</TableCell>
                        <TableCell>{child.birth_date}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full ${child.user.status == "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}  text-xs`}>
                            {child.user.status == "Active" ? "نشط" : "غير نشط"}
                          </span>
                        </TableCell>
                        {/* <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button variant="ghost" size="icon" onClick={() => handleViewUser(child)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditUser(child)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(child)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell> */}
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

      {/* نوافذ العرض والتعديل والحذف */}
      <UserViewDialog user={selectedItem} open={viewDialogOpen} onOpenChange={setViewDialogOpen} />

      <UserEditDialog
        user={selectedItem}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveUser}
      />

      <DeleteConfirmationDialog
        title="حذف المستخدم"
        description={`هل أنت متأكد من حذف المستخدم "${selectedItem?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

