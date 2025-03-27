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
import animationData from '@/public/no_data.json'; // Adjust the path to your Lottie JSON file

import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Edit, Trash2, Eye, FileQuestion, LucideChevronLeftCircle, LoaderIcon, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { GameViewDialog } from "@/components/dialogs/game-view-dialog"
import { GameEditDialog } from "@/components/dialogs/games/games/game-edit-dialog"
import { LevelDialog } from "@/components/dialogs/games/levels/level-edit-dialog"
import { QuestionDialog } from "@/components/dialogs/games/questions/questions-edit-dialog"
import { AnswerDialog } from "@/components/dialogs/games/answers/answers-edit-dialog"

import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog"
import { getData, postData, putData, deleteData } from "@/lib/apiHelper"
import { PaginationControls } from "./ui/pagination-controls"
import { Image } from "@radix-ui/react-avatar"
import { Switch } from "./ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { LevelViewDialog } from "./dialogs/level-view-dialog"
import { QuestionViewDialog } from "./dialogs/question-view-dialog"
import toast from "react-hot-toast"
import Lottie from "lottie-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { PublishConfirmationDialog } from "./dialogs/publish-confirmation-dialog copy"

export function GamesManagement() {
  const [activeTab, setActiveTab] = useState("games")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddGameOpen, setIsAddGameOpen] = useState(false)
  const [isAddLevelOpen, setIsAddLevelOpen] = useState(false)
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false)
  const [isAddAnswerOpen, setIsAddAnswerOpen] = useState(false)
  const initialFilter = { game_id: "", level_id: "", question_id: "" };
  const [filter, setFilter] = useState(initialFilter)

  const [isEnabled, setIsEnabled] = useState(true);
  const [gameColor, setGameColor] = useState("#ffffff"); // اللون الافتراضي
  const [imagePreview, setImagePreview] = useState(null); // Store image preview
  const [selectedGameId, setSelectedGameId] = useState("");
  const [selectedLevelId, setSelectedLevelId] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState("");

  const [selectedQuestionType, setSelectedQuestionType] = useState("");
  const [selectedQuestionView, setSelectedQuestionView] = useState("text");
  const [imageLink, setImageLink] = useState("");

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const response = await postData("general/upload-image", { image: file, folder: `games` }, {});
      console.log("Upload response:", response);

      if (response.success) {
        // imageLink = response.data.image_name;
        setImageLink(response.data.image_name); // إضافة رابط الصورة إلى البيانات
      } else {
        toast.error("فشل رفع الصورة");
        return;
      }
      setImagePreview(URL.createObjectURL(file)); // Generate preview URL
    }
  };
  // حالات النوافذ المنبثقة
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [viewDialogLevelOpen, setViewDialogLevelOpen] = useState(false)
  const [viewDialogQuestionOpen, setViewDialogQuestionOpen] = useState(false)


  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editLevelDialogOpen, setEditLevelDialogOpen] = useState(false)
  const [ediQuestionDialogOpen, setEditQuestionDialogOpen] = useState(false)
  const [editAnswerDialogOpen, setEditAnswerDialogOpen] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedItemLevel, setSelectedItemLevel] = useState(null)
  const [selectedItemQuestion, setSelectedItemQuestion] = useState(null)

  const [loading, setLoading] = useState(false)

  // بيانات الكيانات
  const [gamesData, setGamesData] = useState([])
  const [levelsData, setLevelsData] = useState([])
  const [questionsData, setQuestionsData] = useState([])
  const [answersData, setAnswersData] = useState([])
  const [pageSize, setPageSize] = useState(50); // number of items per page

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
  const [questionsIds, setQuestionsId] = useState([]);
  // publish level
  const [publishLevel, setPublishLevel] = useState(false)
  const typQuestions = [
    { id: 1, name: "DragDrop" },
    { id: 2, name: "LetterArrangement" },
    { id: 3, name: "MCQ" },

  ]
  const viewQuestions = [
    { id: 1, name: "text", title: "نص" },
    { id: 2, name: "image", title: "صورة" },

  ]
  const filteredViewQuestions = () => {
    switch (selectedQuestionType) {
      case "DragDrop":
        return viewQuestions.filter((q) => q.name === "image");
      case "LetterArrangement":
        return viewQuestions.filter((q) => q.name === "text");
      case "MCQ":
        return viewQuestions;
      default:
        return [];
    }
  };
  const handleTabChange = (newTab, newFilter) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
    setActiveTab(newTab);
  };

  // دالة الرجوع إلى تبويب سابق دون مسح الفلاتر السابقة
  const handleBackTab = (prevTab) => {
    if (prevTab === "games") {
      setFilter(initialFilter); // حذف جميع الفلاتر عند العودة للألعاب
    } else if (prevTab === "levels") {
      setFilter((prev) => ({ game_id: prev.game_id, level_id: "", question_id: "" }));
    } else if (prevTab === "questions") {
      setFilter((prev) => ({ game_id: prev.game_id, level_id: prev.level_id, question_id: "" }));
    }
    setActiveTab(prevTab);
  };
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
    const fetchQuestionId = async () => {
      const response = await getData(`games/questions?level_id=${selectedLevelId}`);
      console.log("ddd", response);

      setQuestionsId(response.data);
    };
    fetchLevelId()
    fetchQuestionId()
    fetchGamesId();
  }, [filter]);

  // بيانات وهمية لل
  // الدالة المسؤولة عن جلب البيانات مع pagination والبحث
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
  // console.log(gamesData);
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
  // دالة لمزامنة جلب البيانات بناءً على التبويب النشط
  useEffect(() => {
    if (activeTab === "games") {
      fetchEntityData("games/games", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);
    } else if (activeTab === "levels") {
      fetchEntityData("games/levels", setLevelsData, setLevelsMeta, levelsPage, searchTerm, filter);
    } else if (activeTab === "questions") {
      fetchEntityData("games/questions", setQuestionsData, setQuestionsMeta, questionsPage, searchTerm, filter);
    } else if (activeTab === "answers") {
      fetchEntityData("games/answers", setAnswersData, setAnswersMeta, answersPage, searchTerm, filter);
    }
  }, [activeTab, gamesPage, levelsPage, questionsPage, answersPage, searchTerm, pageSize, filter]);
  // العمليات CRUD
  const handleAddEntity = async (endpoint, newEntity, file = null) => {
    let dataToSend = { ...newEntity }; // نسخ البيانات إلى كائن جديد
    try {

      console.log("imageLink:", imageLink);

      if (imageLink.length > 0) {
        dataToSend.image = imageLink
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
          setImageLink("")
          fetchEntityData("games/games", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);
        }
        if (endpoint.includes("levels")) {
          setSelectedGameId("")
          setImageLink("")

          setIsAddLevelOpen(false);

          fetchEntityData("games/levels", setLevelsData, setLevelsMeta, levelsPage, searchTerm, filter)
        };
        if (endpoint.includes("questions")) {
          setSelectedGameId("")
          setSelectedQuestionType("")
          setImageLink("")

          setSelectedLevelId("")
          setSelectedQuestionView("")

          setIsAddQuestionOpen(false);
          fetchEntityData("games/questions", setQuestionsData, setQuestionsMeta, questionsPage, searchTerm, filter);
        }
        if (endpoint.includes("answers")) {
          setSelectedGameId("")
          setSelectedQuestionType("")
          setImageLink("")

          setSelectedLevelId("")
          setSelectedQuestionView("")
          setSelectedQuestionId("")


          setIsAddAnswerOpen(false);
          fetchEntityData("games/answers", setAnswersData, setAnswersMeta, answersPage, searchTerm, filter)

        };
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);

    }
  };


  const handleUpdateEntity = async (endpoint, updatedEntity) => {
    console.log("Sending Data:", updatedEntity);

    const response = await putData(endpoint + `/${selectedItem.id}`, updatedEntity)
    console.log(response);

    if (response.success) {
      toast.success(response.message)
      if (endpoint.includes("games")) {
        fetchEntityData("games/games", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);

        setEditDialogOpen(false)

      }
      if (endpoint.includes("levels")) {
        fetchEntityData("games/levels", setLevelsData, setLevelsMeta, levelsPage, searchTerm, filter);

        setEditLevelDialogOpen(false)

      }
      if (endpoint.includes("questions")) {
        fetchEntityData("games/questions", setQuestionsData, setQuestionsMeta, questionsPage, searchTerm, filter);
        setEditQuestionDialogOpen(false)

      }
      if (endpoint.includes("answers")) {
        fetchEntityData("games/answers", setAnswersData, setAnswersMeta, answersPage, searchTerm, filter);
        setEditAnswerDialogOpen(false)
      }
    } else {
      toast.error(response.message)
    }
  }

  const handleDeleteEntity = async (endpoint, entityId) => {
    const response = await deleteData(endpoint, entityId)
    if (response.data.success) {
      toast.success(response.data.message)
      if (endpoint.includes("games")) fetchEntityData("games/games", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);

      if (endpoint.includes("levels")) fetchEntityData("games/levels", setLevelsData, setLevelsMeta, levelsPage, searchTerm, filter)

      if (endpoint.includes("questions")) fetchEntityData("games/questions", setQuestionsData, setQuestionsMeta, questionsPage, searchTerm, filter);

      if (endpoint.includes("answers")) fetchEntityData("games/answers", setAnswersData, setAnswersMeta, answersPage, searchTerm, filter)

    } else {
      toast.error(response.data.message)
    }
  }
  // console.log(questionsIds.find(e => e.id == selectedQuestionId)?.answers_view);

  // معالجات عرض، تعديل وحذف العنصر (يمكن استخدامها لكل الكيانات)
  const handleViewItem = (item) => {
    setSelectedItem(item)
    setViewDialogOpen(true)
  }
  const handleViewLevel = (item) => {
    setSelectedItemLevel(item)
    setViewDialogLevelOpen(true)
  }
  const handlePublishLevel = () => {
    // console.log("uuu", item);
    // setSelectedItem(item)
    // const updatedItem = { ...item, status: "published" };
    handleUpdateEntity("games/levels", selectedItem);
  };
  console.log("answersData", answersData);

  const handlePublishOpen = (item) => {
    setPublishLevel(true)
    const updatedItem = { ...item, status: "published" };

    setSelectedItem(updatedItem)

  }
  const handleViewQuestion = (item) => {
    setSelectedItemQuestion(item)
    setViewDialogQuestionOpen(true)
  }
  const handleEditItem = (item) => {
    setSelectedItem(item)
    setEditDialogOpen(true)
  }
  const handleEditItemLevel = (item) => {
    setSelectedItem(item)
    setEditLevelDialogOpen(true)
  }
  const handleEditItemQuestion = (item) => {
    setSelectedItem(item)
    setEditQuestionDialogOpen(true)
  }
  const handleEditItemAnswer = (item) => {
    setSelectedItem(item)
    setEditAnswerDialogOpen(true)
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
  // console.log("levelsData", levelsData);

  // مثال لمعالجة حفظ التعديلات (تستخدم في Dialog الخاص بالتعديل)
  const handleSaveItem = (updatedItem) => {
    let endpoint = ""
    if (activeTab === "games") endpoint = "games/games"
    if (activeTab === "levels") endpoint = "games/levels"
    if (activeTab === "questions") endpoint = "games/questions"
    if (activeTab === "answers") endpoint = "games/answers"
    handleUpdateEntity(endpoint, updatedItem)
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

                {/* ✅ استخدام form مع onSubmit */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);

                    // جمع البيانات
                    const newGame = {
                      name: formData.get("name"),
                      order: formData.get("order"),
                      is_enable: isEnabled ? 1 : 0,
                      color: gameColor,
                    };

                    const imageFile = formData.get("image"); // الحصول على ملف الصورة

                    // إرسال البيانات
                    handleAddEntity("games/games", newGame, imageFile);
                  }}
                >
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">اسم اللعبة</Label>
                      <Input id="name" name="name" placeholder="أدخل اسم اللعبة" required />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_enable">تفعيل اللعبة</Label>
                      <Switch id="is_enable" name="is_enable" color="primary" checked={isEnabled} onCheckedChange={setIsEnabled} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="color">لون اللعبة</Label>
                      <input
                        id="color"
                        name="color"
                        type="color"
                        value={gameColor}
                        onChange={(e) => setGameColor(e.target.value)}
                        className="w-full h-10 p-1 border border-gray-300 rounded"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="order">ترتيب اللعبة</Label>
                      <Input id="order" name="order" placeholder="أدخل ترتيب اللعبة" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">صورة اللعبة</Label>
                      <Input id="image" name="image" required type="file" onChange={handleImageChange} />
                      {imagePreview && (
                        <img src={imagePreview} alt="Preview" className="h-[100px] w-[100px] object-cover rounded border border-gray-300" />
                      )}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button className="mx-2" type="button" variant="outline" onClick={() => setIsAddGameOpen(false)}>
                      إلغاء
                    </Button>
                    <Button type="submit" className="bg-[#ffac33] mx-4 hover:bg-[#f59f00]">
                      حفظ
                    </Button>
                  </DialogFooter>
                </form>
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
              <DialogContent className="sm:max-w-[550px]  ">
                <DialogHeader>
                  <DialogTitle>إضافة مستوى جديد</DialogTitle>
                  <DialogDescription>أدخل بيانات المستوى الجديد هنا. اضغط على حفظ عند الانتهاء.</DialogDescription>
                </DialogHeader>

                {/* ✅ استخدام form مع onSubmit */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);

                    // جمع البيانات
                    const newLevel = {
                      number: formData.get("number"),
                      title: formData.get("title"),
                      game_id: filter.game_id, // استخدام الـ game_id المحدد من الـ state
                      status: "pending", // تحويل الحالة
                    };

                    // إرسال البيانات
                    handleAddEntity("games/levels", newLevel);
                  }}
                >
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="game">اللعبة</Label>
                      <Select name="game_id" value={filter.game_id} disabled onValueChange={(value) => setSelectedGameId(value)}>
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
                      <Input id="title" name="title" placeholder="أدخل اسم المستوى" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="number">رقم المستوى</Label>
                      <Input id="number" name="number" type="number" placeholder="اختر مستوى الصعوبة" required />
                    </div>

                    {/* <div className="flex items-center justify-between">
                      <Label htmlFor="status"> حالة المستوى</Label>
                      <div className="flex gap-3 align-middle justify-center">
                        <span>{isEnabled ? "مفعل" : "مغلق"}</span>
                        <Switch id="status" name="status" color="primary" checked={isEnabled} onCheckedChange={setIsEnabled} />
                      </div>
                    </div> */}
                  </div>

                  <DialogFooter>
                    <Button type="button" className="mx-2" variant="outline" onClick={() => setIsAddLevelOpen(false)}>
                      إلغاء
                    </Button>
                    <Button type="submit" className="bg-[#ffac33] hover:bg-[#f59f00]">
                      حفظ
                    </Button>
                  </DialogFooter>
                </form>
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

                {/* ✅ استخدام form مع onSubmit */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);

                    // جمع البيانات
                    const newQuestion = {
                      game_id: selectedGameId,
                      level_id: filter.level_id,
                      text: formData.get("text"),
                      points: formData.get("points"),
                      type: selectedQuestionType,
                      answers_view: selectedQuestionView,
                    };

                    // جلب الصورة إذا كانت موجودة
                    const imageFile = formData.get("image");

                    // إرسال البيانات
                    handleAddEntity("games/questions", newQuestion, imageFile);
                  }}
                >
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="game">اللعبة</Label>
                      <Select name="game_id" value={filter.game_id} disabled onValueChange={(value) => setSelectedGameId(value)}>
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
                      <Label htmlFor="level">المستوى</Label>
                      <Select name="level_id" value={filter.level_id} disabled onValueChange={(value) => setSelectedLevelId(value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="اختر المستوى" />
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
                      <Label htmlFor="type">نوع السؤال</Label>
                      <Select
                        name="type"
                        required
                        value={selectedQuestionType}
                        onValueChange={(value) => {
                          setSelectedQuestionType(value);
                          setSelectedQuestionView(""); // إعادة تعيين نوع الجواب عند تغيير نوع السؤال
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="اختر نوع السؤال" />
                        </SelectTrigger>
                        <SelectContent>
                          {typQuestions.map((question, idx) => (
                            <SelectItem key={idx} value={question.name}>
                              {question.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* نص السؤال */}
                    <div className="space-y-2">
                      <Label htmlFor="text">نص السؤال</Label>
                      <Textarea id="text" name="text" placeholder="أدخل نص السؤال" required />
                    </div>

                    {/* نوع الجواب */}
                    <div className="space-y-2">
                      <Label htmlFor="answerType">نوع الجواب</Label>
                      <Select
                        name="answerType"
                        value={selectedQuestionView}
                        onValueChange={(value) => setSelectedQuestionView(value)}
                        disabled={!selectedQuestionType} // تعطيل الاختيار حتى يتم تحديد نوع السؤال
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="اختر نوع الجواب" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredViewQuestions().map((view, idx) => (
                            <SelectItem key={idx} value={view.name}>
                              {view.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="points">نقاط السؤال</Label>
                      <Input id="points" name="points" type="number" placeholder="ادخل نقاط السؤال" min={0} required />
                    </div>

                    {/* صورة السؤال */}
                    <div className="space-y-2">
                      <Label htmlFor="image">صورة السؤال</Label>
                      <Input id="image" name="image" required type="file" onChange={handleImageChange} />
                      {imagePreview && (
                        <img src={imagePreview} alt="Preview" className="h-[100px] w-[100px] object-cover rounded border border-gray-300" />
                      )}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      style={{
                        marginInline: "1rem"
                      }}
                      variant="outline"
                      onClick={() => setIsAddQuestionOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button type="submit" className="bg-[#ffac33] hover:bg-[#f59f00]">
                      حفظ
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}

          {activeTab === "answers" && (
            (
              (questionsIds && questionsIds.find((e) => e.id == filter.question_id)?.type === "DragDrop" && answersData.length < 2) ||
              (questionsIds && questionsIds.find((e) => e.id == filter.question_id)?.type === "LetterArrangement" && answersData.length < 1) ||
              (questionsIds && questionsIds.find((e) => e.id == filter.question_id)?.type === "MCQ" && answersData.length < 4)
            ) && (
              <Dialog open={isAddAnswerOpen} onOpenChange={setIsAddAnswerOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#ffac33] hover:bg-[#f59f00] w-full sm:w-auto">
                    <Plus className="h-4 w-4 ml-2" />
                    <span className="hidden sm:inline">إضافة جواب سؤال جديد</span>
                    <span className="sm:hidden">إضافة</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>إضافة جواب سؤال جديد</DialogTitle>
                    <DialogDescription>أدخل بيانات جواب السؤال الجديد هنا. اضغط على حفظ عند الانتهاء.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault(); // منع إعادة تحميل الصفحة

                    const formData = new FormData(e.target); // جمع البيانات من النموذج

                    const newAnswer = {
                      game_id: selectedGameId,
                      level_id: selectedLevelId,
                      question_id: formData.get("question_id"),
                      is_correct: isEnabled ? 1 : 0, // تحويل الحالة إلى 1 أو 0
                      text: formData.get("text") || null, // جلب نص الجواب إذا كان موجودًا
                    };

                    const imageFile = formData.get("image"); // جلب الصورة إذا كانت موجودة
                    handleAddEntity("games/answers", newAnswer, imageFile);
                  }}>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="game">اللعبة</Label>
                        <Select name="game_id" value={filter.game_id} disabled>
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
                        <Label htmlFor="level">المستوى</Label>
                        <Select name="level_id" value={filter.level_id} disabled>
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
                        <Label htmlFor="question_id">السؤال</Label>
                        <Select
                          name="question_id"
                          value={filter.question_id}
                          onValueChange={(value) => setSelectedQuestionId(value)}
                          required
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="اختر السؤال" />
                          </SelectTrigger>
                          <SelectContent>
                            {questionsIds.map((game, idx) => (
                              <SelectItem key={idx} value={game.id.toString()}>
                                {game.text}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {questionsIds && questionsIds.find((e) => e.id == filter.question_id)?.answers_view === "text" ? (
                        <div className="space-y-2">
                          <Label htmlFor="text">جواب السؤال</Label>
                          <Textarea id="text" name="text" placeholder="أدخل نص السؤال" required />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label htmlFor="image">صورة جواب السؤال</Label>
                          <Input id="image" name="image" required type="file" onChange={handleImageChange} />
                          {imagePreview && (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="h-[100px] w-[100px] object-cover rounded border border-gray-300"
                            />
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <Label htmlFor="is_correct">الجواب الصحيح</Label>
                        <Switch id="is_correct" name="is_correct" color="primary" checked={isEnabled} onCheckedChange={setIsEnabled} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        style={{
                          marginInline: "1rem",
                        }}
                        variant="outline"
                        onClick={() => setIsAddAnswerOpen(false)}
                      >
                        إلغاء
                      </Button>
                      <Button className="bg-[#ffac33] hover:bg-[#f59f00]" type="submit">
                        حفظ
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            ))}


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
        {activeTab === "levels" && <>
          <div className="space-y-2 " style={{ width: "10rem" }}>
            {/* <Label htmlFor="game">اللعبة</Label> */}
            <Select name="game_id"
              value={filter.game_id}
              disabled
              onValueChange={(value) => setFilter((prev) => ({
                ...prev,
                game_id: prev.game_id == value ? "" : value,
              }))}
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

        </>}
        {activeTab === "questions" && <>
          <div className="space-y-2 " style={{ width: "10rem" }}>
            {/* <Label htmlFor="game">اللعبة</Label> */}
            <Select name="level_id"
              disabled
              value={filter.level_id}

              onValueChange={(value) => setFilter((prev) => ({
                ...prev,
                level_id: prev.level_id == value ? "" : value,
              }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر المستوى" />
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
          {/* <Button variant="outline" onClick={() => setFilter(initialFilter)}>
            مسح الكل
          </Button> */}
        </>}

      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex w-full justify-evenly">
          <TabsTrigger
            className="flex-1"
            value="games"
            disabled={false}
            onClick={() => handleBackTab("games")}
          >
            الألعاب
          </TabsTrigger>
          <TabsTrigger
            className="flex-1"
            value="levels"
            disabled={!filter.game_id}
            onClick={() => handleBackTab("levels")}
          >
            المستويات
          </TabsTrigger>
          <TabsTrigger
            className="flex-1"
            value="questions"
            disabled={!filter.level_id}
            onClick={() => handleBackTab("questions")}
          >
            الأسئلة
          </TabsTrigger>
          <TabsTrigger
            className="flex-1"
            value="answers"
            disabled={!filter.question_id}
            onClick={() => handleBackTab("answers")}
          >
            الأجوبة
          </TabsTrigger>
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
                      <TableHead>المعرف</TableHead>
                      <TableHead className="text-nowrap">صورة اللعبة</TableHead>

                      <TableHead className="text-nowrap">اسم اللعبة</TableHead>

                      <TableHead>اللون</TableHead>
                      <TableHead>ترتيب اللعبة</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="text-nowrap">تاريخ انشاء اللعبة</TableHead>

                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ?
                      <TableRow>
                        <TableCell className="text-center " colSpan={8}>
                          <div className="flex w-full align-middle justify-center">
                            <LoaderIcon />
                          </div>
                        </TableCell>
                      </TableRow>
                      :

                      gamesData.length == 0 ? <>
                        <TableRow>
                          <TableCell className="text-center " colSpan={8}>
                            <div className="flex w-full align-middle justify-center">
                              <Lottie animationData={animationData} loop={true} style={{ width: 100, height: 100 }} />
                            </div>
                          </TableCell>
                        </TableRow>
                      </> :
                        gamesData.map((game) => (
                          <TableRow key={game.id}>
                            <TableCell className="font-medium">{game.id}</TableCell>
                            <TableCell>
                              <img src={game.image || "/placeholder.svg"} className="rounded-lg h-10 w-10 object-cover  m-auto" />
                            </TableCell>
                            {/* <TableCell className="font-medium">{game.name}</TableCell> */}

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
                            <TableCell className="text-nowrap">{handleConvertDate(game.created_at)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2 space-x-reverse justify-center">
                                <Button
                                  variant="outline"
                                  // size="icon"
                                  onClick={() => handleTabChange("levels", { game_id: game.id.toString() })}
                                >
                                  عرض المستويات
                                  {/* <LucideChevronLeftCircle className="h-4 w-4" /> */}
                                </Button>
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
                    {loading ?
                      <TableRow>
                        <TableCell className="text-center " colSpan={5}>
                          <div className="flex w-full align-middle justify-center">
                            <LoaderIcon />
                          </div>
                        </TableCell>
                      </TableRow>
                      :

                      levelsData.length == 0 ? <>
                        <TableRow>
                          <TableCell className="text-center " colSpan={5}>
                            <div className="flex w-full align-middle justify-center">
                              <Lottie animationData={animationData} loop={true} style={{ width: 100, height: 100 }} />
                            </div>
                          </TableCell>
                        </TableRow>
                      </> : levelsData.map((level) => (
                        <TableRow key={level.id}>
                          <TableCell className="font-medium">{level.game.name}</TableCell>
                          <TableCell>{level.title}</TableCell>
                          <TableCell>{level.question_count}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full ${level.status === "published" ? "bg-green-100 text-green-800 " : "bg-red-100 text-red-800 "}  text-xs`}>
                              {level.status === "published" ? "منشور" : " غير منشور"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2 space-x-reverse justify-center">
                              <Button
                                variant="outline"
                                // size="icon"
                                onClick={() => handleTabChange("questions", { level_id: level.id.toString() })}
                                disabled={!filter.game_id}
                              >
                                عرض الأسئلة
                                {/* <LucideChevronLeftCircle className="h-4 w-4" /> */}
                              </Button>
                              {level.can_publish && level.status === "pending" ? <>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger >
                                      <Button variant="ghost" size="icon" onClick={() => handlePublishOpen(level)}>
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                      </Button>                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-[400px] text-wrap" side="top">
                                      نشر المستوى
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>


                              </> : <></>}
                              <Button variant="ghost" size="icon" onClick={() => handleViewLevel(level)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleEditItemLevel(level)}>
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
                      <TableHead>نوع الجواب</TableHead>

                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ?
                      <TableRow>
                        <TableCell className="text-center " colSpan={6}>
                          <div className="flex w-full align-middle justify-center">
                            <LoaderIcon />
                          </div>
                        </TableCell>
                      </TableRow>
                      :

                      questionsData.length == 0 ? <>
                        <TableRow>
                          <TableCell className="text-center " colSpan={6}>
                            <div className="flex w-full align-middle justify-center">
                              <Lottie animationData={animationData} loop={true} style={{ width: 100, height: 100 }} />
                            </div>
                          </TableCell>
                        </TableRow>
                      </> : questionsData.map((question) => (
                        <TableRow key={question.id}>
                          <TableCell className="font-medium text-nowrap">{question.level?.game?.name}</TableCell>
                          <TableCell className="text-nowrap">{question.level?.title}</TableCell>
                          <TableCell className="text-nowrap">{question.text}</TableCell>
                          <TableCell>{question.type}</TableCell>
                          <TableCell>{question.answers_view === "text" ? "نص" : "صورة"}</TableCell>

                          <TableCell>
                            <div className="flex space-x-2 space-x-reverse justify-center">
                              <Button
                                variant="outline"
                                // size="icon"
                                onClick={() => handleTabChange("answers", { question_id: question.id.toString() })}
                                disabled={!filter.level_id}
                              >
                                عرض الأجوبة
                                {/* <LucideChevronLeftCircle className="h-4 w-4" /> */}
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleViewQuestion(question)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleEditItemQuestion(question)}>
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
                      <TableHead className="text-nowrap">هل الجواب صحيح؟</TableHead>

                      {/* <TableHead>الإجراءات</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ?
                      <TableRow>
                        <TableCell className="text-center " colSpan={5}>
                          <div className="flex w-full align-middle justify-center">
                            <LoaderIcon />
                          </div>
                        </TableCell>
                      </TableRow>
                      :

                      answersData.length == 0 ? <>
                        <TableRow>
                          <TableCell className="text-center " colSpan={9}>
                            <div className="flex w-full align-middle justify-center">
                              <Lottie animationData={animationData} loop={true} style={{ width: 100, height: 100 }} />
                            </div>
                          </TableCell>
                        </TableRow>
                      </> : answersData.map((answer) => (
                        <TableRow key={answer.id}>
                          <TableCell className="font-medium">{answer.question?.level?.game?.name}</TableCell>
                          <TableCell>{answer.question?.level?.title}</TableCell>
                          <TableCell>{answer.question?.text}</TableCell>
                          <TableCell>{

                            answer.question.answers_view === "text" ?
                              answer.text : <>
                                <img src={answer.image} className="rounded-lg h-10 w-10 object-cover  m-auto" />
                              </>}</TableCell>
                          <TableCell>  <span className={`px-2 py-1 rounded-full ${answer.is_correct === true ? " bg-green-100 text-green-800 " : " bg-red-100 text-red-800 "}text-xs`}>
                            {answer.is_correct === true ? "صحيح" : "غير صحيح"}
                          </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2 space-x-reverse justify-center">
                              {/*    <Button variant="ghost" size="icon" onClick={() => handleViewItem(answer)}>
                              <Eye className="h-4 w-4" />
                            </Button> */}
                              <Button variant="ghost" size="icon" onClick={() => handleEditItemAnswer(answer)}>
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
      <LevelViewDialog game={selectedItemLevel} open={viewDialogLevelOpen} onOpenChange={setViewDialogLevelOpen} />
      <QuestionViewDialog game={selectedItemQuestion} open={viewDialogQuestionOpen} onOpenChange={setViewDialogQuestionOpen} />

      <GameEditDialog
        game={selectedItem}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveItem}
      />
      <LevelDialog
        level={selectedItem}
        open={editLevelDialogOpen}
        onOpenChange={setEditLevelDialogOpen}
        onSave={handleSaveItem}
      />
      <QuestionDialog
        question={selectedItem}
        gamesIds={gamesIds}
        levelsIds={levelsIds}
        viewQuestions={viewQuestions}
        typQuestions={typQuestions}
        open={ediQuestionDialogOpen}
        onOpenChange={setEditQuestionDialogOpen}
        onSave={handleSaveItem}
      />
      <AnswerDialog
        answer={selectedItem}
        gamesIds={gamesIds}
        levelsIds={levelsIds}
        questionsIds={questionsIds}
        open={editAnswerDialogOpen}
        onOpenChange={setEditAnswerDialogOpen}
        onSave={handleSaveItem}
      />
      <DeleteConfirmationDialog
        title="حذف العنصر"
        description={`هل أنت متأكد من حذف العنصر ؟ هذا الإجراء لا يمكن التراجع عنه.`}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
      <PublishConfirmationDialog
        title="نشر المستوى"
        description={`هل أنت متأكد من نشر المستوى ؟ هذا الإجراء لا يمكن التراجع عنه.`}
        open={publishLevel}
        onOpenChange={setPublishLevel}
        onConfirm={handlePublishLevel}
      />
    </div>
  )
}
