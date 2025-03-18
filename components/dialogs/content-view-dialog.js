"use client"

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
import { ExternalLink } from "lucide-react"


export function ContentViewDialog({ content, open, onOpenChange }) {
  if (!content) return null

  const isArticle = content.author !== undefined
  const isVideo = content.duration !== undefined
  const isImage = content.dimensions !== undefined
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
  const embedUrl = getYouTubeEmbedUrl(content.link) || getVimeoEmbedUrl(content.link);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]" style={{ maxWidth: "800px" }}>
        <DialogHeader>
          <DialogTitle>عرض بيانات المحتوى</DialogTitle>
          <DialogDescription>عرض تفاصيل المحتوى {content.title}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-lg bg-[#ffac33] flex items-center justify-center text-white text-xl">
              {isArticle ? "مـ" : isVideo ? "فـ" : "صـ"}
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">{content.title}</h3>
              <p className="text-sm text-gray-500">{getStatusBadge(content.is_visible)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-sm text-gray-500">العنوان</Label>
              <p className="font-medium">{content.title}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">رابط الفديو</Label>
              <p className="font-medium">
                <a href={content.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-500 hover:underline">
                  {content.link.slice(0, 30)}...
                  <ExternalLink size={18} />
                </a>

              </p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">تاريخ النشر</Label>
              <p className="font-medium">{new Date(content.created_at).toLocaleDateString("EN-ca")}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">الحالة</Label>
              <p>{getStatusBadge(content.is_visible)}</p>
            </div>

            {isArticle && (
              <div>
                <Label className="text-sm text-gray-500">الكاتب</Label>
                <p className="font-medium">{content.author}</p>
              </div>
            )}

            {isVideo && (
              <div>
                <Label className="text-sm text-gray-500">المدة</Label>
                <p className="font-medium">{content.duration} دقيقة</p>
              </div>
            )}

            {isImage && (
              <div>
                <Label className="text-sm text-gray-500">الأبعاد</Label>
                <p className="font-medium">{content.dimensions}</p>
              </div>
            )}
          </div>
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
          {/* <div className="mt-6 border-t pt-4">
            <Label className="text-sm text-gray-500 mb-2 block">
              {isArticle ? "مقتطف من المقال" : isVideo ? "وصف الفيديو" : "وصف الصورة"}
            </Label>
            <p className="text-sm">
              {isArticle
                ? "هذا مقتطف من محتوى المقال التعليمي المتعلق بمرض السكري للأطفال..."
                : isVideo
                  ? "هذا الفيديو يشرح بطريقة مبسطة كيفية التعامل مع السكري..."
                  : "هذه الصورة توضيحية تظهر أنواع الطعام المناسبة لمرضى السكري..."}
            </p>
          </div> */}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

