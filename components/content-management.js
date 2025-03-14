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
import { Plus, Search, Edit, Trash2, Eye, FileText, Video, Image } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// أضف استيرادات النوافذ المنبثقة في بداية الملف (بعد الاستيرادات الحالية)
import { ContentViewDialog } from "@/components/dialogs/content-view-dialog"
import { ContentEditDialog } from "@/components/dialogs/content-edit-dialog"
import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog"

export function ContentManagement() {
  const [activeTab, setActiveTab] = useState("articles")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddContentOpen, setIsAddContentOpen] = useState(false)

  // أضف حالة النوافذ المنبثقة في بداية الدالة ContentManagement بعد تعريف المتغيرات الحالية
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState(null)

  // Mock data for demonstration
  const articlesData = [
    {
      id: 1,
      title: "كيف تتعامل مع نوبات انخفاض السكر",
      category: "تعليمي",
      author: "د. فاطمة أحمد",
      publishDate: "2023-05-10",
      status: "منشور",
    },
    {
      id: 2,
      title: "الغذاء الصحي لمرضى السكري",
      category: "تغذية",
      author: "د. خالد عبدالله",
      publishDate: "2023-05-15",
      status: "منشور",
    },
    {
      id: 3,
      title: "الرياضة وتأثيرها على مستوى السكر",
      category: "رياضة",
      author: "د. فاطمة أحمد",
      publishDate: "2023-05-20",
      status: "مسودة",
    },
  ]

  const videosData = [
    {
      id: 1,
      title: "كيفية استخدام جهاز قياس السكر",
      category: "تعليمي",
      duration: "5:30",
      publishDate: "2023-05-12",
      status: "منشور",
    },
    {
      id: 2,
      title: "قصة عسول وأصدقاؤه",
      category: "ترفيهي",
      duration: "8:45",
      publishDate: "2023-05-18",
      status: "منشور",
    },
  ]

  const imagesData = [
    {
      id: 1,
      title: "رسم توضيحي لأنواع الطعام الصحي",
      category: "تغذية",
      dimensions: "1200x800",
      publishDate: "2023-05-14",
      status: "منشور",
    },
    {
      id: 2,
      title: "شخصية عسول",
      category: "شخصيات",
      dimensions: "800x800",
      publishDate: "2023-05-16",
      status: "منشور",
    },
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case "منشور":
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">{status}</span>
      case "مسودة":
        return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">{status}</span>
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">{status}</span>
    }
  }

  const getContentTypeIcon = () => {
    switch (activeTab) {
      case "articles":
        return <FileText className="h-4 w-4 ml-2" />
      case "videos":
        return <Video className="h-4 w-4 ml-2" />
      case "images":
        return <Image className="h-4 w-4 ml-2" />
      default:
        return <Plus className="h-4 w-4 ml-2" />
    }
  }

  const renderContentForm = () => {
    if (activeTab === "articles") {
      return (
        <>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان المقال</Label>
              <Input id="title" placeholder="أدخل عنوان المقال" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">محتوى المقال</Label>
              <Textarea id="content" placeholder="أدخل محتوى المقال" className="h-40" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">التصنيف</Label>
              <Select>
                <SelectTrigger id="category">
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="تعليمي">تعليمي</SelectItem>
                  <SelectItem value="تغذية">تغذية</SelectItem>
                  <SelectItem value="رياضة">رياضة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">الكاتب</Label>
              <Select>
                <SelectTrigger id="author">
                  <SelectValue placeholder="اختر الكاتب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="د. فاطمة أحمد">د. فاطمة أحمد</SelectItem>
                  <SelectItem value="د. خالد عبدالله">د. خالد عبدالله</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )
    } else if (activeTab === "videos") {
      return (
        <>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الفيديو</Label>
              <Input id="title" placeholder="أدخل عنوان الفيديو" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">وصف الفيديو</Label>
              <Textarea id="description" placeholder="أدخل وصف الفيديو" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video">ملف الفيديو</Label>
              <Input id="video" type="file" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">التصنيف</Label>
              <Select>
                <SelectTrigger id="category">
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="تعليمي">تعليمي</SelectItem>
                  <SelectItem value="ترفيهي">ترفيهي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )
    } else {
      return (
        <>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الصورة</Label>
              <Input id="title" placeholder="أدخل عنوان الصورة" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">وصف الصورة</Label>
              <Textarea id="description" placeholder="أدخل وصف الصورة" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">ملف الصورة</Label>
              <Input id="image" type="file" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">التصنيف</Label>
              <Select>
                <SelectTrigger id="category">
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="تغذية">تغذية</SelectItem>
                  <SelectItem value="شخصيات">شخصيات</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )
    }
  }

  // أضف الوظائف التالية قبل return
  // معالجة عرض المحتوى
  const handleViewContent = (content) => {
    setSelectedContent(content)
    setViewDialogOpen(true)
  }

  // معالجة تعديل المحتوى
  const handleEditContent = (content) => {
    setSelectedContent(content)
    setEditDialogOpen(true)
  }

  // معالجة حذف المحتوى
  const handleDeleteContent = (content) => {
    setSelectedContent(content)
    setDeleteDialogOpen(true)
  }

  // معالجة حفظ تعديلات المحتوى
  const handleSaveContent = (updatedContent) => {
    console.log("تم حفظ التعديلات:", updatedContent)
    // هنا يمكن إضافة منطق تحديث البيانات
  }

  // معالجة تأكيد حذف المحتوى
  const handleConfirmDeleteContent = () => {
    console.log("تم حذف المحتوى:", selectedContent)
    // هنا يمكن إضافة منطق حذف البيانات
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h2 className="text-xl md:text-3xl font-bold">إدارة المحتوى التعليمي</h2>
        <Dialog open={isAddContentOpen} onOpenChange={setIsAddContentOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#ffac33] hover:bg-[#f59f00] w-full sm:w-auto">
              {getContentTypeIcon()}
              <span className="hidden sm:inline">إضافة محتوى جديد</span>
              <span className="sm:hidden">إضافة</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>إضافة محتوى جديد</DialogTitle>
              <DialogDescription>أدخل بيانات المحتوى الجديد هنا. اضغط على حفظ عند الانتهاء.</DialogDescription>
            </DialogHeader>
            {renderContentForm()}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddContentOpen(false)}>
                إلغاء
              </Button>
              <Button className="bg-[#ffac33] hover:bg-[#f59f00]" onClick={() => setIsAddContentOpen(false)}>
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
            placeholder="بحث عن محتوى..."
            className="pr-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="articles">المقالات</TabsTrigger>
          <TabsTrigger value="videos">الفيديوهات</TabsTrigger>
          <TabsTrigger value="images">الصور</TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          <Card>
            <CardHeader>
              <CardTitle>المقالات</CardTitle>
              <CardDescription>إدارة المقالات التعليمية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>العنوان</TableHead>
                      <TableHead>التصنيف</TableHead>
                      <TableHead>الكاتب</TableHead>
                      <TableHead>تاريخ النشر</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articlesData.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium">{article.title}</TableCell>
                        <TableCell>{article.category}</TableCell>
                        <TableCell>{article.author}</TableCell>
                        <TableCell>{article.publishDate}</TableCell>
                        <TableCell>{getStatusBadge(article.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button variant="ghost" size="icon" onClick={() => handleViewContent(article)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditContent(article)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteContent(article)}>
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

        <TabsContent value="videos">
          <Card>
            <CardHeader>
              <CardTitle>الفيديوهات</CardTitle>
              <CardDescription>إدارة الفيديوهات التعليمية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>العنوان</TableHead>
                      <TableHead>التصنيف</TableHead>
                      <TableHead>المدة</TableHead>
                      <TableHead>تاريخ النشر</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {videosData.map((video) => (
                      <TableRow key={video.id}>
                        <TableCell className="font-medium">{video.title}</TableCell>
                        <TableCell>{video.category}</TableCell>
                        <TableCell>{video.duration}</TableCell>
                        <TableCell>{video.publishDate}</TableCell>
                        <TableCell>{getStatusBadge(video.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button variant="ghost" size="icon" onClick={() => handleViewContent(video)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditContent(video)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteContent(video)}>
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

        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>الصور</CardTitle>
              <CardDescription>إدارة الصور التعليمية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>العنوان</TableHead>
                      <TableHead>التصنيف</TableHead>
                      <TableHead>الأبعاد</TableHead>
                      <TableHead>تاريخ النشر</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {imagesData.map((image) => (
                      <TableRow key={image.id}>
                        <TableCell className="font-medium">{image.title}</TableCell>
                        <TableCell>{image.category}</TableCell>
                        <TableCell>{image.dimensions}</TableCell>
                        <TableCell>{image.publishDate}</TableCell>
                        <TableCell>{getStatusBadge(image.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button variant="ghost" size="icon" onClick={() => handleViewContent(image)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditContent(image)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteContent(image)}>
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
      <ContentViewDialog content={selectedContent} open={viewDialogOpen} onOpenChange={setViewDialogOpen} />

      <ContentEditDialog
        content={selectedContent}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveContent}
      />

      <DeleteConfirmationDialog
        title="حذف المحتوى"
        description={`هل أنت متأكد من حذف المحتوى "${selectedContent?.title}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDeleteContent}
      />
    </div>
  )
}

