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

export function ContentEditDialog({ game, open, onOpenChange, onSave, handleAddEntity }) {
  // If editing an existing game, load its data; otherwise, use default values.
  // console.log(game);

  const initialForm = {
    title: game?.title || "",
    link: game?.link || "",
    duration: game?.duration || "",
    is_visible: game ? Boolean(game.is_enable) : false,
  }
  const [form, setForm] = useState(initialForm)
  const [isLoading, setIsLoading] = useState(false)
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
  const embedUrl = getYouTubeEmbedUrl(form.link) || getVimeoEmbedUrl(form.link);
  // Update form state if the passed game changes (for edit mode)
  useEffect(() => {
    if (game) {
      setForm({
        title: game?.title || "",
        link: game?.link || "",
        duration: game?.duration || "",
        is_visible: game ? Boolean(game.is_enable) : false,
      })
    } else {
      setForm(initialForm)
    }
  }, [game])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }
  const [isEnabled, setIsEnabled] = useState(game?.is_visible);


  const handleSubmit = () => {
    setIsLoading(true)
    // Construct newGame object from form state.
    const newGame = {
      title: form?.title,
      link: form?.link,
      duration: form?.duration,
      is_visible: isEnabled ? 1 : 0,
      // image: form.image
    }
    // console.log("newGame", newGame);

    // Pass the form data along with the image file (if any)
    onSave(newGame)
    onOpenChange(false)
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {game ? "تعديل الفديو" : "إضافة لعبة جديدة"}
          </DialogTitle>
          <DialogDescription>
            {game
              ? "قم بتعديل بيانات اللعبة هنا."
              : "أدخل بيانات اللعبة الجديدة هنا. اضغط على حفظ عند الانتهاء."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان الفديو </Label>
            <Input id="title" value={form.title} placeholder="أدخل عنوان الفديو" onChange={(e) => handleChange("title", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link">رابط الفديو </Label>
            <Input id="link" value={form.link} onClick={(e) => onChange("link", e.target.value)}
              placeholder="أدخل رابط الفديو" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">مدة الفديو </Label>
            <Input typeof="number" value={form.duration} min={0} id="duration" placeholder="أدخل مدة الفديو" type="number" onChange={(e) => handleChange("duration", e.target.value)} />

          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="is_visible" >قابلية الظهور</Label>
            <div className="flex align-middle justify-center">
              <span className="mx-2">{isEnabled ? "منشور" : "مسودة"}</span>
              <Switch id="is_visible" value={form.is_visible} color="primary" checked={isEnabled} onCheckedChange={setIsEnabled} />
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
          <Button
            style={{ marginInline: "1rem" }}
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            إلغاء
          </Button>
          <Button
            className="bg-[#ffac33] mx-4 hover:bg-[#f59f00]"
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
