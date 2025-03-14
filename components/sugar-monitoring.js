"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, FileText, AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SugarReadingViewDialog } from "@/components/dialogs/sugar-reading-view-dialog"
import { SugarExportDialog } from "@/components/dialogs/sugar-export-dialog"

export function SugarMonitoring() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedChild, setSelectedChild] = useState("all")

  // حالة النوافذ
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [selectedReading, setSelectedReading] = useState(null)

  // Mock data for demonstration
  const sugarReadingsData = [
    {
      id: 1,
      childName: "ياسر أحمد",
      parentName: "أحمد محمد",
      readingValue: 120,
      readingTime: "2023-06-15 08:30",
      status: "طبيعي",
    },
    {
      id: 2,
      childName: "ياسر أحمد",
      parentName: "أحمد محمد",
      readingValue: 180,
      readingTime: "2023-06-15 12:45",
      status: "مرتفع",
    },
    {
      id: 3,
      childName: "نورة أحمد",
      parentName: "أحمد محمد",
      readingValue: 95,
      readingTime: "2023-06-15 18:20",
      status: "منخفض",
    },
    {
      id: 4,
      childName: "عمر سارة",
      parentName: "سارة علي",
      readingValue: 110,
      readingTime: "2023-06-15 19:30",
      status: "طبيعي",
    },
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case "طبيعي":
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">{status}</span>
      case "مرتفع":
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">{status}</span>
      case "منخفض":
        return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">{status}</span>
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">{status}</span>
    }
  }

  const filteredData =
    selectedChild === "all"
      ? sugarReadingsData
      : sugarReadingsData.filter((reading) => reading.childName === selectedChild)

  // معالجة عرض قراءة السكر
  const handleViewReading = (reading) => {
    setSelectedReading(reading)
    setViewDialogOpen(true)
  }

  // معالجة تصدير قراءات السكر
  const handleExportReadings = () => {
    setExportDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h2 className="text-xl md:text-3xl font-bold">متابعة السكر</h2>
        <Button className="bg-[#ffac33] hover:bg-[#f59f00] w-full sm:w-auto" onClick={handleExportReadings}>
          <FileText className="h-4 w-4 ml-2" />
          تصدير التقرير
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">متوسط القراءات</CardTitle>
            <CardDescription>آخر 7 أيام</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">125 mg/dL</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">القراءات المرتفعة</CardTitle>
            <CardDescription>آخر 7 أيام</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">القراءات المنخفضة</CardTitle>
            <CardDescription>آخر 7 أيام</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">2</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="بحث..."
            className="pr-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-auto">
          <Select value={selectedChild} onValueChange={setSelectedChild}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="اختر الطفل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأطفال</SelectItem>
              <SelectItem value="ياسر أحمد">ياسر أحمد</SelectItem>
              <SelectItem value="نورة أحمد">نورة أحمد</SelectItem>
              <SelectItem value="عمر سارة">عمر سارة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قراءات السكر</CardTitle>
          <CardDescription>سجل قراءات السكر للأطفال</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم الطفل</TableHead>
                  <TableHead>ولي الأمر</TableHead>
                  <TableHead>القراءة (mg/dL)</TableHead>
                  <TableHead>وقت القراءة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((reading) => (
                  <TableRow key={reading.id}>
                    <TableCell className="font-medium">{reading.childName}</TableCell>
                    <TableCell>{reading.parentName}</TableCell>
                    <TableCell>{reading.readingValue}</TableCell>
                    <TableCell>{reading.readingTime}</TableCell>
                    <TableCell>{getStatusBadge(reading.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2 space-x-reverse">
                        <Button variant="ghost" size="icon" onClick={() => handleViewReading(reading)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {reading.status !== "طبيعي" && (
                          <Button variant="ghost" size="icon">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
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

      {/* نوافذ العرض والتصدير */}
      <SugarReadingViewDialog reading={selectedReading} open={viewDialogOpen} onOpenChange={setViewDialogOpen} />

      <SugarExportDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} />
    </div>
  )
}

