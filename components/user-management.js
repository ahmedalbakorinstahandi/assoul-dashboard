"use client"

import { SetStateAction, useState } from "react"
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

export function UserManagement() {
  const [activeTab, setActiveTab] = useState("parents")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)

  // حالة النوافذ
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

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
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
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
        <TabsList className="flex grid-cols-3">
          <TabsTrigger value="parents" className="flex-1">حسابات الأهل</TabsTrigger>
          <TabsTrigger value="doctors" className="flex-1">حسابات الأطباء</TabsTrigger>
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
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parentsData.map((parent) => (
                      <TableRow key={parent.id}>
                        <TableCell className="font-medium">{parent.name}</TableCell>
                        <TableCell>{parent.email}</TableCell>
                        <TableCell>{parent.phone}</TableCell>
                        <TableCell>{parent.childrenCount}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                            {parent.status}
                          </span>
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
                      <TableHead>العمر</TableHead>
                      <TableHead>ولي الأمر</TableHead>
                      <TableHead>نوع السكري</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {childrenData.map((child) => (
                      <TableRow key={child.id}>
                        <TableCell className="font-medium">{child.name}</TableCell>
                        <TableCell>{child.age}</TableCell>
                        <TableCell>{child.parent}</TableCell>
                        <TableCell>{child.diabetesType}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                            {child.status}
                          </span>
                        </TableCell>
                        <TableCell>
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

      {/* نوافذ العرض والتعديل والحذف */}
      <UserViewDialog user={selectedUser} open={viewDialogOpen} onOpenChange={setViewDialogOpen} />

      <UserEditDialog
        user={selectedUser}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveUser}
      />

      <DeleteConfirmationDialog
        title="حذف المستخدم"
        description={`هل أنت متأكد من حذف المستخدم "${selectedUser?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

