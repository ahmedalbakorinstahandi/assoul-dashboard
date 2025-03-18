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
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Edit, Eye, XCircle, Calendar, Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { deleteData, getData, postData, putData } from "@/lib/apiHelper"
import { AppointmentDialog } from "@/components/dialogs/appointments/appointments-dialog"
import { AppointmentCancelDialog } from "@/components/dialogs/appointments/appointments-cancel-dialog"

import toast from "react-hot-toast"
import { DeleteConfirmationDialog } from "./dialogs/delete-confirmation-dialog"

export function AppointmentsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isViewAppointmentOpen, setIsViewAppointmentOpen] = useState(false)
  const [isEditAppointmentOpen, setIsEditAppointmentOpen] = useState(false)
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false)
  const [isCancelAppointmentOpen, setIsCancelAppointmentOpen] = useState(false)
  const [isDeleteAppointmentOpen, setIsDeleteAppointmentOpen] = useState(false)


  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [gamesData, setGamesData] = useState([])
  const [gamesPage, setGamesPage] = useState(1);
  const [gamesMeta, setGamesMeta] = useState({});
  const [pageSize, setPageSize] = useState(10); // number of items per page
  const initialFilter = { patient_id: "", guardian_id: "", doctor_id: "" };
  const [filter, setFilter] = useState(initialFilter)
  const [loading, setLoading] = useState(false)
  const [gamesIds, setGamesId] = useState([]);
  const [levelsIds, setLevelsId] = useState([]);
  const [questionsIds, setQuestionsId] = useState([]);

  useEffect(() => {
    const fetchGamesId = async () => {
      const response = await getData(`users/children`);
      // console.log("ddd", response);

      setGamesId(response.data);
    };
    const fetchLevelId = async () => {
      const response = await getData(`users/guardians`);
      // console.log("ddd", response);

      setLevelsId(response.data);
    };
    const fetchQuestionId = async () => {
      const response = await getData(`users/doctors`);
      // console.log("ddd", response);

      setQuestionsId(response.data);
    };
    fetchLevelId()
    fetchQuestionId()
    fetchGamesId();
  }, [selectedAppointment]);


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
    // if (activeTab === "games") {
    fetchEntityData("schedules/appointments", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);
    console.log("gamesData", gamesData);


  }, [gamesPage, searchTerm, pageSize, filter]);
  // Mock data for demonstration

  const handleDeleteItem = (item) => {
    setSelectedAppointment(item)
    setIsDeleteAppointmentOpen(true)
  }
  const handleCancelItem = (item) => {
    setSelectedAppointment(item)
    setIsCancelAppointmentOpen(true)
  }
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">قيد الانتظار</span>
      case "completed":
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">مكتمل</span>
      case "cancelled":
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">ملغي</span>
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">موافق عليه</span>
    }
  }

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment)
    setIsViewAppointmentOpen(true)
  }
  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment)
    setIsEditAppointmentOpen(true)
  }

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
        setIsAddAppointmentOpen(false)
        fetchEntityData("schedules/appointments", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);

      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);


    }
  };


  const handleUpdateEntity = async (endpoint, updatedEntity) => {
    let response

    response = await putData(endpoint + `/${selectedAppointment.id}`, updatedEntity)


    console.log(response);

    if (response.success) {
      toast.success(response.message)
      setIsEditAppointmentOpen(false)

      fetchEntityData("schedules/appointments", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);

    } else {
      toast.error(response.message)
    }
  }
  const handleCancelEntity = async (endpoint, updatedEntity) => {
    let response

    response = await postData(endpoint, updatedEntity)


    console.log(response);

    if (response.success) {
      toast.success(response.message)
      setIsCancelAppointmentOpen(false)

      fetchEntityData("schedules/appointments", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);

    } else {
      toast.error(response.message)
    }
  }


  const handleDeleteEntity = async (endpoint, entityId) => {
    const response = await deleteData(endpoint, entityId)
    if (response.data.success) {
      toast.success(response.data.message)
      setIsDeleteAppointmentOpen(false)
      fetchEntityData("schedules/appointments", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);
    } else {
      toast.error(response.data.message)
    }
  }


  // معالجة تأكيد حذف المستخدم
  const handleConfirmDelete = () => {

    handleDeleteEntity("schedules/appointments", selectedAppointment?.id)
    // setDeleteDialogOpen(false)
  }
  const handleConfirmCancel = (updatedItem) => {

    handleCancelEntity(`schedules/appointments/${selectedAppointment.id}/cancel`, updatedItem)
  }

  const handleAddItem = (updatedItem) => {
    console.log(updatedItem);
    handleAddEntity("schedules/appointments", updatedItem)
  }
  const handleSaveItem = (updatedItem) => {
    console.log(updatedItem);
    handleUpdateEntity("schedules/appointments", updatedItem)
  }

  return (
    <div className="space-y-6">
      {/* تعديل عنوان الصفحة والأزرار */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h2 className="text-xl md:text-3xl font-bold">إدارة المواعيد</h2>

        <Button className="bg-[#ffac33] hover:bg-[#f59f00] w-full sm:w-auto" onClick={() => setIsAddAppointmentOpen(true)}>
          <Plus className="h-4 w-4 ml-2" />
          <span className="hidden sm:inline">إضافة موعد جديد</span>
          <span className="sm:hidden">إضافة</span>
        </Button>
      </div>

      {/* تعديل البطاقات لتكون متجاوبة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">المواعيد القادمة</CardTitle>
            <CardDescription>هذا الأسبوع</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">المواعيد المكتملة</CardTitle>
            <CardDescription>هذا الشهر</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">المواعيد الملغاة</CardTitle>
            <CardDescription>هذا الشهر</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">3</div>
          </CardContent>
        </Card>
      </div>

      {/* تعديل عناصر البحث والتصفية */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="بحث عن موعد..."
            className="pr-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-2 " style={{ width: "10rem" }}>
          {/* <Label htmlFor="game">اللعبة</Label> */}
          <Select name="doctor_id"
            value={filter.doctor_id}

            onValueChange={(value) => setFilter((prev) => ({
              ...prev,
              doctor_id: prev.doctor_id == value ? "" : value,
            }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر الطبيب" />
            </SelectTrigger>
            <SelectContent>
              {questionsIds.map((game, idx) => (
                <SelectItem key={idx} value={game.id.toString()}>
                  {game.user.first_name + " " + game.user.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 " style={{ width: "10rem" }}>
          {/* <Label htmlFor="game">اللعبة</Label> */}
          <Select name="guardian_id"
            value={filter.guardian_id}

            onValueChange={(value) => setFilter((prev) => ({
              ...prev,
              guardian_id: prev.guardian_id == value ? "" : value,
            }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر ولي الامر" />
            </SelectTrigger>
            <SelectContent>
              {levelsIds.map((game, idx) => (
                <SelectItem key={idx} value={game.id.toString()}>
                  {game.user.first_name + " " + game.user.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 " style={{ width: "10rem" }}>
          {/* <Label htmlFor="game">اللعبة</Label> */}
          <Select name="patient_id"
            value={filter.patient_id}

            onValueChange={(value) => setFilter((prev) => ({
              ...prev,
              patient_id: prev.patient_id == value ? "" : value,
            }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر الطفل" />
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

        <div className="w-full sm:w-auto">
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="حالة الموعد" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المواعيد</SelectItem>
              <SelectItem value="upcoming">المواعيد القادمة</SelectItem>
              <SelectItem value="completed">المواعيد المكتملة</SelectItem>
              <SelectItem value="cancelled">المواعيد الملغاة</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={() => setFilter(initialFilter)}>
          مسح الكل
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>المواعيد</CardTitle>
          <CardDescription>إدارة مواعيد الأطفال مع الأطباء</CardDescription>
        </CardHeader>
        <CardContent>
          {/* تعديل الجدول ليكون متجاوباً */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-nowrap">اسم الطفل</TableHead>
                  <TableHead className="text-nowrap">ولي الأمر</TableHead>
                  <TableHead>الطبيب</TableHead>
                  <TableHead className="text-nowrap"> التاريخ والوقت</TableHead>
                  <TableHead>العنوان</TableHead>

                  <TableHead>الوصف</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gamesData.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium text-nowrap">{appointment.patient?.user?.first_name + " " + appointment.patient?.user?.last_name}</TableCell>
                    <TableCell className="text-nowrap">{appointment.guardian?.user?.first_name + " " + appointment.guardian?.user?.last_name}</TableCell>
                    <TableCell className="text-nowrap">{appointment.doctor?.user?.first_name + " " + appointment.doctor?.user?.last_name}</TableCell>
                    <TableCell className="text-nowrap">{handleConvertDate(appointment.appointment_date)}</TableCell>
                    <TableCell>{appointment.title}</TableCell>
                    <TableCell>{appointment.notes}</TableCell>

                    <TableCell className="text-nowrap">{getStatusBadge(appointment.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2 space-x-reverse">
                        <Button variant="ghost" size="icon" onClick={() => handleViewAppointment(appointment)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(appointment)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {appointment.status === "pending" && (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => handleEditAppointment(appointment)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleCancelItem(appointment)} >
                              <XCircle className="h-4 w-4 text-red-500" />
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

      {selectedAppointment && (
        <Dialog open={isViewAppointmentOpen} onOpenChange={setIsViewAppointmentOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>تفاصيل الموعد</DialogTitle>
              <DialogDescription>معلومات تفصيلية عن الموعد</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">اسم الطفل</Label>
                  <p className="font-medium">{selectedAppointment.patient?.user?.first_name + " " + selectedAppointment.patient?.user?.last_name}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">ولي الأمر</Label>
                  <p className="font-medium">{selectedAppointment.guardian?.user?.first_name + " " + selectedAppointment.guardian?.user?.last_name}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">الطبيب</Label>
                  <p className="font-medium">{selectedAppointment.doctor?.user?.first_name + " " + selectedAppointment.doctor?.user?.last_name}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">الحالة</Label>
                  <p className="font-medium">{getStatusBadge(selectedAppointment.status)}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">التاريخ والوقت</Label>
                  <p className="font-medium">{handleConvertDate(selectedAppointment.appointment_date)}</p>
                </div>
                {/* <div>
                  <Label className="text-sm text-gray-500">الوقت</Label>
                  <p className="font-medium">{selectedAppointment.time}</p>
                </div> */}
              </div>
              <div>
                <Label className="text-sm text-gray-500">ملاحظات</Label>
                <p className="text-sm">
                  {selectedAppointment.title}

                </p>
              </div>
              {selectedAppointment.status === "cancelled" && <>
                <div>
                  <Label className="text-sm text-gray-500">سبب الالغاء</Label>
                  <p className="text-sm">
                    {selectedAppointment.cancel_reason}

                  </p>
                </div>
              </>}
            </div>
            <DialogFooter>
              {selectedAppointment.status === "pending" && (
                <>
                  <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                    إلغاء الموعد
                  </Button>
                  <Button className="bg-[#ffac33] hover:bg-[#f59f00]">تعديل الموعد</Button>
                </>
              )}
              {/* {selectedAppointment.status === "completed" && (
                <Button className="bg-[#ffac33] hover:bg-[#f59f00]">عرض التقرير</Button>
              )} */}
              <Button variant="outline" onClick={() => setIsViewAppointmentOpen(false)}>
                إغلاق
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}


      <AppointmentDialog
        isOpen={isAddAppointmentOpen}
        onClose={() => setIsAddAppointmentOpen(false)}
        onSave={handleAddItem}
        children={gamesIds}
        guardian={levelsIds}
        doctors={questionsIds}

      // initialData={selectedItem}
      />

      <AppointmentDialog
        isOpen={isEditAppointmentOpen}
        onClose={() => setIsEditAppointmentOpen(false)}
        children={gamesIds}
        guardian={levelsIds}
        doctors={questionsIds}
        onSave={handleSaveItem}
        initialData={selectedAppointment}
      />
      <AppointmentCancelDialog
        isOpen={isCancelAppointmentOpen}
        onClose={() => setIsCancelAppointmentOpen(false)}

        onSave={handleConfirmCancel}
        initialData={selectedAppointment}
      />
      <DeleteConfirmationDialog
        title="حذف العنصر"
        description={`هل أنت متأكد من حذف العنصر ؟ هذا الإجراء لا يمكن التراجع عنه.`}
        open={isDeleteAppointmentOpen}
        onOpenChange={setIsDeleteAppointmentOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

