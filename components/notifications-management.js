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
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

// أضف استيرادات النوافذ المنبثقة في بداية الملف (بعد الاستيرادات الحالية)
import { NotificationViewDialog } from "@/components/dialogs/notification-view-dialog"
import { NotificationEditDialog } from "@/components/dialogs/notification-edit-dialog"
import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog"

export function NotificationsManagement() {
  const [activeTab, setActiveTab] = useState("notifications")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddNotificationOpen, setIsAddNotificationOpen] = useState(false)
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false)

  // أضف حالة النوافذ المنبثقة في بداية الدالة NotificationsManagement بعد تعريف المتغيرات الحالية
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)

  // Mock data for demonstration
  const notificationsData = [
    {
      id: 1,
      title: "تحديث جديد في التطبيق",
      content: "تم إضافة ألعاب جديدة للأطفال",
      target: "الجميع",
      sentDate: "2023-06-10",
      status: "مرسل",
    },
    {
      id: 2,
      title: "نصائح للتعامل مع السكري",
      content: "مقال جديد عن كيفية التعامل مع ارتفاع السكر",
      target: "الأهل",
      sentDate: "2023-06-12",
      status: "مرسل",
    },
    {
      id: 3,
      title: "مسابقة جديدة",
      content: "شارك في مسابقة عسول واربح جوائز قيمة",
      target: "الأطفال",
      sentDate: "2023-06-15",
      status: "مجدول",
    },
  ]

  const remindersData = [
    {
      id: 1,
      title: "قياس السكر",
      description: "تذكير بقياس مستوى السكر",
      target: "الأهل",
      frequency: "يومي",
      time: "08:00",
      status: "نشط",
    },
    {
      id: 2,
      title: "جرعة الانسولين",
      description: "تذكير بأخذ جرعة الانسولين",
      target: "الأهل",
      frequency: "يومي",
      time: "12:00, 18:00",
      status: "نشط",
    },
    {
      id: 3,
      title: "موعد الطبيب",
      description: "تذكير بموعد الطبيب القادم",
      target: "الأهل",
      frequency: "مرة واحدة",
      time: "قبل الموعد بيوم",
      status: "نشط",
    },
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case "مرسل":
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">{status}</span>
      case "مجدول":
        return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">{status}</span>
      case "نشط":
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">{status}</span>
      case "غير نشط":
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">{status}</span>
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">{status}</span>
    }
  }

  // أضف الوظائف التالية قبل return
  // معالجة عرض الإشعار
  const handleViewNotification = (notification) => {
    setSelectedNotification(notification)
    setViewDialogOpen(true)
  }

  // معالجة تعديل الإشعار
  const handleEditNotification = (notification) => {
    setSelectedNotification(notification)
    setEditDialogOpen(true)
  }

  // معالجة حذف الإشعار
  const handleDeleteNotification = (notification) => {
    setSelectedNotification(notification)
    setDeleteDialogOpen(true)
  }

  // معالجة حفظ تعديلات الإشعار
  const handleSaveNotification = (updatedNotification) => {
    console.log("تم حفظ التعديلات:", updatedNotification)
    // هنا يمكن إضافة منطق تحديث البيانات
  }

  // معالجة تأكيد حذف الإشعار
  const handleConfirmDeleteNotification = () => {
    console.log("تم حذف الإشعار:", selectedNotification)
    // هنا يمكن إضافة منطق حذف البيانات
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h2 className="text-xl md:text-3xl font-bold">المنبهات والإشعارات</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          {activeTab === "notifications" && (
            <Dialog open={isAddNotificationOpen} onOpenChange={setIsAddNotificationOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#ffac33] hover:bg-[#f59f00] w-full sm:w-auto">
                  <Plus className="h-4 w-4 ml-2" />
                  <span className="hidden sm:inline">إضافة إشعار جديد</span>
                  <span className="sm:hidden">إضافة</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>إضافة إشعار جديد</DialogTitle>
                  <DialogDescription>أدخل بيانات الإشعار الجديد هنا. اضغط على حفظ عند الانتهاء.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">عنوان الإشعار</Label>
                    <Input id="title" placeholder="أدخل عنوان الإشعار" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">محتوى الإشعار</Label>
                    <Textarea id="content" placeholder="أدخل محتوى الإشعار" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target">الفئة المستهدفة</Label>
                    <Select>
                      <SelectTrigger id="target">
                        <SelectValue placeholder="اختر الفئة المستهدفة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">الجميع</SelectItem>
                        <SelectItem value="parents">الأهل</SelectItem>
                        <SelectItem value="children">الأطفال</SelectItem>
                        <SelectItem value="doctors">الأطباء</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule">جدولة الإشعار</Label>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox id="schedule" />
                      <Label htmlFor="schedule" className="text-sm font-normal">
                        إرسال الإشعار لاحقاً
                      </Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduleDate">تاريخ الإرسال</Label>
                    <Input id="scheduleDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduleTime">وقت الإرسال</Label>
                    <Input id="scheduleTime" type="time" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddNotificationOpen(false)}>
                    إلغاء
                  </Button>
                  <Button className="bg-[#ffac33] hover:bg-[#f59f00]" onClick={() => setIsAddNotificationOpen(false)}>
                    حفظ
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {activeTab === "reminders" && (
            <Dialog open={isAddReminderOpen} onOpenChange={setIsAddReminderOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#ffac33] hover:bg-[#f59f00] w-full sm:w-auto">
                  <Plus className="h-4 w-4 ml-2" />
                  <span className="hidden sm:inline">إضافة منبه جديد</span>
                  <span className="sm:hidden">إضافة</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>إضافة منبه جديد</DialogTitle>
                  <DialogDescription>أدخل بيانات المنبه الجديد هنا. اضغط على حفظ عند الانتهاء.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">عنوان المنبه</Label>
                    <Input id="title" placeholder="أدخل عنوان المنبه" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">وصف المنبه</Label>
                    <Textarea id="description" placeholder="أدخل وصف المنبه" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target">الفئة المستهدفة</Label>
                    <Select>
                      <SelectTrigger id="target">
                        <SelectValue placeholder="اختر الفئة المستهدفة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="parents">الأهل</SelectItem>
                        <SelectItem value="children">الأطفال</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">تكرار المنبه</Label>
                    <Select>
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="اختر تكرار المنبه" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">يومي</SelectItem>
                        <SelectItem value="weekly">أسبوعي</SelectItem>
                        <SelectItem value="monthly">شهري</SelectItem>
                        <SelectItem value="once">مرة واحدة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">وقت المنبه</Label>
                    <Input id="time" type="time" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddReminderOpen(false)}>
                    إلغاء
                  </Button>
                  <Button className="bg-[#ffac33] hover:bg-[#f59f00]" onClick={() => setIsAddReminderOpen(false)}>
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
            placeholder="بحث..."
            className="pr-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
          <TabsTrigger value="reminders">المنبهات</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>الإشعارات</CardTitle>
              <CardDescription>إدارة الإشعارات المرسلة للمستخدمين</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>عنوان الإشعار</TableHead>
                      <TableHead>المحتوى</TableHead>
                      <TableHead>الفئة المستهدفة</TableHead>
                      <TableHead>تاريخ الإرسال</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notificationsData.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell className="font-medium">{notification.title}</TableCell>
                        <TableCell>
                          {notification.content.length > 30
                            ? notification.content.substring(0, 30) + "..."
                            : notification.content}
                        </TableCell>
                        <TableCell>{notification.target}</TableCell>
                        <TableCell>{notification.sentDate}</TableCell>
                        <TableCell>{getStatusBadge(notification.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button variant="ghost" size="icon" onClick={() => handleViewNotification(notification)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {notification.status === "مجدول" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditNotification(notification)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteNotification(notification)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
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

        <TabsContent value="reminders">
          <Card>
            <CardHeader>
              <CardTitle>المنبهات</CardTitle>
              <CardDescription>إدارة المنبهات الدورية للمستخدمين</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>عنوان المنبه</TableHead>
                      <TableHead>الوصف</TableHead>
                      <TableHead>الفئة المستهدفة</TableHead>
                      <TableHead>التكرار</TableHead>
                      <TableHead>الوقت</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {remindersData.map((reminder) => (
                      <TableRow key={reminder.id}>
                        <TableCell className="font-medium">{reminder.title}</TableCell>
                        <TableCell>
                          {reminder.description.length > 30
                            ? reminder.description.substring(0, 30) + "..."
                            : reminder.description}
                        </TableCell>
                        <TableCell>{reminder.target}</TableCell>
                        <TableCell>{reminder.frequency}</TableCell>
                        <TableCell>{reminder.time}</TableCell>
                        <TableCell>{getStatusBadge(reminder.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button variant="ghost" size="icon" onClick={() => handleViewNotification(reminder)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditNotification(reminder)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteNotification(reminder)}>
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
      <NotificationViewDialog
        notification={selectedNotification}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />

      <NotificationEditDialog
        notification={selectedNotification}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveNotification}
      />

      <DeleteConfirmationDialog
        title={`حذف ${selectedNotification?.content ? "الإشعار" : "المنبه"}`}
        description={`هل أنت متأكد من حذف ${selectedNotification?.content ? "الإشعار" : "المنبه"} "${selectedNotification?.title}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDeleteNotification}
      />
    </div>
  )
}

