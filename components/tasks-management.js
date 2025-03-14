"use client"

import { useState } from "react"
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
import { TaskEditDialog } from "@/components/dialogs/task-edit-dialog"
import { TaskCompletionDialog } from "@/components/dialogs/task-completion-dialog"
import { TaskRejectionDialog } from "@/components/dialogs/task-rejection-dialog"
import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog"

export function TasksManagement() {
  const [activeTab, setActiveTab] = useState("parent-tasks")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)

  // حالة النوافذ
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false)
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  // Mock data for demonstration
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "مكتمل":
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">{status}</span>
      case "قيد التنفيذ":
        return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">{status}</span>
      case "متأخر":
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">{status}</span>
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">{status}</span>
    }
  }

  // الحصول على البيانات الحالية بناءً على التبويب النشط
  const getCurrentData = () => {
    return activeTab === "parent-tasks" ? parentTasksData : childTasksData
  }

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

  // معالجة حفظ تعديلات المهمة
  const handleSaveTask = (updatedTask) => {
    console.log("تم حفظ التعديلات:", updatedTask)
    // هنا يمكن إضافة منطق تحديث البيانات
  }

  // معالجة تأكيد حذف المهمة
  const handleConfirmDelete = () => {
    console.log("تم حذف المهمة:", selectedTask)
    // هنا يمكن إضافة منطق حذف البيانات
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
        </Dialog>
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="parent-tasks">مهام الأهل</TabsTrigger>
          <TabsTrigger value="child-tasks">مهام الأطفال</TabsTrigger>
        </TabsList>

        <TabsContent value="parent-tasks">
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
        </TabsContent>
      </Tabs>

      {/* نوافذ العرض والتعديل والحذف والتأكيد */}
      <TaskViewDialog
        task={selectedTask}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        onComplete={handleCompleteTask}
        onReject={handleRejectTask}
      />

      <TaskEditDialog
        task={selectedTask}
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

