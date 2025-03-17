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
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { postData } from "@/lib/apiHelper"

export function AnswerDialog({
  answer,
  open,
  onOpenChange,
  onSave,
  gamesIds,
  levelsIds,
  questionsIds,
}) {
  // Initial state: if editing, prefill with answer data; otherwise, defaults.
  const initialForm = {
    game_id: answer?.question?.level.game_id ? answer.question.level.game_id.toString() : "",
    level_id: answer?.question?.level_id ? answer.question.level_id.toString() : "",
    question_id: answer?.question_id ? answer.question_id.toString() : "",
    text: answer?.text || "",
    is_correct: answer ? Boolean(answer.is_correct) : false,
    image: null,
  }
  console.log(answer);

  const [form, setForm] = useState(initialForm)
  const [imagePreview, setImagePreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [imageLink, setImageLink] = useState("");

  // Update form when answer prop changes (for edit mode)
  useEffect(() => {
    if (answer) {
      setForm({
        game_id: answer?.question?.level.game_id ? answer.question.level.game_id.toString() : "",
        level_id: answer?.question?.level_id ? answer.question.level_id.toString() : "",
        question_id: answer?.question_id ? answer.question_id.toString() : "",
        text: answer.text || "",
        is_correct: Boolean(answer.is_correct),
        image: null,
      })
      setImagePreview(answer.image || null)
    } else {
      setForm(initialForm)
      setImagePreview(null)
    }
  }, [answer])

  // Handle field updates
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  // Handle file input change and preview update
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

  // Check the selected question's answers_view property to determine answer type.
  const selectedQuestion = questionsIds.find(
    (q) => q.id.toString() === form.question_id
  )
  const isTextAnswer = selectedQuestion?.answers_view === "text"

  const handleSubmit = () => {
    setIsLoading(true)
    const newAnswer = {
      game_id: form.game_id,
      level_id: form.level_id,
      question_id: form.question_id,
      is_correct: form.is_correct ? 1 : 0,
    }
    if (form.image) {
      newAnswer.image = form.image
    }
    // Include the answer text if it's a text answer.
    if (isTextAnswer) {
      newAnswer.text = form.text
      onSave(newAnswer)
    } else {
      // For non-text answers, pass the image file.
      onSave(newAnswer, form.image)
    }
    onOpenChange(false)
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {answer ? "تعديل جواب السؤال" : "إضافة جواب سؤال جديد"}
          </DialogTitle>
          <DialogDescription>
            {answer
              ? "قم بتعديل بيانات جواب السؤال هنا."
              : "أدخل بيانات جواب السؤال الجديد هنا. اضغط على حفظ عند الانتهاء."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Game Select */}
          <div className="space-y-2">
            <Label htmlFor="game_id">اللعبة</Label>
            <Select
              name="game_id"
              disabled
              value={form.game_id}
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

          {/* Question Select */}
          <div className="space-y-2">

            <Label htmlFor="question_id">السؤال</Label>
            <Select
              disabled

              name="question_id"
              value={form.question_id}
              onValueChange={(value) => handleChange("question_id", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر السؤال" />
              </SelectTrigger>
              <SelectContent>
                {questionsIds.map((question, idx) => (
                  <SelectItem key={idx} value={question.id.toString()}>
                    {question.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Conditional Rendering: Text or Image Answer */}
          {isTextAnswer ? (
            <div className="space-y-2">
              <Label htmlFor="text">جواب السؤال</Label>
              <Textarea
                id="text"
                placeholder="أدخل جواب السؤال"
                value={form.text}
                onChange={(e) => handleChange("text", e.target.value)}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="image">صورة جواب السؤال</Label>
              <Input id="image" type="file" onChange={handleImageChange} />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-[100px] w-[100px] object-cover rounded border border-gray-300"
                />
              )}
            </div>
          )}

          {/* Correct Answer Switch */}
          <div className="flex items-center justify-between">
            <Label htmlFor="is_correct">الجواب الصحيح</Label>
            <Switch
              id="is_correct"
              color="primary"
              checked={form.is_correct}
              onCheckedChange={(checked) => handleChange("is_correct", checked)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            style={{ marginInline: "1rem" }}
            variant="outline"
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
