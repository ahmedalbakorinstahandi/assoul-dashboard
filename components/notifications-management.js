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
import { ReminderViewDialog } from "@/components/dialogs/notifications/scheduled-notifications/reminder-view-dialog"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Edit, Trash2, Eye, PencilIcon, TrashIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { deleteData, getData, postData, putData } from "@/lib/apiHelper"
import { ScheduledNotificationsDialog } from "@/components/dialogs/notifications/scheduled-notifications/scheduled-notifications-dialog"
import toast from "react-hot-toast"
import { DeleteConfirmationDialog } from "./dialogs/delete-confirmation-dialog"
import { PaginationControls } from "./ui/pagination-controls"
// استيراد النوافذ المنبثقة من المجلدات الجديدة
import { NotificationViewDialog } from "@/components/dialogs/notifications/notifications/notifications-view-dialog"
// import { NotificationEditDialog } from "@/components/dialogs/notifications/notification-edit-dialog"
// import { DeleteConfirmationDialog } from "@/components/dialogs/common/delete-confirmation-dialog"

export function NotificationsManagement() {
  const [activeTab, setActiveTab] = useState("notifications")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddNotificationOpen, setIsAddNotificationOpen] = useState(false)

  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false)
  const [isEditReminderOpen, setIsEditReminderOpen] = useState(false)

  const [isEditNotificationOpen, setIsEditNotificationOpen] = useState(false)

  const initialFilter = { game_id: "", level_id: "", question_id: "" };
  const [filter, setFilter] = useState(initialFilter)

  const [gamesData, setGamesData] = useState([])
  const [levelsData, setLevelsData] = useState([])

  const [pageSize, setPageSize] = useState(50); // number of items per page

  const [gamesPage, setGamesPage] = useState(1);
  const [levelsPage, setLevelsPage] = useState(1);


  const [gamesMeta, setGamesMeta] = useState({});
  const [levelsMeta, setLevelsMeta] = useState({});

  const [gamesIds, setGamesId] = useState([]);
  const [levelsIds, setLevelsId] = useState([]);
  const [questionsIds, setQuestionsId] = useState([]);
  const [loading, setLoading] = useState(false)
  const handleConvertDate = (dateaa) => {
    const date = new Date(dateaa);
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",

    }).format(date);

    const formattedTime = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",

      hour12: true,
    }).format(date);

    return (
      <span>
        {formattedDate.replace(/\//g, " \\ ")} •{" "}
        {formattedTime.toLowerCase()}
      </span>
    );
  }
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
    if (activeTab === "notifications") {
      fetchEntityData("notifications/notifications", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);
    } else if (activeTab === "reminders") {
      fetchEntityData("notifications/scheduled-notifications", setLevelsData, setLevelsMeta, levelsPage, searchTerm, filter);
    }
  }, [activeTab, gamesPage, levelsPage, searchTerm, pageSize, filter]);

  const handleAddEntity = async (endpoint, newEntity, file = null) => {
    let dataToSend = { ...newEntity }; // نسخ البيانات إلى كائن جديد
    try {


      console.log("Sending Data:", dataToSend);

      // إرسال البيانات كـ JSON
      const response = await postData(endpoint, dataToSend, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log(response);
      if (response.success) {
        toast.success(response.message);

        // تحديث البيانات حسب نوع الكيان المضاف
        if (endpoint.includes("notifications")) {
          setIsAddNotificationOpen(false);

          fetchEntityData("notifications/notifications", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);
        }
        if (endpoint.includes("scheduled-notifications")) {


          setIsAddReminderOpen(false);
          // console.log("ssddssdds");

          fetchEntityData("notifications/scheduled-notifications", setLevelsData, setLevelsMeta, levelsPage, searchTerm, filter);
        };

      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);

    }
  };

  const handleAddItem = (updatedItem) => {
    console.log(updatedItem);

    let endpoint = ""
    if (activeTab === "notifications") endpoint = "notifications/notifications"
    if (activeTab === "reminders") endpoint = "notifications/scheduled-notifications"
    handleAddEntity(endpoint, updatedItem)
  }


  const handleUpdateEntity = async (endpoint, updatedEntity) => {
    console.log("Sending Data:", updatedEntity);

    const response = await putData(endpoint + `/${selectedNotification.id}`, updatedEntity)
    console.log(response);

    if (response.success) {
      toast.success(response.message)
      if (endpoint.includes("notifications")) {
        setIsEditNotificationOpen(false);

        fetchEntityData("notifications/notifications", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);
      }
      if (endpoint.includes("scheduled-notifications")) {


        setIsEditReminderOpen(false);

        fetchEntityData("notifications/scheduled-notifications", setLevelsData, setLevelsMeta, levelsPage, searchTerm, filter);
      };

    } else {
      toast.error(response.message)
    }
  }


  const handleDeleteEntity = async (endpoint, entityId) => {
    const response = await deleteData(endpoint, entityId)
    if (response.data.success) {
      toast.success(response.data.message)
      if (endpoint.includes("notifications")) {
        // setIsEditNotificationOpen(false);

        fetchEntityData("notifications/notifications", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);
      }
      if (endpoint.includes("scheduled-notifications")) {


        // setIsEditReminderOpen(false);

        fetchEntityData("notifications/scheduled-notifications", setLevelsData, setLevelsMeta, levelsPage, searchTerm, filter);
      };


    } else {
      toast.error(response.data.message)
    }
  }
  const handleConfirmDelete = () => {
    let endpoint = ""
    if (activeTab === "notifications") endpoint = "notifications/notifications"
    if (activeTab === "reminders") endpoint = "notifications/scheduled-notifications"

    handleDeleteEntity(endpoint, selectedNotification?.id)
    setDeleteDialogOpen(false)
  }


  const handleSaveItem = (updatedItem) => {
    let endpoint = ""
    if (activeTab === "notifications") endpoint = "notifications/notifications"
    if (activeTab === "reminders") endpoint = "notifications/scheduled-notifications"

    handleUpdateEntity(endpoint, updatedItem)
  }



  // حالة النوافذ المنبثقة
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [viewReminderDialogOpen, setViewReminderDialogOpen] = useState(false)
  const [viewNotificationDialogOpen, setViewNotificationDialogOpen] = useState(false)

  const [selectedNotification, setSelectedNotification] = useState(null)
  const handleViewReminder = (reminder) => {
    setSelectedNotification(reminder);
    setViewReminderDialogOpen(true);
  };
  const handleViewNotification = (reminder) => {
    setSelectedNotification(reminder);
    setViewNotificationDialogOpen(true);
  };



  // معالجة تعديل الإشعار
  const handleEditNotification = (notification) => {
    setSelectedNotification(notification)
    setEditDialogOpen(true)
  }
  const handleEditReminders = (notification) => {
    setSelectedNotification(notification)
    setIsEditReminderOpen(true)
  }
  const handleDeleteReminders = (item) => {
    setSelectedNotification(item);
    setDeleteDialogOpen(true);
  };
  // معالجة حذف الإشعار
  const handleDeleteNotification = (item) => {
    setSelectedNotification(item);
    setDeleteDialogOpen(true);
  };



  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h2 className="text-xl md:text-3xl font-bold">المنبهات والإشعارات</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          {activeTab === "notiwwfications" && (
            <Dialog open={isAddNotificationOpen} onOpenChange={setIsAddNotificationOpen}>
              <DialogTrigger asChild>

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

          {activeTab === "notifications" && (
            <Button className="bg-[#ffac33] hover:bg-[#f59f00] w-full sm:w-auto" onClick={() => setIsAddNotificationOpen(true)}>
              <Plus className="h-4 w-4 ml-2" />
              <span className="hidden sm:inline">إضافة إشعار جديد</span>
              <span className="sm:hidden">إضافة</span>
            </Button>
          )}

          {activeTab === "reminders" && (
            <Button className="bg-[#ffac33] hover:bg-[#f59f00] w-full sm:w-auto" onClick={() => setIsAddReminderOpen(true)}>
              <Plus className="h-4 w-4 ml-2" />
              <span className="hidden sm:inline">إضافة منبه جديد</span>
              <span className="sm:hidden">إضافة</span>
            </Button>
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
                      <TableHead>الرسالة</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>تاريخ القراءة</TableHead>
                      <TableHead>تاريخ الإنشاء</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gamesData.map((notification) => (
                      <TableRow key={notification.id} className="hover:bg-muted/50">
                        <TableCell className="p-2 text-right text-nowrap">{notification.title}</TableCell>
                        <TableCell className="p-2 text-right text-nowrap">
                          {notification.message && notification.message.length > 30
                            ? notification.message.substring(0, 30) + "..."
                            : notification.message}
                        </TableCell>
                        <TableCell className="p-2 text-right">
                          <Badge variant={
                            notification.type === "info" ? "default" :
                              notification.type === "success" ? "success" :
                                notification.type === "warning" ? "warning" :
                                  notification.type === "error" ? "destructive" : notification.type === "alert" ? "destructive" : "default"

                          }>
                            {notification.type === "info" ? "معلومات" :
                              notification.type === "success" ? "نجاح" :
                                notification.type === "warning" ? "تحذير" :
                                  notification.type === "error" ? "خطأ" : notification.type === "alert" ? "انذار" : notification.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="p-2 text-right text-nowrap">
                          {notification.read_at ? new Date(notification.read_at).toLocaleString("EN-ca") : "لم تتم القراءة"}
                        </TableCell>
                        <TableCell className="p-2 text-right text-nowrap">
                          {new Date(notification.created_at).toLocaleString("EN-ca")}
                        </TableCell>
                        <TableCell className="p-2">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleViewNotification(notification)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteNotification(notification)}>
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
                      <TableHead className="text-nowrap">عنوان المنبه</TableHead>
                      <TableHead>المحتوى</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>اليوم/الشهر</TableHead>
                      <TableHead>الوقت</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {levelsData.map((reminder) => (
                      <TableRow key={reminder.id} className="hover:bg-muted/50">
                        <TableCell className="p-2 text-right text-nowrap">{reminder.title}</TableCell>
                        <TableCell className="p-2 text-right text-nowrap">
                          {reminder.content && reminder.content.length > 30
                            ? reminder.content.substring(0, 30) + "..."
                            : reminder.content}
                        </TableCell>
                        <TableCell className="p-2 text-right text-nowrap">
                          {reminder.type === 'yearly' ? 'سنوي' :
                            reminder.type === 'monthly' ? 'شهري' :
                              reminder.type === 'weekly' ? 'أسبوعي' :
                                reminder.type === 'daily' ? 'يومي' : reminder.type}
                        </TableCell>
                        <TableCell className="p-2 text-right text-nowrap">
                          {reminder.type === 'yearly' || reminder.type === 'monthly' ? `الشهر ${reminder.month}` : ''}
                          {reminder.type === 'weekly' ? `الأسبوع ${reminder.week}` : ''}
                          {reminder.day ? `  اليوم ${reminder.day}` : ''}
                        </TableCell>
                        <TableCell className="p-2 text-right text-nowrap">{handleConvertDate(reminder.time)}</TableCell>
                        <TableCell className="p-2 text-right text-nowrap">
                          <Badge variant={reminder.status === 'active' ? 'success' : 'destructive'}>
                            {reminder.status === 'active' ? 'نشط' : 'غير نشط'}
                          </Badge>
                        </TableCell>
                        <TableCell className="p-2">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleViewReminder(reminder)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditReminders(reminder)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteReminders(reminder)}>
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
                currentPage={levelsPage}
                setPage={setLevelsPage}
                totalItems={levelsMeta.total}
                pageSize={pageSize}
                setPageSize={setPageSize}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <ScheduledNotificationsDialog
        initialData={selectedNotification}
        isOpen={isAddReminderOpen}
        onClose={() => setIsAddReminderOpen(false)}
        onSave={handleAddItem}

      />
      <ScheduledNotificationsDialog
        initialData={selectedNotification}
        isOpen={isEditReminderOpen}
        onClose={() => {
          setSelectedNotification(null)
          setIsEditReminderOpen(false)
        }}
        onSave={handleSaveItem}

      />
      <ReminderViewDialog
        reminder={selectedNotification}
        open={viewReminderDialogOpen}
        onOpenChange={setViewReminderDialogOpen}
      />

      <NotificationViewDialog
        notification={selectedNotification}
        open={viewNotificationDialogOpen}
        onOpenChange={setViewNotificationDialogOpen}
      />
      <DeleteConfirmationDialog
        title={`حذف ${selectedNotification?.message ? "الإشعار" : "المنبه"}`}
        description={`هل أنت متأكد من حذف ${selectedNotification?.message ? "الإشعار" : "المنبه"} "${selectedNotification?.title}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />

    </div>
  )
}
