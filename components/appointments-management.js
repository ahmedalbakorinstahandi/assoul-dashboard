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
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Edit, Eye, XCircle, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AppointmentsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isViewAppointmentOpen, setIsViewAppointmentOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  // Mock data for demonstration
  const appointmentsData = [
    {
      id: 1,
      childName: "ياسر أحمد",
      parentName: "أحمد محمد",
      doctorName: "د. فاطمة أحمد",
      date: "2023-06-20",
      time: "10:00",
      status: "قادم",
    },
    {
      id: 2,
      childName: "نورة أحمد",
      parentName: "أحمد محمد",
      doctorName: "د. خالد عبدالله",
      date: "2023-06-22",
      time: "11:30",
      status: "قادم",
    },
    {
      id: 3,
      childName: "عمر سارة",
      parentName: "سارة علي",
      doctorName: "د. فاطمة أحمد",
      date: "2023-06-15",
      time: "09:00",
      status: "مكتمل",
    },
    {
      id: 4,
      childName: "ياسر أحمد",
      parentName: "أحمد محمد",
      doctorName: "د. خالد عبدالله",
      date: "2023-06-10",
      time: "14:00",
      status: "ملغي",
    },
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case "قادم":
        return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">{status}</span>
      case "مكتمل":
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">{status}</span>
      case "ملغي":
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">{status}</span>
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">{status}</span>
    }
  }

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment)
    setIsViewAppointmentOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* تعديل عنوان الصفحة والأزرار */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h2 className="text-xl md:text-3xl font-bold">إدارة المواعيد</h2>
        {/* <Button className="bg-[#ffac33] hover:bg-[#f59f00] w-full sm:w-auto">
          <Calendar className="h-4 w-4 ml-2" />
          عرض التقويم
        </Button> */}
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
                  <TableHead>اسم الطفل</TableHead>
                  <TableHead>ولي الأمر</TableHead>
                  <TableHead>الطبيب</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الوقت</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointmentsData.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{appointment.childName}</TableCell>
                    <TableCell>{appointment.parentName}</TableCell>
                    <TableCell>{appointment.doctorName}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2 space-x-reverse">
                        <Button variant="ghost" size="icon" onClick={() => handleViewAppointment(appointment)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {appointment.status === "قادم" && (
                          <>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
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
                  <p className="font-medium">{selectedAppointment.childName}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">ولي الأمر</Label>
                  <p className="font-medium">{selectedAppointment.parentName}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">الطبيب</Label>
                  <p className="font-medium">{selectedAppointment.doctorName}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">الحالة</Label>
                  <p className="font-medium">{getStatusBadge(selectedAppointment.status)}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">التاريخ</Label>
                  <p className="font-medium">{selectedAppointment.date}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">الوقت</Label>
                  <p className="font-medium">{selectedAppointment.time}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-500">ملاحظات</Label>
                <p className="text-sm">
                  {selectedAppointment.status === "قادم"
                    ? "موعد متابعة دورية لحالة السكري."
                    : selectedAppointment.status === "مكتمل"
                      ? "تمت المتابعة وتحديث خطة العلاج."
                      : "تم إلغاء الموعد من قبل ولي الأمر."}
                </p>
              </div>
            </div>
            <DialogFooter>
              {selectedAppointment.status === "قادم" && (
                <>
                  <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                    إلغاء الموعد
                  </Button>
                  <Button className="bg-[#ffac33] hover:bg-[#f59f00]">تعديل الموعد</Button>
                </>
              )}
              {selectedAppointment.status === "مكتمل" && (
                <Button className="bg-[#ffac33] hover:bg-[#f59f00]">عرض التقرير</Button>
              )}
              <Button variant="outline" onClick={() => setIsViewAppointmentOpen(false)}>
                إغلاق
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

