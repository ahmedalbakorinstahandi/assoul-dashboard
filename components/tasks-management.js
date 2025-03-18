"use client"

import { useEffect, useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Edit, Trash2, Eye, CheckCircle, XCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaskViewDialog } from "@/components/dialogs/task-view-dialog"
import { SystemTasksEditDialog } from "@/components/dialogs/tasks/system-tasks/system-tasks-edit-dialog"
import { TaskCompletionDialog } from "@/components/dialogs/task-completion-dialog"
import { TaskRejectionDialog } from "@/components/dialogs/task-rejection-dialog"
import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog"
import toast from "react-hot-toast"
import { PaginationControls } from "./ui/pagination-controls"
import { deleteData, getData, postData, putData } from "@/lib/apiHelper"
import { Switch } from "./ui/switch"

export function TasksManagement() {
  const [activeTab, setActiveTab] = useState("system-tasks")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const initialFilter = { game_id: "", level_id: "", question_id: "" };
  const [filter, setFilter] = useState(initialFilter)
  const [gameColor, setGameColor] = useState("#ffffff"); // اللون الافتراضي

  // حالة النوافذ
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false)
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pageSize, setPageSize] = useState(10); // number of items per page
  const [imagePreview, setImagePreview] = useState(null); // Store image preview

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Generate preview URL
    }
  };
  const [gamesData, setGamesData] = useState([])
  const [gamesPage, setGamesPage] = useState(1);
  const [gamesMeta, setGamesMeta] = useState({});
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
  useEffect(() => {
    if (activeTab === "system-tasks") {
      fetchEntityData("tasks/system-tasks", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);
    }
    // else if (activeTab === "levels") {
    //   fetchEntityData("games/levels", setLevelsData, setLevelsMeta, levelsPage, searchTerm, filter);
    // } else if (activeTab === "questions") {
    //   fetchEntityData("games/questions", setQuestionsData, setQuestionsMeta, questionsPage, searchTerm, filter);
    // } else if (activeTab === "answers") {
    //   fetchEntityData("games/answers", setAnswersData, setAnswersMeta, answersPage, searchTerm, filter);
    // }
  }, [activeTab, gamesPage, searchTerm, pageSize, filter]);
  // Mock data for demonstration
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
      if (endpoint.includes("system-tasks")) {
        setIsAddTaskOpen(false);
        setImagePreview(null);

        fetchEntityData("tasks/system-tasks", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);
      }

    } else {
      toast.error(response.message);
    }
  };


  const parentTasksData = [
    {
      id: 1,
      title: "قياس السكر قبل الإفطار",
      assignedTo: "أحمد محمد",
      dueDate: "2023-06-16",
      status: "مكتمل",
    },
    {
      id: 2,
      title: "إعطاء جرعة الانسولين",
      assignedTo: "سارة علي",
      dueDate: "2023-06-16",
      status: "قيد التنفيذ",
    },
    {
      id: 3,
      title: "تسجيل قراءات السكر اليومية",
      assignedTo: "محمد خالد",
      dueDate: "2023-06-17",
      status: "قيد التنفيذ",
    },
  ]

  const childTasksData = [
    {
      id: 1,
      title: "لعب مستوى جديد من لعبة يلا نختار الصح",
      assignedTo: "ياسر أحمد",
      parent: "أحمد محمد",
      dueDate: "2023-06-16",
      status: "مكتمل",
    },
    {
      id: 2,
      title: "قراءة قصة عن السكري",
      assignedTo: "نورة أحمد",
      parent: "أحمد محمد",
      dueDate: "2023-06-17",
      status: "قيد التنفيذ",
    },
    {
      id: 3,
      title: "إكمال مستويات لعبة بطل الانسولين",
      assignedTo: "عمر سارة",
      parent: "سارة علي",
      dueDate: "2023-06-18",
      status: "قيد التنفيذ",
    },
  ]


  // معالجة عرض المهمة
  const handleViewTask = (task) => {
    setSelectedTask(task)
    setViewDialogOpen(true)
  }

  // معالجة تعديل المهمة
  const handleEditTask = (task) => {
    setSelectedTask(task)
    setEditDialogOpen(true)
  }

  // معالجة حذف المهمة
  const handleDeleteTask = (task) => {
    setSelectedTask(task)
    setDeleteDialogOpen(true)
  }

  // معالجة تأكيد إكمال المهمة
  const handleCompleteTask = (task) => {
    setSelectedTask(task)
    setCompletionDialogOpen(true)
  }

  // معالجة رفض المهمة
  const handleRejectTask = (task) => {
    setSelectedTask(task)
    setRejectionDialogOpen(true)
  }

  const handleUpdateEntity = async (endpoint, updatedEntity) => {
    let response

    response = await putData(endpoint + `/${selectedTask.id}`, updatedEntity)


    console.log(response);

    if (response.success) {
      toast.success(response.message)
      setEditDialogOpen(false)

      fetchEntityData("tasks/system-tasks", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);

    } else {
      toast.error(response.message)
    }
  }
  // معالجة حفظ تعديلات المهمة
  const handleSaveTask = (updatedTask) => {
    console.log("تم حفظ التعديلات:", updatedTask)
    handleUpdateEntity("tasks/system-tasks", updatedTask)


  }

  const handleDeleteEntity = async (endpoint, entityId) => {
    const response = await deleteData(endpoint, entityId)
    if (response.data.success) {
      toast.success(response.data.message)
      setDeleteDialogOpen(false)
      fetchEntityData("tasks/system-tasks", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);
    } else {
      toast.error(response.data.message)
    }
  }
  // معالجة تأكيد حذف المهمة
  const handleConfirmDelete = () => {
    // console.log("تم حذف المهمة:", selectedTask)
    handleDeleteEntity("tasks/system-tasks", selectedTask?.id)
  }

  // معالجة تأكيد إكمال المهمة
  const handleConfirmCompletion = (task, notes) => {
    console.log("تم تأكيد إكمال المهمة:", task, "ملاحظات:", notes)
    // هنا يمكن إضافة منطق تحديث حالة المهمة
  }

  // معالجة تأكيد رفض المهمة
  const handleConfirmRejection = (task, reason) => {
    console.log("تم رفض المهمة:", task, "السبب:", reason)
    // هنا يمكن إضافة منطق تحديث حالة المهمة
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h2 className="text-xl md:text-3xl font-bold">إدارة المهام</h2>
        {/* <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#ffac33] hover:bg-[#f59f00] w-full sm:w-auto">
              <Plus className="h-4 w-4 ml-2" />
              <span className="hidden sm:inline">إضافة مهمة جديدة</span>
              <span className="sm:hidden">إضافة</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>إضافة مهمة جديدة</DialogTitle>
              <DialogDescription>أدخل بيانات المهمة الجديدة هنا. اضغط على حفظ عند الانتهاء.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان المهمة</Label>
                <Input id="title" placeholder="أدخل عنوان المهمة" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">وصف المهمة</Label>
                <Textarea id="description" placeholder="أدخل وصف المهمة" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedTo">تعيين إلى</Label>
                <Select>
                  <SelectTrigger id="assignedTo">
                    <SelectValue placeholder="اختر المستخدم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="أحمد محمد">أحمد محمد</SelectItem>
                    <SelectItem value="سارة علي">سارة علي</SelectItem>
                    <SelectItem value="ياسر أحمد">ياسر أحمد</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">تاريخ الاستحقاق</Label>
                <Input id="dueDate" type="date" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                إلغاء
              </Button>
              <Button className="bg-[#ffac33] hover:bg-[#f59f00]" onClick={() => setIsAddTaskOpen(false)}>
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
        <div>

          {activeTab === "system-tasks" && (
            <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#ffac33] hover:bg-[#f59f00] w-full sm:w-auto">
                  <Plus className="h-4 w-4 ml-2" />
                  <span className="hidden sm:inline">إضافة مهمة جديدة</span>
                  <span className="sm:hidden">إضافة</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>إضافة مهمة جديدة</DialogTitle>
                  <DialogDescription>أدخل بيانات المهمة الجديدة هنا. اضغط على حفظ عند الانتهاء.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">عنوان المهمة</Label>
                    <Input id="title" placeholder="أدخل عنوان المهمة" />
                  </div>
                  {/* <div className="space-y-2">
                    <Label htmlFor="description">وصف اللعبة</Label>
                    <Textarea id="description" placeholder="أدخل وصف اللعبة" />
                  </div> */}
                  {/* <div className="flex items-center justify-between">
                    <Label htmlFor="is_enable">تفعيل اللعبة</Label>
                    <Switch id="is_enable" color="primary" checked={isEnabled} onCheckedChange={setIsEnabled} />

                  </div> */}
                  {/* إدخال اللون */}
                  <div className="space-y-2">
                    <Label htmlFor="color">لون المهمة</Label>
                    <input
                      id="color"
                      type="color"
                      value={gameColor}
                      onChange={(e) => setGameColor(e.target.value)}
                      className="w-full h-10 p-1 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="points">نقاط المهمة</Label>
                    <Input id="points" placeholder="أدخل نقاط المهمة" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">صورة المهمة</Label>
                    <Input id="image" type="file" onChange={handleImageChange} />
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" className="h-[100px] w-[100px] object-cover rounded border border-gray-300" />
                    )}
                    {/*            <Image src={

                      document.getElementById("image").files[0] || null// جلب الصورة

                    } alt="صورة اللعبة" className="h-20 w-20 object-cover rounded" /> */}
                  </div>

                </div>
                <DialogFooter>
                  <Button style={{ marginInline: "1rem" }} variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                    إلغاء
                  </Button>
                  <Button
                    className="bg-[#ffac33] mx-4 hover:bg-[#f59f00]"
                    onClick={() => {
                      const newGame = {
                        title: document.getElementById("title").value,
                        // description: document.getElementById("description").value,
                        points: document.getElementById("points").value,
                        color: gameColor, // إرسال اللون المختار

                      };

                      const imageFile = document.getElementById("image").files[0]; // جلب الصورة

                      handleAddEntity("tasks/system-tasks", newGame, imageFile);
                    }}
                  >
                    حفظ
                  </Button>

                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-2 sm:space-x-reverse">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="بحث عن مهمة..."
            className="pr-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="system-tasks">مهام عسول</TabsTrigger>
          {/* 
          <TabsTrigger value="parent-tasks" disabled>مهام الأهل</TabsTrigger>
          <TabsTrigger value="child-tasks" disabled>مهام الأطفال</TabsTrigger> */}
        </TabsList>
        <TabsContent value="system-tasks">
          <Card>
            <CardHeader>
              <CardTitle>مهام عسول</CardTitle>
              <CardDescription>إدارة المهام المخصصة  لعسول</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>عنوان المهمة</TableHead>
                      <TableHead>اللون</TableHead>
                      <TableHead>النقاط</TableHead>
                      <TableHead>الصورة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gamesData.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell> <div
                          style={{
                            backgroundColor: task.color,
                            width: "24px",
                            height: "24px",
                            borderRadius: "4px",
                            display: "inline-block",
                          }}
                        /></TableCell>
                        <TableCell>{task.points}</TableCell>
                        <TableCell>
                          <img src={task.image} className="rounded-lg h-10 w-10 object-cover" />
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            {/* <Button variant="ghost" size="icon" onClick={() => handleViewTask(task)}>
                              <Eye className="h-4 w-4" />
                            </Button> */}
                            <Button variant="ghost" size="icon" onClick={() => handleEditTask(task)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            {/* {task.status !== "مكتمل" ? (
                              <Button variant="ghost" size="icon" onClick={() => handleCompleteTask(task)}>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                            ) : (
                              <Button variant="ghost" size="icon" onClick={() => handleRejectTask(task)}>
                                <XCircle className="h-4 w-4 text-red-500" />
                              </Button>
                            )} */}
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
        {/* <TabsContent value="parent-tasks">
          <Card>
            <CardHeader>
              <CardTitle>مهام الأهل</CardTitle>
              <CardDescription>إدارة المهام المخصصة لأولياء الأمور</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>عنوان المهمة</TableHead>
                      <TableHead>معين إلى</TableHead>
                      <TableHead>تاريخ الاستحقاق</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parentTasksData.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>{task.assignedTo}</TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                        <TableCell>{getStatusBadge(task.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button variant="ghost" size="icon" onClick={() => handleViewTask(task)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditTask(task)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            {task.status !== "مكتمل" ? (
                              <Button variant="ghost" size="icon" onClick={() => handleCompleteTask(task)}>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                            ) : (
                              <Button variant="ghost" size="icon" onClick={() => handleRejectTask(task)}>
                                <XCircle className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
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

        <TabsContent value="child-tasks">
          <Card>
            <CardHeader>
              <CardTitle>مهام الأطفال</CardTitle>
              <CardDescription>إدارة المهام المخصصة للأطفال</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>عنوان المهمة</TableHead>
                      <TableHead>معين إلى</TableHead>
                      <TableHead>ولي الأمر</TableHead>
                      <TableHead>تاريخ الاستحقاق</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {childTasksData.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>{task.assignedTo}</TableCell>
                        <TableCell>{task.parent}</TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                        <TableCell>{getStatusBadge(task.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button variant="ghost" size="icon" onClick={() => handleViewTask(task)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditTask(task)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            {task.status !== "مكتمل" ? (
                              <Button variant="ghost" size="icon" onClick={() => handleCompleteTask(task)}>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                            ) : (
                              <Button variant="ghost" size="icon" onClick={() => handleRejectTask(task)}>
                                <XCircle className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

      </Tabs>

      {/* نوافذ العرض والتعديل والحذف والتأكيد */}
      <TaskViewDialog
        task={selectedTask}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        onComplete={handleCompleteTask}
        onReject={handleRejectTask}
      />

      <SystemTasksEditDialog
        game={selectedTask}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveTask}
      />

      <DeleteConfirmationDialog
        title="حذف المهمة"
        description={`هل أنت متأكد من حذف المهمة "${selectedTask?.title}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />

      <TaskCompletionDialog
        task={selectedTask}
        open={completionDialogOpen}
        onOpenChange={setCompletionDialogOpen}
        onConfirm={handleConfirmCompletion}
      />

      <TaskRejectionDialog
        task={selectedTask}
        open={rejectionDialogOpen}
        onOpenChange={setRejectionDialogOpen}
        onConfirm={handleConfirmRejection}
      />
    </div>
  )
}

