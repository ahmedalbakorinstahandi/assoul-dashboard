"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Download } from "lucide-react"

interface SugarExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SugarExportDialog({ open, onOpenChange }: SugarExportDialogProps) {
  const [exportFormat, setExportFormat] = useState("pdf")
  const [dateRange, setDateRange] = useState("week")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedChild, setSelectedChild] = useState("all")
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeNotes, setIncludeNotes] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleExport = async () => {
    setIsLoading(true)
    try {
      // هنا يمكن إضافة طلب API لتصدير البيانات
      await new Promise((resolve) => setTimeout(resolve, 2000))
      onOpenChange(false)
      // يمكن إضافة إشعار نجاح هنا
    } catch (error) {
      console.error("Error exporting data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>تصدير قراءات السكر</DialogTitle>
          <DialogDescription>اختر خيارات تصدير قراءات السكر</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="format">صيغة التصدير</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger id="format">
                <SelectValue placeholder="اختر صيغة التصدير" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateRange">الفترة الزمنية</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger id="dateRange">
                <SelectValue placeholder="اختر الفترة الزمنية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">آخر أسبوع</SelectItem>
                <SelectItem value="month">آخر شهر</SelectItem>
                <SelectItem value="3months">آخر 3 أشهر</SelectItem>
                <SelectItem value="custom">فترة مخصصة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {dateRange === "custom" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">من تاريخ</Label>
                <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">إلى تاريخ</Label>
                <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="child">الطفل</Label>
            <Select value={selectedChild} onValueChange={setSelectedChild}>
              <SelectTrigger id="child">
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

          <div className="space-y-4">
            <Label>خيارات إضافية</Label>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="includeCharts"
                checked={includeCharts}
                onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
              />
              <Label htmlFor="includeCharts" className="text-sm font-normal">
                تضمين الرسوم البيانية
              </Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="includeNotes"
                checked={includeNotes}
                onCheckedChange={(checked) => setIncludeNotes(checked as boolean)}
              />
              <Label htmlFor="includeNotes" className="text-sm font-normal">
                تضمين الملاحظات
              </Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button className="bg-[#ffac33] hover:bg-[#f59f00]" onClick={handleExport} disabled={isLoading}>
            {isLoading ? (
              "جاري التصدير..."
            ) : (
              <>
                <Download className="h-4 w-4 ml-2" />
                تصدير
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

