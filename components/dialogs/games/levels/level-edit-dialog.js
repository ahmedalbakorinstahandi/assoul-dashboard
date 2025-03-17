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
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getData } from "@/lib/apiHelper"

export function LevelDialog({ level, open, onOpenChange, onSave }) {
  // Define initial state; if editing an existing level, load its values, else use defaults
  const initialForm = {
    game_id: level?.game_id ? level.game_id.toString() : "",
    title: level?.title || "",
    number: level?.number || "",
    status: level ? level.status === "published" : false,
  }

  const [form, setForm] = useState(initialForm)
  const [isLoading, setIsLoading] = useState(false)
  const [gamesIds, setGamesIds] = useState([])

  // Update form state when the level prop changes (for editing an existing level)
  useEffect(() => {
    if (level) {
      setForm({
        game_id: level.game_id ? level.game_id.toString() : "",
        title: level.title || "",
        number: level.number || "",
        status: level.status === "published",
      })
    } else {
      setForm(initialForm)
    }
  }, [level])

  // Fetch the list of games for the game select field
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await getData("games/games")
        setGamesIds(response.data)
      } catch (error) {
        console.error("Error fetching games:", error)
      }
    }
    fetchGames()
  }, [])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    setIsLoading(true)
    const newLevel = {
      game_id: form.game_id,
      title: form.title,
      number: form.number,
      status: form.status ? "published" : "pending",
    }
    onSave(newLevel)
    onOpenChange(false)
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{level ? "تعديل المستوى" : "إضافة مستوى جديد"}</DialogTitle>
          <DialogDescription>
            {level
              ? "قم بتعديل بيانات المستوى هنا."
              : "أدخل بيانات المستوى الجديد هنا. اضغط على حفظ عند الانتهاء."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Game Select */}
          <div className="space-y-2">
            <Label htmlFor="game_id">اللعبة</Label>
            <Select
              disabled

              name="game_id"
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

          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">اسم المستوى</Label>
            <Input
              id="title"
              placeholder="أدخل اسم المستوى"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          {/* Number Input */}
          <div className="space-y-2">
            <Label htmlFor="number">رقم المستوى</Label>
            <Input
              id="number"
              type="number"
              placeholder="اختر مستوى الصعوبة"
              value={form.number}
              onChange={(e) => handleChange("number", e.target.value)}
            />
          </div>

          {/* Status Switch */}
          <div className="flex items-center justify-between">
            <Label htmlFor="status">حالة المستوى</Label>
            <Switch
              id="status"
              color="primary"
              checked={form.status}
              onCheckedChange={(checked) => handleChange("status", checked)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            style={{ marginInline: "1rem" }}
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
