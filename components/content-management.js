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
import { Plus, Search, Edit, Trash2, Eye, FileText, Video, Image, ExternalLink } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// أضف استيرادات النوافذ المنبثقة في بداية الملف (بعد الاستيرادات الحالية)
import { ContentViewDialog } from "@/components/dialogs/content-view-dialog"
import { ContentEditDialog } from "@/components/dialogs/content/video-edit-dialog"
import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog"
import { deleteData, getData, postData, putData } from "@/lib/apiHelper"
import toast from "react-hot-toast"
import { Switch } from "./ui/switch"
import { PaginationControls } from "./ui/pagination-controls"

export function ContentManagement() {
  const [activeTab, setActiveTab] = useState("videos")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddContentOpen, setIsAddContentOpen] = useState(false)
  const initialFilter = { game_id: "", level_id: "", question_id: "" };
  const [filter, setFilter] = useState(initialFilter)
  const [isEnabled, setIsEnabled] = useState(true);
  const [link, setLink] = useState("");

  // أضف حالة النوافذ المنبثقة في بداية الدالة ContentManagement بعد تعريف المتغيرات الحالية
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState(null)
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [questionsIds, setQuestionsId] = useState([]);
  const keys = [
    { id: 1, name: "physical_activity" },
    { id: 2, name: "meal" },
    { id: 3, name: "blood_sugar_reading" },
    { id: 4, name: "insulin_dose" },

  ]
  useEffect(() => {

    const fetchQuestionId = async () => {
      const response = await getData(`games/questions`);
      // console.log("ddd", response);

      setQuestionsId(response.data);
    };
    fetchQuestionId()
  }, [selectedQuestionId]);


  const [contentData, setContentData] = useState([])
  const [loading, setLoading] = useState(false)

  const [pageSize, setPageSize] = useState(50); // number of items per page

  const [contentPage, setContentPage] = useState(1);

  const [contentMeta, setContentMeta] = useState({});
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
    if (activeTab === "videos") {
      fetchEntityData("general/educational-contents", setContentData, setContentMeta, contentPage, searchTerm, filter);
    }
  }, [activeTab, contentPage, searchTerm, pageSize, filter]);

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
      if (endpoint.includes("educational-contents")) {
        setIsEnabled(true)
        setIsAddContentOpen(false);
        // setImagePreview(null);

        fetchEntityData("general/educational-contents", setContentData, setContentMeta, contentPage, searchTerm, filter);
      }

    } else {
      toast.error(response.message);
    }
  };



  const getStatusBadge = (status) => {
    switch (status) {
      case true:
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">منشور</span>
      case false:
        return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">مسودة</span>
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">{status}</span>
    }
  }

  // استخراج ID الفيديو من رابط YouTube
  const getYouTubeEmbedUrl = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([^?&]+)/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
  };

  // استخراج ID الفيديو من رابط Vimeo
  const getVimeoEmbedUrl = (url) => {
    const regex = /vimeo\.com\/(\d+)/;
    const match = url.match(regex);
    return match ? `https://player.vimeo.com/video/${match[1]}` : "";
  };

  // تحديد رابط المعاينة بناءً على نوع الفيديو
  const embedUrl = getYouTubeEmbedUrl(link) || getVimeoEmbedUrl(link);

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
  const handleUpdateEntity = async (endpoint, updatedEntity) => {
    console.log("Sending Data:", updatedEntity);

    const response = await putData(endpoint + `/${selectedContent.id}`, updatedEntity)
    console.log(response);

    if (response.success) {
      toast.success(response.message)
      setEditDialogOpen(false)
      fetchEntityData("general/educational-contents", setContentData, setContentMeta, contentPage, searchTerm, filter);
    } else {
      toast.error(response.message)
    }
  }

  // معالجة حفظ تعديلات المحتوى
  const handleSaveContent = (updatedContent) => {
    handleUpdateEntity("general/educational-contents", updatedContent)

  }

  const handleDeleteEntity = async (endpoint, entityId) => {
    const response = await deleteData(endpoint, entityId)
    if (response.data.success) {
      toast.success(response.data.message)
      setDeleteDialogOpen(false)
      fetchEntityData("general/educational-contents", setContentData, setContentMeta, contentPage, searchTerm, filter);


    } else {
      toast.error(response.data.message)
    }
  }
  // معالجة تأكيد حذف المحتوى
  const handleConfirmDeleteContent = () => {
    console.log("تم حذف المحتوى:", selectedContent)
    handleDeleteEntity("general/educational-contents", selectedContent?.id)

  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-3xl font-bold">إدارة المحتوى التعليمي</h2>
        <div className="">
          {activeTab === "videos" && (
            <Dialog open={isAddContentOpen} onOpenChange={setIsAddContentOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#ffac33] hover:bg-[#f59f00] w-full sm:w-auto">
                  <Plus className="h-4 w-4 ml-2" />
                  <span className="hidden sm:inline">إضافة محتوى جديد</span>
                  <span className="sm:hidden">إضافة</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>إضافة محتوى جديد</DialogTitle>
                  <DialogDescription>أدخل بيانات المحتوى الجديد هنا. اضغط على حفظ عند الانتهاء.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">

                  <div className="space-y-2">
                    <Label htmlFor="title">عنوان الفديو </Label>
                    <Input id="title" placeholder="أدخل عنوان الفديو" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link">رابط الفديو </Label>
                    <Input id="link" onChange={(e) => setLink(e.target.value)}
                      placeholder="أدخل رابط الفديو" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">مدة الفديو </Label>
                    <Input typeof="number" min={0} id="duration" placeholder="أدخل مدة الفديو" type="number" />

                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_visible">قابلية الظهور</Label>
                    <div className="flex align-middle justify-center">
                      <span className="mx-2">{isEnabled ? "منشور" : "مسودة"}</span>
                      <Switch id="is_visible" color="primary" checked={isEnabled} onCheckedChange={setIsEnabled} />
                    </div>
                  </div>
                  {/* معاينة الفيديو داخل iframe إذا كان الرابط صحيحًا */}
                  {embedUrl && (
                    <div className="mt-4">
                      <p className="mb-4">📽️ معاينة الفيديو:</p>
                      <iframe
                        width="100%"
                        height="315"
                        src={embedUrl}
                        title="معاينة الفيديو"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>)}


                </div>
                <DialogFooter>
                  <Button style={{ marginInline: "1rem" }} variant="outline" onClick={() => setIsAddContentOpen(false)}>
                    إلغاء
                  </Button>
                  <Button
                    className="bg-[#ffac33] mx-4 hover:bg-[#f59f00]"
                    onClick={() => {
                      const newGame = {
                        title: typeof document !== 'undefined' && document.getElementById("title").value,
                        link:typeof document !== 'undefined' &&  document.getElementById("link").value,
                        duration:typeof document !== 'undefined' &&  document.getElementById("duration").value,
                        key: selectedQuestionId,

                        // question_id: selectedQuestionId,
                        is_visible: isEnabled ? 1 : 0, // تحويل الحالة إلى 1 أو 0

                      };

                      // const imageFile = document.getElementById("image").files[0]; // جلب الصورة

                      handleAddEntity("general/educational-contents", newGame);
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

      <div className="flex flex-col mb-4 sm:flex-row items-start sm:items-center gap-2 sm:space-x-2 sm:space-x-reverse">
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
        <TabsList className="flex w-full grid-cols-3">
          {/* <TabsTrigger value="articles">المقالات</TabsTrigger> */}
          <TabsTrigger value="videos" className="flex-1">الفيديوهات</TabsTrigger>
          {/* <TabsTrigger value="images">الصور</TabsTrigger> */}
        </TabsList>

        {/* <TabsContent value="articles">
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
                          <div className="flex space-x-2 space-x-reverse justify-center">
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
        </TabsContent> */}

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
                      <TableHead>الرابط</TableHead>
                      <TableHead>المدة</TableHead>
                      <TableHead>تاريخ النشر</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contentData.map((video) => (
                      <TableRow key={video.id}>
                        <TableCell className="font-medium text-nowrap">{video.title}</TableCell>
                        <TableCell>
                          <a href={video.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-500 hover:underline">
                            {video.link.slice(0, 30)}...
                            <ExternalLink size={18} />
                          </a>
                        </TableCell>
                        <TableCell className="text-nowrap">{video.duration} دقيقة</TableCell>
                        <TableCell className="text-nowrap">{new Date(video.created_at).toLocaleDateString("EN-ca")}</TableCell>
                        <TableCell>{getStatusBadge(video.is_visible)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse justify-center">
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
              <PaginationControls
                currentPage={contentPage}
                setPage={setContentPage}
                totalItems={contentMeta.total}
                pageSize={pageSize}
                setPageSize={setPageSize}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="images">
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
                          <div className="flex space-x-2 space-x-reverse justify-center">
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
        </TabsContent> */}
      </Tabs>
      {/* نوافذ العرض والتعديل والحذف */}
      <ContentViewDialog content={selectedContent} open={viewDialogOpen} onOpenChange={setViewDialogOpen} />

      <ContentEditDialog
        game={selectedContent}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveContent}
      />

      <DeleteConfirmationDialog
        title="حذف المحتوى"
        description={`هل أنت متأكد من حذف المحتوى ؟ هذا الإجراء لا يمكن التراجع عنه.`}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDeleteContent}
      />
    </div>
  )
}

