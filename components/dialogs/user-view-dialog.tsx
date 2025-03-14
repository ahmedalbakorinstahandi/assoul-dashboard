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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

interface UserViewDialogProps {
  user: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserViewDialog({ user, open, onOpenChange }: UserViewDialogProps) {
  if (!user) return null

  const isParent = user.childrenCount !== undefined
  const isDoctor = user.specialty !== undefined
  const isChild = user.age !== undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>عرض بيانات المستخدم</DialogTitle>
          <DialogDescription>عرض تفاصيل بيانات المستخدم {user.name}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-[#ffac33] flex items-center justify-center text-white text-xl">
              {user.name?.charAt(0) || "م"}
            </div>
            <div>
              <h3 className="text-lg font-bold">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-sm text-gray-500">الاسم</Label>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">البريد الإلكتروني</Label>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">رقم الهاتف</Label>
              <p className="font-medium">{user.phone}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">الحالة</Label>
              <p>
                <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">{user.status}</span>
              </p>
            </div>

            {isParent && (
              <div>
                <Label className="text-sm text-gray-500">عدد الأطفال</Label>
                <p className="font-medium">{user.childrenCount}</p>
              </div>
            )}

            {isDoctor && (
              <div>
                <Label className="text-sm text-gray-500">التخصص</Label>
                <p className="font-medium">{user.specialty}</p>
              </div>
            )}

            {isChild && (
              <>
                <div>
                  <Label className="text-sm text-gray-500">العمر</Label>
                  <p className="font-medium">{user.age} سنوات</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">ولي الأمر</Label>
                  <p className="font-medium">{user.parent}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">نوع السكري</Label>
                  <p className="font-medium">{user.diabetesType}</p>
                </div>
              </>
            )}
          </div>

          {isChild && (
            <Tabs defaultValue="readings">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="readings">قراءات السكر</TabsTrigger>
                <TabsTrigger value="tasks">المهام</TabsTrigger>
              </TabsList>
              <TabsContent value="readings">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-gray-500 py-4">آخر 5 قراءات للسكر</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                        <span>120 mg/dL</span>
                        <span className="text-sm text-gray-500">2023-06-15 08:30</span>
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">طبيعي</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                        <span>180 mg/dL</span>
                        <span className="text-sm text-gray-500">2023-06-15 12:45</span>
                        <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">مرتفع</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                        <span>95 mg/dL</span>
                        <span className="text-sm text-gray-500">2023-06-14 18:20</span>
                        <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">منخفض</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="tasks">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-gray-500 py-4">المهام المخصصة للطفل</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                        <span>لعب مستوى جديد من لعبة يلا نختار الصح</span>
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">مكتمل</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                        <span>قراءة قصة عن السكري</span>
                        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">قيد التنفيذ</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
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

