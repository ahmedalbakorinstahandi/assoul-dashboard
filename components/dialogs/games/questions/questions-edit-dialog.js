"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { postData } from "@/lib/apiHelper"

export function QuestionDialog({ question, open, onOpenChange, onSave, gamesIds, levelsIds, typQuestions, viewQuestions }) {
  // Initial form state: if editing an existing question, load its values; otherwise, use defaults.
  const initialForm = {
    game_id: question?.game_id ? question.game_id.toString() : "",
    level_id: question?.level_id ? question.level_id.toString() : "",
    points: question?.points || "",
    text: question?.text || "",
    type: question?.type || "",
    answers_view: question?.answers_view || "",
    image: null,
  }
  const [form, setForm] = useState(initialForm)
  const [imagePreview, setImagePreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [imageLink, setImageLink] = useState("");

  // Update form state if the "question" prop changes (for editing)
  useEffect(() => {
    if (question) {
      setForm({
        game_id: question.game_id ? question.game_id.toString() : "",
        level_id: question.level_id ? question.level_id.toString() : "",
        points: question.points || "",
        text: question.text || "",
        type: question.type || "",
        answers_view: question.answers_view || "",
        image: null,
      })
      // Optionally, if the question has an image URL, set it as preview:
      setImagePreview(question.image || null)
    } else {
      setForm(initialForm)
      setImagePreview(null)
    }
  }, [question])

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const response = await postData("general/upload-image", { image: file, folder: `games` }, {});
      console.log("Upload response:", response);

      if (response.success) {
        // imageLink = response.data.image_name;
        setImageLink(response.data.image_name); // إضافة رابط الصورة إلى البيانات
        console.log(response.data.image_name);

        handleChange("image", response.data.image_name)

      } else {
        toast.error("فشل رفع الصورة");
        return;
      }
      setImagePreview(URL.createObjectURL(file)); // Generate preview URL
    } else {
      setImagePreview(null)
    }
  }

  const handleSubmit = () => {
    setIsLoading(true)
    const newQuestion = {
      game_id: form.game_id,
      level_id: form.level_id,
      points: form.points,
      text: form.text,
      type: form.type,
      answers_view: form.answers_view,
    }
    if (form.image) {
      newQuestion.image = form.image
    }
    onSave(newQuestion, form.image)
    onOpenChange(false)
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{question ? "تعديل السؤال" : "إضافة سؤال جديد"}</DialogTitle>
          <DialogDescription>
            {question
              ? "قم بتعديل بيانات السؤال هنا."
              : "أدخل بيانات السؤال الجديد هنا. اضغط على حفظ عند الانتهاء."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Game Select */}
          <div className="space-y-2">
            <Label htmlFor="game_id">اللعبة</Label>
            <Select
              name="game_id"
              value={form.game_id}
              disabled

              onValueChange={(value) => handleChange("game_id", value)}
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

          {/* Level Select */}
          <div className="space-y-2">
            <Label htmlFor="level_id">المستوى</Label>
            <Select
              disabled

              name="level_id"
              value={form.level_id}
              onValueChange={(value) => handleChange("level_id", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر المستوى" />
              </SelectTrigger>
              <SelectContent>
                {levelsIds.map((level, idx) => (
                  <SelectItem key={idx} value={level.id.toString()}>
                    {level.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Points Input */}
          <div className="space-y-2">
            <Label htmlFor="points">نقاط السؤال</Label>
            <Input
              id="points"
              type="number"
              placeholder="ادخل نقاط السؤال"
              min={0}
              value={form.points}
              onChange={(e) => handleChange("points", e.target.value)}
            />
          </div>

          {/* Question Type Select */}
          <div className="space-y-2">
            <Label htmlFor="type">نوع السؤال</Label>
            <Select
              name="type"
              value={form.type}
              onValueChange={(value) => handleChange("type", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر نوع السؤال" />
              </SelectTrigger>
              <SelectContent>
                {typQuestions.map((item, idx) => (
                  <SelectItem key={idx} value={item.name.toString()}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Question View Select */}
          <div className="space-y-2">
            <Label htmlFor="answers_view">عرض السؤال</Label>
            <Select
              name="answers_view"
              value={form.answers_view}
              onValueChange={(value) => handleChange("answers_view", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر عرض السؤال" />
              </SelectTrigger>
              <SelectContent>
                {viewQuestions.map((item, idx) => (
                  <SelectItem key={idx} value={item.name.toString()}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Text Area for Question Text */}
          <div className="space-y-2">
            <Label htmlFor="text">نص السؤال</Label>
            <Textarea
              id="text"
              placeholder="أدخل نص السؤال"
              value={form.text}
              onChange={(e) => handleChange("text", e.target.value)}
            />
          </div>

          {/* Image Input */}
          <div className="space-y-2">
            <Label htmlFor="image">صورة السؤال</Label>
            <Input id="image" type="file" onChange={handleImageChange} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-[100px] w-[100px] object-cover rounded border border-gray-300"
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            style={{ marginInline: "1rem" }}
            variant="outline"
            type="button"

            onClick={() => onOpenChange(false)}
          >
            إلغاء
          </Button>
          <Button
            className="bg-[#ffac33] hover:bg-[#f59f00]"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "جاري الحفظ..." : "حفظ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
