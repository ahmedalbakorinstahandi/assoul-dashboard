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
import toast from "react-hot-toast"
import { postData } from "@/lib/apiHelper"

export function SystemTasksEditDialog({ game, open, onOpenChange, onSave, handleAddEntity }) {
  // If editing an existing game, load its data; otherwise, use default values.
  const initialForm = {
    title: game?.title || "",
    points: game?.points || "",
    color: game?.color || "#000000",
    image: null,
  }
  const [form, setForm] = useState(initialForm)
  const [imagePreview, setImagePreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [imageLink, setImageLink] = useState("");

  // Update form state if the passed game changes (for edit mode)
  useEffect(() => {
    if (game) {
      setForm({
        title: game?.title || "",
        points: game?.points || "",
        color: game?.color || "#000000",
        image: null,
      })
      setImagePreview(game.image || null)
    } else {
      setForm(initialForm)
      setImagePreview(null)
    }
  }, [game])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
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
    // Construct newGame object from form state.
    const newGame = {
      title: form?.title || "",
      points: form?.points || "",
      color: form?.color || "#000000",
      // image: null,
      // image: form.image
    }
    if (form.image) {
      newGame.image = form.image
    }
    // Pass the form data along with the image file (if any)
    onSave(newGame, form.image)
    onOpenChange(false)
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {game ? "تعديل مهمة عسول" : "إضافة لعبة جديدة"}
          </DialogTitle>
          <DialogDescription>
            {game
              ? "قم بتعديل بيانات مهمة عسول هنا."
              : "أدخل بيانات اللعبة الجديدة هنا. اضغط على حفظ عند الانتهاء."}
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="title">عنوان مهمة عسول</Label>
            <Input
              id="title"
              required
              placeholder="أدخل عنوان مهمة عسول"

              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          
          {/* Color Picker */}
          <div className="space-y-2">
            <Label htmlFor="color">لون مهمة عسول</Label>
            <Input
              id="color"
              type="color"
              value={form.color}
              onChange={(e) => handleChange("color", e.target.value)}
              className="w-full h-10 p-1 border border-gray-300 rounded"
            />
          </div>
          {/* Order Input */}
          <div className="space-y-2">
            <Label htmlFor="points"> نقاط مهمة عسول</Label>
            <Input
              id="points"
              placeholder="أدخل نقاط مهمة عسول"
              value={form.points}
              type="number"
              min={0}
              onChange={(e) => handleChange("points", e.target.value)}
            />
          </div>
          {/* Image Input */}
          <div className="space-y-2">
            <Label htmlFor="image">صورة مهمة عسول</Label>
            <Input
              id="image"
              type="file"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-[100px] w-[100px] object-cover rounded border border-gray-300"
              />
            )}
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
              type="submit"
              className="bg-[#ffac33] mx-4 hover:bg-[#f59f00]"
              disabled={isLoading}
            >
              {isLoading ? "جاري الحفظ..." : "حفظ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
