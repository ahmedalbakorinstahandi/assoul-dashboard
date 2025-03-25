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
import AsyncSelect from "react-select/async";

import Lottie from 'lottie-react';
import animationData from '@/public/no_data.json'; // Adjust the path to your Lottie JSON file

import { Label } from "@/components/ui/label"

import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Edit, Trash2, Eye, FileQuestion } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { MealsDialog } from "@/components/dialogs/health/meals/physical-activities-edit-dialog"

import { InsulinDosesDialog } from "@/components/dialogs/health/insulin-doses/insulin-doses-edit-dialog"
import { PhysicalActivitiesDialog } from "@/components/dialogs/health/physical-activities/physical-activities-edit-dialog"

import { BloodSugarReadingsEditDialog } from "@/components/dialogs/health/blood-sugar-readings/blood-sugar-readings-edit-dialog"
import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog"
import { getData, postData, putData, deleteData } from "@/lib/apiHelper"
import { PaginationControls } from "./ui/pagination-controls"
import { Image } from "@radix-ui/react-avatar"
import { Switch } from "./ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { LevelViewDialog } from "./dialogs/level-view-dialog"
import { QuestionViewDialog } from "./dialogs/question-view-dialog"
import { activityTime, injectionSites, intensity, measurementTypes, takenTime, typeMeals, units } from "@/data/data"
import toast from "react-hot-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
export function SugarMonitoring() {
  const [activeTab, setActiveTab] = useState("blood-sugar-readings")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddGameOpen, setIsAddGameOpen] = useState(false)
  const [isAddLevelOpen, setIsAddLevelOpen] = useState(false)
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false)
  const [isAddAnswerOpen, setIsAddAnswerOpen] = useState(false)
  const initialFilter = { patient_id: "" };
  const [filter, setFilter] = useState(initialFilter)
  const [defaultOptions, setDefaultOptions] = useState([]);

  useEffect(() => {
    const fetchInitialProviders = async () => {
      try {
        // Adjust your endpoint to limit the results (if supported by your API)
        const response = await getData(`users/children?limit=20`);
        const providers = response.data.map((item) => ({
          label: `${item.user.first_name + " " + item.user.last_name}`,
          value: item.id,
        }));
        setDefaultOptions(providers);
      } catch (error) {
        console.error("Error fetching initial providers:", error);
      }
    };

    fetchInitialProviders();
  }, []);
  const loadOptions = async (inputValue, callback) => {
    try {
      // Call your API with the search query
      // const response = await fetchData(`public/services`);

      const response = await getData(`users/children?search=${inputValue}`);
      const providers = response.data.map((item) => ({
        label: `${item.user.first_name + " " + item.user.last_name}`,
        value: item.id,
      }));
      callback(providers);
    } catch (error) {
      console.error("Error fetching providers on search:", error);
      callback([]);
    }
  };
  const [isEnabled, setIsEnabled] = useState(true);
  const [gameColor, setGameColor] = useState("#ffffff"); // اللون الافتراضي
  const [imagePreview, setImagePreview] = useState(null); // Store image preview
  const [selectedGameId, setSelectedGameId] = useState("");
  const [selectedLevelId, setSelectedLevelId] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState("");

  const [selectedQuestionType, setSelectedQuestionType] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");

  const [selectedQuestionView, setSelectedQuestionView] = useState("text");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Generate preview URL
    }
  };
  // حالات النوافذ المنبثقة
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [viewDialogLevelOpen, setViewDialogLevelOpen] = useState(false)
  const [viewDialogQuestionOpen, setViewDialogQuestionOpen] = useState(false)


  const [editDialogOpen, setEditDialogOpen] = useState(false)
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
  const [mealsData, setMealsData] = useState([])

  const [pageSize, setPageSize] = useState(50); // number of items per page

  const [gamesPage, setGamesPage] = useState(1);
  const [levelsPage, setLevelsPage] = useState(1);
  const [questionsPage, setQuestionsPage] = useState(1);
  const [answersPage, setAnswersPage] = useState(1);
  const [mealsPage, setMealsPage] = useState(1);

  const [gamesMeta, setGamesMeta] = useState({});
  const [levelsMeta, setLevelsMeta] = useState({});
  const [questionsMeta, setQuestionsMeta] = useState({});
  const [answersMeta, setAnswersMeta] = useState({});
  const [mealsMeta, setMealsMeta] = useState({});

  const [gamesIds, setGamesId] = useState([]);
  const [levelsIds, setLevelsId] = useState([]);
  const [questionsIds, setQuestionsId] = useState([]);

  const typQuestions = [
    { id: 1, name: "fasting" },
    { id: 2, name: "befor_breakfast" },
    { id: 3, name: "befor_lunch" },
    { id: 4, name: "befor_dinner" },
    { id: 5, name: "after_snack" },
    { id: 6, name: "after_breakfast" },
    { id: 7, name: "after_lunch" },
    { id: 8, name: "after_dinner" },
    { id: 9, name: "befor_activity" },
    { id: 10, name: "after_activity" },


  ]

  const viewQuestions = [
    { id: 1, name: "text", title: "نص" },
    { id: 2, name: "image", title: "صورة" },

  ]
  useEffect(() => {
    const fetchGamesId = async () => {
      const response = await getData(`users/children`);
      // console.log("ddd", response);

      setGamesId(response.data);
    };
    const fetchLevelId = async () => {
      const response = await getData(`games/levels?game_id=${selectedGameId}`);
      // console.log("ddd", response);

      setLevelsId(response.data);
    };
    const fetchQuestionId = async () => {
      const response = await getData(`games/questions?game_id=${selectedGameId}&level_id=${selectedLevelId}`);
      // console.log("ddd", response);

      setQuestionsId(response.data);
    };
    fetchLevelId()
    fetchQuestionId()
    fetchGamesId();
  }, [selectedGameId, selectedLevelId]);

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

  useEffect(() => {
    if (filter.patient_id) {
      if (activeTab === "blood-sugar-readings") {
        fetchEntityData("health/blood-sugar-readings", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);
      } else if (activeTab === "insulin-doses") {
        fetchEntityData("health/insulin-doses", setLevelsData, setLevelsMeta, levelsPage, searchTerm, filter);
      } else if (activeTab === "physical-activities") {
        fetchEntityData("health/physical-activities", setAnswersData, setAnswersMeta, answersPage, searchTerm, filter);
      } else if (activeTab === "meals") {
        fetchEntityData("health/meals", setMealsData, setMealsMeta, mealsPage, searchTerm, filter);
      }
    } else {
      // إعادة تعيين البيانات إلى مصفوفات فارغة عند عدم وجود patient_id
      setGamesData([]);
      setGamesMeta({});
      setLevelsData([]);
      setLevelsMeta({});
      setAnswersData([]);
      setAnswersMeta({});
      setMealsData([]);
      setMealsMeta({});
    }
  }, [activeTab, gamesPage, levelsPage, questionsPage, answersPage, searchTerm, pageSize, filter, defaultOptions]);

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
      if (endpoint.includes("blood-sugar-readings")) {
        setIsAddGameOpen(false);
        setImagePreview(null);
        setSelectedGameId("")
        setSelectedUnit("")

        setSelectedQuestionType("")

        fetchEntityData("health/blood-sugar-readings", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);
      }
      if (endpoint.includes("insulin-doses")) {
        setImagePreview(null);
        setSelectedGameId("")
        setSelectedUnit("")

        setSelectedQuestionType("")
        setIsAddLevelOpen(false);

        fetchEntityData("health/insulin-doses", setLevelsData, setLevelsMeta, levelsPage, searchTerm, filter)
      };
      if (endpoint.includes("physical-activities")) {
        setImagePreview(null);
        setSelectedGameId("")
        setSelectedUnit("")

        setSelectedQuestionType("")
        setIsAddQuestionOpen(false);
        fetchEntityData("health/physical-activities", setAnswersData, setAnswersMeta, answersPage, searchTerm, filter);
      }
      if (endpoint.includes("meals")) {
        setImagePreview(null);
        setSelectedGameId("")
        setSelectedUnit("")

        setSelectedQuestionType("")
        setIsAddAnswerOpen(false);
        // console.log("feteched");

        fetchEntityData("health/meals", setMealsData, setMealsMeta, mealsPage, searchTerm, filter)

      };
    } else {
      toast.error(response.message);
    }
  };


  const handleUpdateEntity = async (endpoint, updatedEntity) => {
    console.log(updatedEntity);
    try {
      const response = await putData(endpoint + `/${selectedItem.id}`, updatedEntity)

      if (response.success) {
        toast.success(response.message)
        if (endpoint.includes("blood-sugar-readings")) {
          fetchEntityData("health/blood-sugar-readings", setGamesData, setGamesMeta, gamesPage, searchTerm, filter);
          setSelectedItem(null)
          setEditDialogOpen(false)

        }
        if (endpoint.includes("insulin-doses")) {

          fetchEntityData("health/insulin-doses", setLevelsData, setLevelsMeta, levelsPage, searchTerm, filter)
          setViewDialogOpen(false)
        }
        if (endpoint.includes("physical-activities")) {
          console.log("dddd");

          fetchEntityData("health/physical-activities", setAnswersData, setAnswersMeta, answersPage, searchTerm, filter);
          setViewDialogLevelOpen(false)
        }

        if (endpoint.includes("meals")) {


          fetchEntityData("health/meals", setMealsData, setMealsMeta, mealsPage, searchTerm, filter)
          setViewDialogQuestionOpen(false)
        }
      }
    } catch (error) {
      toast.error(error.message)

    }

  }

  const handleDeleteEntity = async (endpoint, entityId) => {
    const response = await deleteData(endpoint, entityId)
    // console.log("response", response);

    if (response.data.success) {
      toast.success(response.data.message)
      if (endpoint.includes("blood-sugar-readings")) fetchEntityData("health/blood-sugar-readings", setGamesData, setGamesMeta, gamesPage, searchTerm, filter)
      if (endpoint.includes("insulin-doses")) fetchEntityData("health/insulin-doses", setLevelsData, setLevelsMeta, levelsPage, searchTerm, filter)
      if (endpoint.includes("physical-activities")) fetchEntityData("health/physical-activities", setAnswersData, setAnswersMeta, answersPage, searchTerm, filter);


      if (endpoint.includes("meals")) fetchEntityData("health/meals", setMealsData, setMealsMeta, mealsPage, searchTerm, filter)
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
    setSelectedItem(item)
    setViewDialogLevelOpen(true)
  }
  const handleViewQuestion = (item) => {
    setSelectedItem(item)
    setViewDialogQuestionOpen(true)
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
    if (activeTab === "blood-sugar-readings") endpoint = "health/blood-sugar-readings"
    if (activeTab === "physical-activities") endpoint = "health/physical-activities"
    if (activeTab === "insulin-doses") endpoint = "health/insulin-doses"
    if (activeTab === "meals") endpoint = "health/meals"
    handleDeleteEntity(endpoint, selectedItem?.id)
    setDeleteDialogOpen(false)
  }

  // مثال لمعالجة حفظ التعديلات (تستخدم في Dialog الخاص بالتعديل)
  const handleSaveItem = (updatedItem) => {
    let endpoint = ""
    if (activeTab === "blood-sugar-readings") endpoint = "health/blood-sugar-readings"
    if (activeTab === "insulin-doses") endpoint = "health/insulin-doses"
    if (activeTab === "physical-activities") endpoint = "health/physical-activities"
    if (activeTab === "meals") endpoint = "health/meals"
    handleUpdateEntity(endpoint, updatedItem)
    // setEditDialogOpen(false)
  }

  // pagination controls بسيطة

  // if (gamesData.length <=0) {
  //   return <
  // }
  // if (loading) {
  //   return <div className="space-y-6"><Spinner size="xl" variant="secondary" /> </div>
  // }
  const truncateText = (text, wordLimit = 5) => {
    if (!text) return ""; // إذا كان النص فارغًا، لا تعرض أي شيء
    const words = text.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + " ..." : text;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-3xl mb-2 font-bold"> سجل الحالة الصحية</h2>
        <div className="">
          {activeTab === "blood-sugar-readings" && (
            <Dialog open={isAddGameOpen} onOpenChange={setIsAddGameOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#ffac33] hover:bg-[#f59f00] w-full sm:w-auto">
                  <Plus className="h-4 w-4 ml-2" />
                  <span className="hidden sm:inline">إضافة قراءة سكر الدم جديدة</span>
                  <span className="sm:hidden">إضافة</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>إضافة بيانات قراءة سكر الدم جديدة</DialogTitle>
                  <DialogDescription>أدخل بيانات قراءة سكر الدم الجديدة هنا. اضغط على حفظ عند الانتهاء.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient_id">الطفل</Label>
                    <Select name="patient_id"
                      value={selectedGameId}
                      onValueChange={(value) => setSelectedGameId(value)}
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
                  <div className="space-y-2">
                    <Label htmlFor="measurement_type"> نوع القياس</Label>
                    <Select name="measurement_type"
                      value={selectedQuestionType}
                      onValueChange={(value) => setSelectedQuestionType(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر نوع  القياس" />
                      </SelectTrigger>
                      <SelectContent>
                        {measurementTypes.map((game, idx) => (
                          <SelectItem key={idx} value={game.name.toString()}>
                            {game.name_ar}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value"> القيمة</Label>
                    <Input id="value" type="number" placeholder="أدخل  القيمة" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit"> وحدة القياس</Label>
                    <Select name="unit"
                      value={selectedUnit}
                      onValueChange={(value) => setSelectedUnit(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر وحدة  القياس" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((game, idx) => (
                          <SelectItem key={idx} value={game.name.toString()}>
                            {game.name_ar}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="measured_at">تقاس في </Label>
                    <Input
                      id="measured_at"
                      type="datetime-local"
                    // value={editedTask.dueDate || ""}
                    // onChange={(e) => handleChange("dueDate", e.target.value)}
                    />
                  </div>
                  {/* إدخال اللون */}

                  <div className="space-y-2">
                    <Label htmlFor="notes"> ملاحظات </Label>
                    <Input
                      id="notes"
                      type="text"
                    // value={editedTask.dueDate || ""}
                    // onChange={(e) => handleChange("dueDate", e.target.value)}
                    />
                  </div>

                </div>
                <DialogFooter>
                  <Button style={{ marginInline: "1rem" }} variant="outline" onClick={() => setIsAddGameOpen(false)}>
                    إلغاء
                  </Button>
                  <Button
                    className="bg-[#ffac33] mx-4 hover:bg-[#f59f00]"
                    onClick={() => {
                      const measuredAtInput = typeof document !== 'undefined' && document.getElementById("measured_at").value;
                      const formattedMeasuredAt = measuredAtInput.replace("T", " ") + ":00";

                      const newGame = {
                        value: typeof document !== 'undefined' && document.getElementById("value").value,
                        notes: typeof document !== 'undefined' && document.getElementById("notes").value,
                        measured_at: formattedMeasuredAt,
                        measurement_type: selectedQuestionType,
                        unit: selectedUnit, // تحويل الحالة إلى 1 أو 0
                        patient_id: selectedGameId
                      };


                      handleAddEntity("health/blood-sugar-readings", newGame,);
                    }}
                  >
                    حفظ
                  </Button>

                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {activeTab === "insulin-doses" && (
            <Dialog open={isAddLevelOpen} onOpenChange={setIsAddLevelOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#ffac33] hover:bg-[#f59f00] w-full sm:w-auto">
                  <Plus className="h-4 w-4 ml-2" />
                  <span className="hidden sm:inline">إضافة جرعات الأنسولين جديدة</span>
                  <span className="sm:hidden">إضافة</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>إضافة جرعات الأنسولين جديدة</DialogTitle>
                  <DialogDescription>أدخل جرعات الأنسولين الجديدة هنا. اضغط على حفظ عند الانتهاء.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient_id">الطفل</Label>
                    <Select name="patient_id"
                      value={selectedGameId}
                      onValueChange={(value) => setSelectedGameId(value)}
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
                  <div className="space-y-2">
                    <Label htmlFor="taken_date">تاريخ الاخذ  </Label>
                    <Input
                      id="taken_date"
                      type="date"
                    // value={editedTask.dueDate || ""}
                    // onChange={(e) => handleChange("dueDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taken_time">وقت الأخذ</Label>
                    <Select name="taken_time"
                      value={selectedQuestionType}
                      onValueChange={(value) => setSelectedQuestionType(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر وقت الأخذ  " />
                      </SelectTrigger>
                      <SelectContent>
                        {takenTime.map((game, idx) => (
                          <SelectItem key={idx} value={game.name.toString()}>
                            {game.name_ar}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insulin_type"> نوع الأنسولين</Label>
                    <Input id="insulin_type" type="text" placeholder="أدخل  نوع الأنسولين" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dose_units"> وحدات الجرعة</Label>
                    <Input id="dose_units" type="number" placeholder="أدخل  وحدات الجرعة" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="injection_site"> موقع الحقن </Label>
                    <Select name="injection_site"
                      value={selectedUnit}
                      onValueChange={(value) => setSelectedUnit(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر موقع الحقن  " />
                      </SelectTrigger>
                      <SelectContent>
                        {injectionSites.map((game, idx) => (
                          <SelectItem key={idx} value={game.name.toString()}>
                            {game.name_ar}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>



                </div>
                <DialogFooter>
                  <Button style={{ marginInline: "1rem" }} variant="outline" onClick={() => setIsAddLevelOpen(false)}>
                    إلغاء
                  </Button>
                  <Button
                    className="bg-[#ffac33] mx-4 hover:bg-[#f59f00]"
                    onClick={() => {

                      const newGame = {
                        dose_units: typeof document !== 'undefined' && document.getElementById("dose_units").value,
                        insulin_type: typeof document !== 'undefined' && document.getElementById("insulin_type").value,
                        taken_date: typeof document !== 'undefined' && document.getElementById("taken_date").value,
                        injection_site: selectedUnit,
                        patient_id: selectedGameId,
                        taken_time: selectedQuestionType
                      };


                      handleAddEntity("health/insulin-doses", newGame,);
                    }}
                  >
                    حفظ
                  </Button>

                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {activeTab === "physical-activities" && (
            <Dialog open={isAddQuestionOpen} onOpenChange={setIsAddQuestionOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#ffac33] hover:bg-[#f59f00] w-full sm:w-auto">
                  <Plus className="h-4 w-4 ml-2" />
                  <span className="hidden sm:inline">إضافة أنشطة بدنية جديدة</span>
                  <span className="sm:hidden">إضافة</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>إضافة أنشطة بدنية جديدة</DialogTitle>
                  <DialogDescription>أدخل الأنشطة البدنية الجديدة هنا. اضغط على حفظ عند الانتهاء.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient_id">الطفل</Label>
                    <Select name="patient_id"
                      value={selectedGameId}
                      onValueChange={(value) => setSelectedGameId(value)}
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
                  <div className="space-y-2">
                    <Label htmlFor="activity_date">تاريخ النشاط  </Label>
                    <Input
                      id="activity_date"
                      type="date"
                    // value={editedTask.dueDate || ""}
                    // onChange={(e) => handleChange("dueDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="activity_time">وقت النشاط</Label>
                    <Select name="activity_time"
                      value={selectedQuestionType}
                      onValueChange={(value) => setSelectedQuestionType(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر وقت النشاط  " />
                      </SelectTrigger>
                      <SelectContent>
                        {activityTime.map((game, idx) => (
                          <SelectItem key={idx} value={game.name.toString()}>
                            {game.name_ar}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description"> وصف </Label>
                    <Input id="description" placeholder="أدخل وصف" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="intensity">  الشدة </Label>
                    <Select name="intensity"
                      value={selectedUnit}
                      onValueChange={(value) => setSelectedUnit(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر الشدة   " />
                      </SelectTrigger>
                      <SelectContent>
                        {intensity.map((game, idx) => (
                          <SelectItem key={idx} value={game.name.toString()}>
                            {game.name_ar}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration"> مدة </Label>
                    <Input id="duration" type="number" placeholder="أدخل مدة" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes"> ملاحظات </Label>
                    <Textarea id="notes" placeholder="أدخل ملاحظات" />
                  </div>

                </div>
                <DialogFooter>
                  <Button style={{ marginInline: "1rem" }} variant="outline" onClick={() => setIsAddQuestionOpen(false)}>
                    إلغاء
                  </Button>
                  <Button
                    className="bg-[#ffac33] mx-4 hover:bg-[#f59f00]"
                    onClick={() => {

                      const newGame = {
                        activity_date: typeof document !== 'undefined' && document.getElementById("activity_date").value,
                        description: typeof document !== 'undefined' && document.getElementById("description").value,
                        duration: typeof document !== 'undefined' && document.getElementById("duration").value,
                        notes: typeof document !== 'undefined' && document.getElementById("notes").value,
                        patient_id: selectedGameId,

                        intensity: selectedUnit,
                        activity_time: selectedQuestionType
                      };


                      handleAddEntity("health/physical-activities", newGame,);
                    }}
                  >
                    حفظ
                  </Button>

                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {activeTab === "meals" && (
            <Dialog open={isAddAnswerOpen} onOpenChange={setIsAddAnswerOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#ffac33] hover:bg-[#f59f00] w-full sm:w-auto">
                  <Plus className="h-4 w-4 ml-2" />
                  <span className="hidden sm:inline">إضافة وجبات جديدة</span>
                  <span className="sm:hidden">إضافة</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>إضافة وجبات جديدة</DialogTitle>
                  <DialogDescription>أدخل وجبات الجديدة هنا. اضغط على حفظ عند الانتهاء.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient_id">الطفل</Label>
                    <Select name="patient_id"
                      value={selectedGameId}
                      onValueChange={(value) => setSelectedGameId(value)}
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
                  <div className="space-y-2">
                    <Label htmlFor="activity_date">تاريخ الاستهلاك  </Label>
                    <Input
                      id="consumed_date"
                      type="date"
                    // value={editedTask.dueDate || ""}
                    // onChange={(e) => handleChange("dueDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">نوع الوجبة</Label>
                    <Select name="type"
                      value={selectedQuestionType}
                      onValueChange={(value) => setSelectedQuestionType(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر نوع الوجبة  " />
                      </SelectTrigger>
                      <SelectContent>
                        {typeMeals.map((game, idx) => (
                          <SelectItem key={idx} value={game.name.toString()}>
                            {game.name_ar}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carbohydrates_calories"> السعرات الحرارية الكربوهيدرات </Label>
                    <Input id="carbohydrates_calories" placeholder="أدخل السعرات الحرارية الكربوهيدرات" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description"> الوصف </Label>
                    <Textarea id="description" placeholder="أدخل الوصف" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes"> ملاحظات </Label>
                    <Textarea id="notes" placeholder="أدخل ملاحظات" />
                  </div>

                </div>
                <DialogFooter>
                  <Button style={{ marginInline: "1rem" }} variant="outline" onClick={() => setIsAddAnswerOpen(false)}>
                    إلغاء
                  </Button>
                  <Button
                    className="bg-[#ffac33] mx-4 hover:bg-[#f59f00]"
                    onClick={() => {

                      const newGame = {
                        consumed_date: typeof document !== 'undefined' && document.getElementById("consumed_date").value,
                        carbohydrates_calories: typeof document !== 'undefined' && document.getElementById("carbohydrates_calories").value,
                        description: typeof document !== 'undefined' && document.getElementById("description").value,
                        notes: typeof document !== 'undefined' && document.getElementById("notes").value,

                        patient_id: selectedGameId,

                        type: selectedQuestionType
                      };


                      handleAddEntity("health/meals", newGame,);
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


      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
      </div> */}


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

        <div>
          <AsyncSelect
            cacheOptions
            // className="mt-2"
            className="min-w-64"

            defaultOptions={defaultOptions}
            value={defaultOptions.find(option => option.value === filter.patient_id)} // Set the value to be the object
            loadOptions={loadOptions}
            onChange={(selectedOption) => {
              console.log(selectedOption);

              // Only store the value part and update the filter
              setFilter((prev) => ({
                ...prev,
                patient_id: selectedOption ? selectedOption.value : null, // Save only the value
              }));
            }}
            placeholder="اختر الطفل"
            isClearable
          />
        </div>

        {/* <div className="space-y-2 " style={{ width: "10rem" }}>
          <Select name="game_id"
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
        </div> */}
        <Button variant="outline" onClick={() => setFilter(initialFilter)}>
          مسح الكل
        </Button>

      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex w-full" style={{ justifyContent: "space-evenly" }}>
          <TabsTrigger className="flex-1" value="blood-sugar-readings">قراءات سكر الدم</TabsTrigger>
          <TabsTrigger className="flex-1" value="insulin-doses">جرعات الأنسولين</TabsTrigger>
          <TabsTrigger className="flex-1" value="physical-activities">الأنشطة البدنية</TabsTrigger>
          <TabsTrigger className="flex-1" value="meals">وجبات</TabsTrigger>
        </TabsList>

        {/* جدول الألعاب */}
        <TabsContent value="blood-sugar-readings">
          <Card>
            <CardHeader>
              <CardTitle>قراءات سكر الدم</CardTitle>
              <CardDescription>إدارة قراءات سكر الدم في النظام</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المعرف </TableHead>

                      <TableHead>صورة الطفل</TableHead>

                      <TableHead>اسم الطفل</TableHead>

                      <TableHead>نوع القياس</TableHead>
                      <TableHead> القيمة</TableHead>
                      <TableHead>الوحدة</TableHead>
                      {/* <TableHead>ملاحظات</TableHead> */}
                      <TableHead>تقاس في</TableHead>
                      {/* <TableHead>الوحدة</TableHead> */}

                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      !filter.patient_id ? <>

                        <TableRow>
                          <TableCell className="text-center" colSpan={6}>
                            <span>
                              قم بإختيار طفل لعرض النتائج
                            </span>
                          </TableCell>

                        </TableRow>
                      </> :

                        gamesData.length == 0 && <>
                          <TableRow>
                            <TableCell className="text-center " colSpan={6}>
                              <div className="flex w-full align-middle justify-center">
                                <Lottie animationData={animationData} loop={true} style={{ width: 100, height: 100 }} />
                              </div>
                            </TableCell>
                          </TableRow>

                        </>}
                    {gamesData.map((game) => (
                      <TableRow key={game.id}>
                        <TableCell>
                          {game.id}
                        </TableCell>
                        <TableCell>
                          <img src={game.patient.user.avatar || "/placeholder.svg"} className="rounded-lg h-10 w-10 object-cover  m-auto" />
                        </TableCell>
                        <TableCell className="font-medium">{game.patient.user.first_name + " " + game.patient.user.last_name}</TableCell>
                        <TableCell>
                          {measurementTypes.find((item) => item.name === game.measurement_type)?.name_ar || game.measurement_type}
                        </TableCell>
                        <TableCell>
                          {game.value}
                        </TableCell>
                        <TableCell>
                          {units.find((item) => item.name === game.unit)?.name_ar || game.unit}
                        </TableCell>

                        {/* <TableCell>
                          {game.notes}
                        </TableCell> */}
                        <TableCell>
                          {new Date(game.measured_at).toLocaleString("EN-ca")}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse justify-center">
                            {/* <Button variant="ghost" size="icon" onClick={() => handleViewItem(game)}>
                              <Eye className="h-4 w-4" />
                            </Button> */}
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
        <TabsContent value="insulin-doses">
          <Card>
            <CardHeader>
              <CardTitle>جرعات الأنسولين</CardTitle>
              <CardDescription>إدارة جرعات الأنسولين</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell>المعرف</TableCell>
                      <TableHead>صورة الطفل</TableHead>

                      <TableHead>اسم الطفل</TableHead>
                      <TableHead>تاريخ الأخذ</TableHead>
                      <TableHead> وقت الأخذ</TableHead>
                      <TableHead>نوع الأنسولين</TableHead>
                      <TableHead>وحدات الجرعة </TableHead>
                      <TableHead>موقع الحقن</TableHead>
                      <TableHead>الإجراءات</TableHead>

                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      !filter.patient_id ? <>

                        <TableRow>
                          <TableCell className="text-center" colSpan={6}>
                            <span>
                              قم بإختيار طفل لعرض النتائج
                            </span>
                          </TableCell>

                        </TableRow>
                      </> :

                        levelsData.length == 0 && <>
                          <TableRow>
                            <TableCell className="text-center " colSpan={6}>
                              <div className="flex w-full align-middle justify-center">
                                <Lottie animationData={animationData} loop={true} style={{ width: 100, height: 100 }} />
                              </div>
                            </TableCell>
                          </TableRow>

                        </>}
                    {levelsData.map((level) => (
                      <TableRow key={level.id}>
                        <TableCell className="text-center">{level.id}</TableCell>
                        <TableCell>
                          <img src={level.patient.user.avatar || "/placeholder.svg"} className="rounded-lg h-10 w-10 object-cover  m-auto" />
                        </TableCell>
                        <TableCell className="font-medium">{level.patient.user.first_name + " " + level.patient.user.last_name}</TableCell>
                        <TableCell>{level.taken_date}</TableCell>
                        <TableCell>
                          {takenTime.find((item) => item.name === level.taken_time)?.name_ar || level.taken_time}
                        </TableCell>
                        <TableCell>
                          {level.insulin_type} {/* لا توجد قائمة مترجمة، اتركه كما هو أو أضف مصفوفة ترجمة إذا لزم الأمر */}
                        </TableCell>
                        <TableCell>
                          {units.find((item) => item.name === level.dose_units)?.name_ar || level.dose_units}
                        </TableCell>
                        <TableCell>
                          {injectionSites.find((item) => item.name === level.injection_site)?.name_ar || level.injection_site}
                        </TableCell>


                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse justify-center">
                            {/* <Button variant="ghost" size="icon" onClick={() => handleViewLevel(level)}>
                            <Eye className="h-4 w-4" />
                          </Button> */}
                            <Button variant="ghost" size="icon" onClick={() => handleViewItem(level)}>
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


        {/* جدول الأجوبة */}
        <TabsContent value="physical-activities">
          <Card>
            <CardHeader>
              <CardTitle>الأنشطة البدنية</CardTitle>
              <CardDescription>إدارة الأنشطة البدنية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell>المعرف</TableCell>
                      <TableHead>صورة الطفل</TableHead>

                      <TableHead>اسم الطفل</TableHead>
                      <TableHead>تاريخ النشاط</TableHead>
                      <TableHead>وقت النشاط</TableHead>
                      <TableHead>وصف</TableHead>
                      <TableHead>الشدة</TableHead>
                      <TableHead>المدة</TableHead>

                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      !filter.patient_id ? <>

                        <TableRow>
                          <TableCell className="text-center" colSpan={6}>
                            <span>
                              قم بإختيار طفل لعرض النتائج
                            </span>
                          </TableCell>

                        </TableRow>
                      </> :

                        answersData.length == 0 && <>
                          <TableRow>
                            <TableCell className="text-center " colSpan={6}>
                              <div className="flex w-full align-middle justify-center">
                                <Lottie animationData={animationData} loop={true} style={{ width: 100, height: 100 }} />
                              </div>
                            </TableCell>
                          </TableRow>

                        </>}
                    {answersData.map((answer) => (
                      <TableRow key={answer.id}>
                        <TableCell>{answer.id}</TableCell>
                        <TableCell>
                          <img src={answer.patient.user.avatar || "/placeholder.svg"} className="rounded-lg h-10 w-10 object-cover  m-auto" />
                        </TableCell>
                        <TableCell className="font-medium">{answer.patient.user.first_name + " " + answer.patient.user.last_name}</TableCell>
                        <TableCell>{answer.activity_date}</TableCell>
                        <TableCell>{answer.activity_time}</TableCell>

                        <TableCell>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="p-2"> {truncateText(answer.description)}</button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[400px] text-wrap" side="top">
                                {answer.description}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          {intensity.find((item) => item.name === answer.intensity)?.name_ar || answer.intensity}
                        </TableCell>
                        <TableCell>{answer.duration}</TableCell>

                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse justify-center">
                            {/*  <Button variant="ghost" size="icon" onClick={() => handleViewItem(answer)}>
                              <Eye className="h-4 w-4" />
                            </Button> */}
                            <Button variant="ghost" size="icon" onClick={() => handleViewLevel(answer)}>
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
        <TabsContent value="meals">
          <Card>
            <CardHeader>
              <CardTitle> وجبات</CardTitle>
              <CardDescription>إدارة الوجبات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell>المعرف</TableCell>
                      <TableHead>صورة الطفل</TableHead>

                      <TableHead className="text-nowrap">اسم الطفل</TableHead>
                      <TableHead className="text-nowrap">تاريخ الاستهلاك</TableHead>
                      <TableHead className="text-nowrap">نوع الوجبة</TableHead>
                      <TableHead className="text-nowrap">
                        السعرات الحرارية
                      </TableHead>
                      <TableHead>الوصف</TableHead>
                      <TableHead>الملاحظات</TableHead>

                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      !filter.patient_id ? <>

                        <TableRow>
                          <TableCell className="text-center" colSpan={6}>
                            <span>
                              قم بإختيار طفل لعرض النتائج
                            </span>
                          </TableCell>

                        </TableRow>
                      </> :

                        mealsData.length == 0 && <>
                          <TableRow>
                            <TableCell className="text-center " colSpan={6}>
                              <div className="flex w-full align-middle justify-center">
                                <Lottie animationData={animationData} loop={true} style={{ width: 100, height: 100 }} />
                              </div>
                            </TableCell>
                          </TableRow>

                        </>}
                    {mealsData.map((answer) => (
                      <TableRow key={answer.id}>
                        <TableCell>{answer.id}</TableCell>
                        <TableCell>
                          <img src={answer.patient.user.avatar || "/placeholder.svg"} className="rounded-lg h-10 w-10 object-cover  m-auto" />
                        </TableCell>
                        <TableCell className="font-medium text-nowrap">{answer.patient.user.first_name + " " + answer.patient.user.last_name}</TableCell>
                        <TableCell className="text-nowrap">{answer.consumed_date}</TableCell>
                        <TableCell className="text-nowrap">
                          {typeMeals.find((item) => item.name === answer.type)?.name_ar || answer.type}
                        </TableCell>

                        <TableCell className="text-nowrap">{answer.carbohydrates_calories}</TableCell>
                        <TableCell className="text-nowrap">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="p-2"> {truncateText(answer.description)}</button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[400px] text-wrap" side="top">
                                {answer.description}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-nowrap">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="p-2"> {truncateText(answer.notes)}</button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[400px] text-wrap" side="top">
                                {answer.notes}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                        </TableCell>


                        <TableCell>
                          <div className="flex   space-x-2 space-x-reverse">
                            {/*       <Button variant="ghost" size="icon" onClick={() => handleViewItem(answer)}>
                              <Eye className="h-4 w-4" />
                            </Button> */}
                            <Button variant="ghost" size="icon" onClick={() => handleViewQuestion(answer)}>
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
      <InsulinDosesDialog insulinDose={selectedItem} open={viewDialogOpen} onOpenChange={setViewDialogOpen}
        onSave={handleSaveItem}

      />
      <PhysicalActivitiesDialog activity={selectedItem} open={viewDialogLevelOpen} onOpenChange={setViewDialogLevelOpen}
        onSave={handleSaveItem}

      />
      <MealsDialog meal={selectedItem} open={viewDialogQuestionOpen} onOpenChange={setViewDialogQuestionOpen}
        onSave={handleSaveItem}

      />

      <BloodSugarReadingsEditDialog
        game={selectedItem}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveItem}
      />

      <DeleteConfirmationDialog
        title="حذف العنصر"
        description={`هل أنت متأكد من حذف العنصر ؟ هذا الإجراء لا يمكن التراجع عنه.`}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </div >
  )
}

