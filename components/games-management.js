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
import { Spinner } from "@/components/ui/Spinner"

import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Edit, Trash2, Eye, FileQuestion } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { GameViewDialog } from "@/components/dialogs/game-view-dialog"
import { GameEditDialog } from "@/components/dialogs/game-edit-dialog"
import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog"
import { getData, postData, putData, deleteData } from "@/lib/apiHelper"
import { toast } from "sonner"
import { PaginationControls } from "./ui/pagination-controls"
import { Image } from "@radix-ui/react-avatar"
import { Switch } from "./ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export function GamesManagement() {
  const [activeTab, setActiveTab] = useState("games")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddGameOpen, setIsAddGameOpen] = useState(false)
  const [isAddLevelOpen, setIsAddLevelOpen] = useState(false)
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false)
  const [isEnabled, setIsEnabled] = useState(true);
  const [gameColor, setGameColor] = useState("#ffffff"); // اللون الافتراضي
  const [imagePreview, setImagePreview] = useState(null); // Store image preview
  const [selectedGameId, setSelectedGameId] = useState("");
  const [selectedLevelId, setSelectedLevelId] = useState("");
  const [selectedQuestionType, setSelectedQuestionType] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Generate preview URL
    }
  };
  // حالات النوافذ المنبثقة
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(false)

  // بيانات الكيانات
  const [gamesData, setGamesData] = useState([])
  const [levelsData, setLevelsData] = useState([])
  const [questionsData, setQuestionsData] = useState([])
  const [answersData, setAnswersData] = useState([])
  const [pageSize, setPageSize] = useState(10); // number of items per page

  const [gamesPage, setGamesPage] = useState(1);
  const [levelsPage, setLevelsPage] = useState(1);
  const [questionsPage, setQuestionsPage] = useState(1);
  const [answersPage, setAnswersPage] = useState(1);

  const [gamesMeta, setGamesMeta] = useState({});
  const [levelsMeta, setLevelsMeta] = useState({});
  const [questionsMeta, setQuestionsMeta] = useState({});
  const [answersMeta, setAnswersMeta] = useState({});
  const [gamesIds, setGamesId] = useState([]);
  const [levelsIds, setLevelsId] = useState([]);
  const typQuestions = [
    { id: 1, name: "DragDrop" },
    { id: 2, name: "LetterArrangement" },
    { id: 3, name: "MCQ" },

  ]
  useEffect(() => {
    const fetchGamesId = async () => {
      const response = await getData(`games/games`);
      // console.log("ddd", response);

      setGamesId(response.data);
    };
    const fetchLevelId = async () => {
      const response = await getData(`games/levels?game_id=${selectedGameId}`);
      // console.log("ddd", response);

      setLevelsId(response.data);
    };
    fetchLevelId()
    fetchGamesId();
  }, [selectedGameId]);

  // بيانات وهمية لل
  // الدالة المسؤولة عن جلب البيانات مع pagination والبحث
  const fetchEntityData = async (endpoint, setData, setMeta, page, searchTerm) => {
    setLoading(true)
    const response = await getData(
      `${endpoint}?page=${page}&limit=${pageSize}&search=${searchTerm}`
    );
    if (response.success) {
      setData(response.data);
      setMeta(response.meta); // Save metadata for pagination logic
      setLoading(false)
    } else {
      toast.error(response.message);
    }
  };

  // دالة لمزامنة جلب البيانات بناءً على التبويب النشط
  useEffect(() => {
    if (activeTab === "games") {
      fetchEntityData("games/games", setGamesData, setGamesMeta, gamesPage, searchTerm);
    } else if (activeTab === "levels") {
      fetchEntityData("games/levels", setLevelsData, setLevelsMeta, levelsPage, searchTerm);
    } else if (activeTab === "questions") {
      fetchEntityData("games/questions", setQuestionsData, setQuestionsMeta, questionsPage, searchTerm);
    } else if (activeTab === "answers") {
      fetchEntityData("games/answers", setAnswersData, setAnswersMeta, answersPage, searchTerm);
    }
  }, [activeTab, gamesPage, levelsPage, questionsPage, answersPage, searchTerm, pageSize]);
  // العمليات CRUD
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
      if (endpoint.includes("games")) {
        setIsAddGameOpen(false);
        setImagePreview(null);

        fetchEntityData("games/games", setGamesData, setGamesMeta, gamesPage, searchTerm);
      }
      if (endpoint.includes("levels")) {
        setSelectedGameId("")
        setIsAddLevelOpen(false);

        fetchEntityData("games/levels", setLevelsData, setLevelsMeta, levelsPage, searchTerm)
      };
      if (endpoint.includes("questions")) {
        setSelectedGameId("")
        setSelectedQuestionType("")
        setSelectedLevelId("")

        setIsAddQuestionOpen(false);
        fetchEntityData("games/questions", setQuestionsData, setQuestionsMeta, questionsPage, searchTerm);
      }
      if (endpoint.includes("answers")) fetchEntityData("games/answers", setAnswersData, answersPage);
    } else {
      toast.error(response.message);
    }
  };


  const handleUpdateEntity = async (endpoint, updatedEntity) => {
    const response = await putData(endpoint, updatedEntity)
    if (response.success) {
      toast.success("تم التعديل بنجاح")
      if (endpoint.includes("games")) fetchEntityData("games/games", setGamesData, gamesPage)
      if (endpoint.includes("levels")) fetchEntityData("games/levels", setLevelsData, levelsPage)
      if (endpoint.includes("questions")) fetchEntityData("games/questions", setQuestionsData, questionsPage)
      if (endpoint.includes("answers")) fetchEntityData("games/answers", setAnswersData, answersPage)
    } else {
      toast.error(response.message)
    }
  }

  const handleDeleteEntity = async (endpoint, entityId) => {
    const response = await deleteData(endpoint, entityId)
    if (response.success) {
      toast.success("تم الحذف بنجاح")
      if (endpoint.includes("games")) fetchEntityData("games/games", setGamesData, gamesPage)
      if (endpoint.includes("levels")) fetchEntityData("games/levels", setLevelsData, levelsPage)
      if (endpoint.includes("questions")) fetchEntityData("games/questions", setQuestionsData, questionsPage)
      if (endpoint.includes("answers")) fetchEntityData("games/answers", setAnswersData, answersPage)
    } else {
      toast.error(response.message)
    }
  }

  // معالجات عرض، تعديل وحذف العنصر (يمكن استخدامها لكل الكيانات)
  const handleViewItem = (item) => {
    setSelectedItem(item)
    setViewDialogOpen(true)
  }

  const handleEditItem = (item) => {
    setSelectedItem(item)
    setEditDialogOpen(true)
  }

  const handleDeleteItem = (item) => {
    setSelectedItem(item)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    let endpoint = ""
    if (activeTab === "games") endpoint = "games/games"
    if (activeTab === "levels") endpoint = "games/levels"
    if (activeTab === "questions") endpoint = "games/questions"
    if (activeTab === "answers") endpoint = "games/answers"
    handleDeleteEntity(endpoint, selectedItem?.id)
    setDeleteDialogOpen(false)
  }

  // مثال لمعالجة حفظ التعديلات (تستخدم في Dialog الخاص بالتعديل)
  const handleSaveItem = (updatedItem) => {
    let endpoint = ""
    if (activeTab === "games") endpoint = "games/games"
    if (activeTab === "levels") endpoint = "games/levels"
    if (activeTab === "questions") endpoint = "games/questions"
    if (activeTab === "answers") endpoint = "games/answers"
    handleUpdateEntity(endpoint, updatedItem)
    setEditDialogOpen(false)
  }

  // pagination controls بسيطة

  // if (gamesData.length <=0) {
  //   return <
  // }
  // if (loading) {
  //   return <div className="space-y-6"><Spinner size="xl" variant="secondary" /> </div>
  // }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-3xl font-bold">إدارة الألعاب</h2>
        <div className="">
          {activeTab === "games" && (
            <Dialog open={isAddGameOpen} onOpenChange={setIsAddGameOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#ffac33] hover:bg-[#f59f00] w-full sm:w-auto">
                  <Plus className="h-4 w-4 ml-2" />
                  <span className="hidden sm:inline">إضافة لعبة جديدة</span>
                  <span className="sm:hidden">إضافة</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>إضافة لعبة جديدة</DialogTitle>
                  <DialogDescription>أدخل بيانات اللعبة الجديدة هنا. اضغط على حفظ عند الانتهاء.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">اسم اللعبة</Label>
                    <Input id="name" placeholder="أدخل اسم اللعبة" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">وصف اللعبة</Label>
                    <Textarea id="description" placeholder="أدخل وصف اللعبة" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_enable">تفعيل اللعبة</Label>
                    <Switch id="is_enable" color="primary" checked={isEnabled} onCheckedChange={setIsEnabled} />

                  </div>
                  {/* إدخال اللون */}
                  <div className="space-y-2">
                    <Label htmlFor="color">لون اللعبة</Label>
                    <input
                      id="color"
                      type="color"
                      value={gameColor}
                      onChange={(e) => setGameColor(e.target.value)}
                      className="w-full h-10 p-1 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order">ترتيب اللعبة</Label>
                    <Input id="order" placeholder="أدخل ترتيب اللعبة" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">صورة اللعبة</Label>
                    <Input id="image" type="file" onChange={handleImageChange} />
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" className="h-[100px] w-[100px] object-cover rounded border border-gray-300" />
                    )}
                    {/*            <Image src={

                      document.getElementById("image").files[0] || null// جلب الصورة

                    } alt="صورة اللعبة" className="h-20 w-20 object-cover rounded" /> */}
                  </div>

                </div>
                <DialogFooter>
                  <Button style={{ marginInline: "1rem" }} variant="outline" onClick={() => setIsAddGameOpen(false)}>
                    إلغاء
                  </Button>
                  <Button
                    className="bg-[#ffac33] mx-4 hover:bg-[#f59f00]"
                    onClick={() => {
                      const newGame = {
                        name: document.getElementById("name").value,
                        description: document.getElementById("description").value,
                        order: document.getElementById("order").value,

                        is_enable: isEnabled ? 1 : 0, // تحويل الحالة إلى 1 أو 0
                        color: gameColor, // إرسال اللون المختار

                      };

                      const imageFile = document.getElementById("image").files[0]; // جلب الصورة

                      handleAddEntity("games/games", newGame, imageFile);
                    }}
                  >
                    حفظ
                  </Button>

                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {activeTab === "levels" && (
            <Dialog open={isAddLevelOpen} onOpenChange={setIsAddLevelOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#ffac33] hover:bg-[#f59f00] w-full sm:w-auto">
                  <Plus className="h-4 w-4 ml-2" />
                  <span className="hidden sm:inline">إضافة مستوى جديد</span>
                  <span className="sm:hidden">إضافة</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>إضافة مستوى جديد</DialogTitle>
                  <DialogDescription>أدخل بيانات المستوى الجديد هنا. اضغط على حفظ عند الانتهاء.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="game">اللعبة</Label>
                    <Select name="game_id"
                      value={selectedGameId}
                      onValueChange={(value) => setSelectedGameId(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر اللعبة" />
                      </SelectTrigger>
                      <SelectContent>
                        {gamesIds.map((game, idx) => (
                          <SelectItem key={idx} value={game.id.toString()}>
                            {game.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">اسم المستوى</Label>
                    <Input id="title" placeholder="أدخل اسم المستوى" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number">رقم المستوى</Label>
                    <Input id="number" type="number" placeholder="اختر مستوى الصعوبة" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="status"> حالة المستوى</Label>
                    <Switch id="status" color="primary" checked={isEnabled} onCheckedChange={setIsEnabled} />

                  </div>
                </div>
                <DialogFooter>
                  <Button
                    style={{ marginInline: "1rem" }}
                    variant="outline" onClick={() => setIsAddLevelOpen(false)}>
                    إلغاء
                  </Button>
                  <Button
                    className="bg-[#ffac33] hover:bg-[#f59f00]"
                    onClick={() => {
                      const newLevel = {
                        number: document.getElementById("number").value,
                        title: document.getElementById("title").value,
                        game_id: selectedGameId, // use the selected game ID from state
                        status: isEnabled ? "published" : "pending", // تحويل الحالة إلى 1 أو 0

                      }
                      handleAddEntity("games/levels", newLevel)
                      // setIsAddLevelOpen(false)
                    }}
                  >
                    حفظ
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {activeTab === "questions" && (
            <Dialog open={isAddQuestionOpen} onOpenChange={setIsAddQuestionOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#ffac33] hover:bg-[#f59f00] w-full sm:w-auto">
                  <Plus className="h-4 w-4 ml-2" />
                  <span className="hidden sm:inline">إضافة سؤال جديد</span>
                  <span className="sm:hidden">إضافة</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>إضافة سؤال جديد</DialogTitle>
                  <DialogDescription>أدخل بيانات السؤال الجديد هنا. اضغط على حفظ عند الانتهاء.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="game">اللعبة</Label>
                    <Select name="game_id"
                      value={selectedGameId}
                      onValueChange={(value) => setSelectedGameId(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر اللعبة" />
                      </SelectTrigger>
                      <SelectContent>
                        {gamesIds.map((game, idx) => (
                          <SelectItem key={idx} value={game.id.toString()}>
                            {game.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">السمتوى</Label>
                    <Select name="level_id"
                      value={selectedLevelId}
                      onValueChange={(value) => setSelectedLevelId(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر اللعبة" />
                      </SelectTrigger>
                      <SelectContent>
                        {levelsIds.map((game, idx) => (
                          <SelectItem key={idx} value={game.id.toString()}>
                            {game.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="text">نص السؤال</Label>
                    <Textarea id="text" placeholder="أدخل نص السؤال" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="points">نقاط السؤال</Label>
                    <Input id="points" type="points" placeholder="ادخل نقاط السؤال"  min={0}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">مزع السؤال</Label>
                    <Select name="type"
                      value={selectedQuestionType}
                      onValueChange={(value) => setSelectedQuestionType(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر نوع السؤال" />
                      </SelectTrigger>
                      <SelectContent>
                        {typQuestions.map((game, idx) => (
                          <SelectItem key={idx} value={game.name.toString()}>
                            {game.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">صورة السؤال</Label>
                    <Input id="image" type="file" onChange={handleImageChange} />
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" className="h-[100px] w-[100px] object-cover rounded border border-gray-300" />
                    )}
                    {/*            <Image src={

                      document.getElementById("image").files[0] || null// جلب الصورة

                    } alt="صورة اللعبة" className="h-20 w-20 object-cover rounded" /> */}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    style={{
                      marginInline: "1rem"
                    }}
                    variant="outline" onClick={() => setIsAddQuestionOpen(false)}>
                    إلغاء
                  </Button>
                  <Button
                    className="bg-[#ffac33] hover:bg-[#f59f00]"
                    onClick={() => {
                      const newQuestion = {
                        game_id: selectedGameId,
                        level_id: selectedLevelId,
                        text: document.getElementById("text").value,
                        points: document.getElementById("points").value,

                        type: selectedQuestionType,
                      }
                      const imageFile = document.getElementById("image").files[0]; // جلب الصورة

                      handleAddEntity("games/questions", newQuestion, imageFile)
                      // setIsAddQuestionOpen(false)
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
        <TabsList className="flex w-full" style={{ justifyContent: "space-evenly" }}>
          <TabsTrigger className="flex-1" value="games">الألعاب</TabsTrigger>
          <TabsTrigger className="flex-1" value="levels">المستويات</TabsTrigger>
          <TabsTrigger className="flex-1" value="questions">الأسئلة</TabsTrigger>
          <TabsTrigger className="flex-1" value="answers">الأجوبة</TabsTrigger>
        </TabsList>

        {/* جدول الألعاب */}
        <TabsContent value="games">
          <Card>
            <CardHeader>
              <CardTitle>الألعاب</CardTitle>
              <CardDescription>إدارة الألعاب التعليمية في النظام</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم اللعبة</TableHead>
                      <TableHead>اللون</TableHead>
                      <TableHead>ترتيب اللعبة</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gamesData.map((game) => (
                      <TableRow key={game.id}>
                        <TableCell className="font-medium">{game.name}</TableCell>
                        <TableCell>
                          <div
                            style={{
                              backgroundColor: game.color,
                              width: "24px",
                              height: "24px",
                              borderRadius: "4px",
                              display: "inline-block",
                            }}
                          />
                        </TableCell>
                        <TableCell>{game.order}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                            {game.is_enable === 1 ? "نشط" : "غير نشط"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button variant="ghost" size="icon" onClick={() => handleViewItem(game)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditItem(game)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(game)}>
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
                currentPage={gamesPage}
                setPage={setGamesPage}
                totalItems={gamesMeta.total}
                pageSize={pageSize}
                setPageSize={setPageSize}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* جدول المستويات */}
        <TabsContent value="levels">
          <Card>
            <CardHeader>
              <CardTitle>المستويات</CardTitle>
              <CardDescription>إدارة مستويات الألعاب التعليمية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اللعبة</TableHead>
                      <TableHead>المستوى</TableHead>
                      <TableHead>عدد الأسئلة</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {levelsData.map((level) => (
                      <TableRow key={level.id}>
                        <TableCell className="font-medium">{level.game.name}</TableCell>
                        <TableCell>{level.title}</TableCell>
                        <TableCell>{level.question_count}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full ${level.status === "published" ? "bg-green-100 text-green-800 " : "bg-red-100 text-red-800 "}  text-xs`}>
                            {level.status === "published" ? "نشط" : "غير نشط"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button variant="ghost" size="icon" onClick={() => handleViewItem(level)}>
                              <FileQuestion className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditItem(level)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(level)}>
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

        {/* جدول الأسئلة */}
        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>الأسئلة</CardTitle>
              <CardDescription>إدارة أسئلة مستويات الألعاب</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اللعبة</TableHead>
                      <TableHead>المستوى</TableHead>
                      <TableHead>السؤال</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questionsData.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell className="font-medium">{question.level?.game?.name}</TableCell>
                        <TableCell>{question.level?.title}</TableCell>
                        <TableCell>{question.text}</TableCell>
                        <TableCell>{question.type}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button variant="ghost" size="icon" onClick={() => handleViewItem(question)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditItem(question)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(question)}>
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
                currentPage={questionsPage}
                setPage={setQuestionsPage}
                totalItems={questionsMeta.total}
                pageSize={pageSize}
                setPageSize={setPageSize}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* جدول الأجوبة */}
        <TabsContent value="answers">
          <Card>
            <CardHeader>
              <CardTitle>الأجوبة</CardTitle>
              <CardDescription>إدارة أجوبة أسئلة مستويات الألعاب</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اللعبة</TableHead>
                      <TableHead>المستوى</TableHead>
                      <TableHead>السؤال</TableHead>
                      <TableHead>الجواب</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {answersData.map((answer) => (
                      <TableRow key={answer.id}>
                        <TableCell className="font-medium">{answer.game}</TableCell>
                        <TableCell>{answer.question?.level_id}</TableCell>
                        <TableCell>{answer.question?.text}</TableCell>
                        <TableCell>{answer.text}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button variant="ghost" size="icon" onClick={() => handleViewItem(answer)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditItem(answer)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(answer)}>
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
                currentPage={answersPage}
                setPage={setAnswersPage}
                totalItems={answersMeta.total}
                pageSize={pageSize}
                setPageSize={setPageSize}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* نوافذ العرض والتعديل والحذف */}
      <GameViewDialog game={selectedItem} open={viewDialogOpen} onOpenChange={setViewDialogOpen} />

      <GameEditDialog
        game={selectedItem}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveItem}
      />

      <DeleteConfirmationDialog
        title="حذف العنصر"
        description={`هل أنت متأكد من حذف العنصر "${selectedItem?.name || selectedItem?.title || "العنصر"}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
