"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ArrowUpRight, ArrowDownRight, Users, Activity, GamepadIcon, BookOpen, CheckSquare, Calendar, Bell, Clock, ArrowRight } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isOpen, setIsOpen] = useState(false)

  // بيانات للرسوم البيانية
  const sugarReadingsData = [
    { day: "السبت", قراءة: 120, متوسط: 125 },
    { day: "الأحد", قراءة: 140, متوسط: 125 },
    { day: "الإثنين", قراءة: 110, متوسط: 125 },
    { day: "الثلاثاء", قراءة: 160, متوسط: 125 },
    { day: "الأربعاء", قراءة: 130, متوسط: 125 },
    { day: "الخميس", قراءة: 120, متوسط: 125 },
    { day: "الجمعة", قراءة: 125, متوسط: 125 },
  ]

  const usageData = [
    { month: "يناير", ألعاب: 65, محتوى: 45, مهام: 30 },
    { month: "فبراير", ألعاب: 70, محتوى: 50, مهام: 35 },
    { month: "مارس", ألعاب: 75, محتوى: 55, مهام: 40 },
    { month: "أبريل", ألعاب: 80, محتوى: 60, مهام: 45 },
    { month: "مايو", ألعاب: 85, محتوى: 65, مهام: 50 },
    { month: "يونيو", ألعاب: 90, محتوى: 70, مهام: 55 },
  ]

  // بيانات المهام
  const tasks = [
    {
      id: 1,
      title: "قياس مستوى السكر",
      dueDate: "اليوم",
      status: "pending",
      priority: "high",
      assignedTo: "ياسر"
    },
    {
      id: 2,
      title: "إكمال لعبة تعليمية",
      dueDate: "غداً",
      status: "in-progress",
      priority: "medium",
      assignedTo: "نورة"
    },
    {
      id: 3,
      title: "قراءة محتوى عن الأنسولين",
      dueDate: "بعد غد",
      status: "completed",
      priority: "low",
      assignedTo: "عمر"
    },
    {
      id: 4,
      title: "موعد مع الطبيب",
      dueDate: "الأسبوع القادم",
      status: "pending",
      priority: "high",
      assignedTo: "سارة"
    },
  ]

  // بيانات النشاطات الأخيرة
  const activities = [
    {
      id: 1,
      user: "ياسر",
      action: "أكمل لعبة",
      target: "رحلة الأنسولين",
      time: "منذ 10 دقائق",
      avatar: "/placeholder.svg?height=32&width=32"
    },
    {
      id: 2,
      user: "نورة",
      action: "سجلت قراءة سكر",
      target: "120 mg/dL",
      time: "منذ 30 دقيقة",
      avatar: "/placeholder.svg?height=32&width=32"
    },
    {
      id: 3,
      user: "عمر",
      action: "أكمل قراءة",
      target: "أساسيات السكري",
      time: "منذ ساعة",
      avatar: "/placeholder.svg?height=32&width=32"
    },
    {
      id: 4,
      user: "سارة",
      action: "أكملت مهمة",
      target: "قياس مستوى السكر",
      time: "منذ ساعتين",
      avatar: "/placeholder.svg?height=32&width=32"
    },
    {
      id: 5,
      user: "محمد",
      action: "حدد موعد",
      target: "زيارة الطبيب",
      time: "منذ 3 ساعات",
      avatar: "/placeholder.svg?height=32&width=32"
    },
  ]

  // بيانات الأطفال
  const children = [
    { id: 1, name: "ياسر", progress: 85, avatar: "/placeholder.svg?height=32&width=32" },
    { id: 2, name: "نورة", progress: 70, avatar: "/placeholder.svg?height=32&width=32" },
    { id: 3, name: "عمر", progress: 60, avatar: "/placeholder.svg?height=32&width=32" },
    { id: 4, name: "سارة", progress: 90, avatar: "/placeholder.svg?height=32&width=32" },
    { id: 5, name: "محمد", progress: 75, avatar: "/placeholder.svg?height=32&width=32" },
  ]

  // بيانات الإشعارات
  const notifications = [
    {
      id: 1,
      title: "تذكير بقياس السكر",
      time: "منذ 5 دقائق",
      read: false
    },
    {
      id: 2,
      title: "ياسر أكمل لعبة جديدة",
      time: "منذ ساعة",
      read: true
    },
    {
      id: 3,
      title: "موعد مع الطبيب غداً",
      time: "منذ 3 ساعات",
      read: false
    },
  ]

  return (


    <div className="space-y-6">


      <main className="grid gap-4 p-4 md:gap-8 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,500</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500">+12%</span>
                <span className="mr-1">مقارنة بالشهر الماضي</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">متوسط قراءات السكر</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">125 mg/dL</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowDownRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500">-5%</span>
                <span className="mr-1">مقارنة بالأسبوع الماضي</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">الألعاب المكتملة</CardTitle>
              <GamepadIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,240</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500">+18%</span>
                <span className="mr-1">مقارنة بالشهر الماضي</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">المهام المكتملة</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,825</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500">+8%</span>
                <span className="mr-1">مقارنة بالشهر الماضي</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>نشاط المنصة</CardTitle>
              <CardDescription>معدل استخدام الميزات المختلفة خلال الأشهر الستة الماضية</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer
                config={{
                  ألعاب: {
                    label: "الألعاب",
                    color: "hsl(var(--chart-1))",
                  },
                  محتوى: {
                    label: "المحتوى التعليمي",
                    color: "hsl(var(--chart-2))",
                  },
                  مهام: {
                    label: "المهام",
                    color: "hsl(var(--chart-3))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="ألعاب" fill="#ffac33" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="محتوى" fill="#4f4eff" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="مهام" fill="#ff7b9b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>متابعة قراءات السكر</CardTitle>
              <CardDescription>متوسط قراءات السكر خلال الأسبوع الماضي</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer
                config={{
                  قراءة: {
                    label: "قراءة السكر",
                    color: "hsl(var(--chart-1))",
                  },
                  متوسط: {
                    label: "المتوسط",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sugarReadingsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="قراءة"
                      stroke="var(--color-قراءة)"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="متوسط"
                      stroke="var(--color-متوسط)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle>المهام القادمة</CardTitle>
                                <Button variant="ghost" size="sm" className="text-xs">
                                    عرض الكل
                                    <ArrowRight className="h-4 w-4 mr-1" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="max-h-[300px] overflow-auto">
                            <div className="space-y-4">
                                {tasks.map((task) => (
                                    <div key={task.id} className="flex items-start gap-4 rounded-lg border p-3">
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium">{task.title}</h3>
                                                <Badge
                                                    variant={
                                                        task.status === 'completed' ? 'outline' :
                                                            task.priority === 'high' ? 'destructive' :
                                                                task.priority === 'medium' ? 'default' : 'secondary'
                                                    }
                                                    className="text-[10px]"
                                                >
                                                    {task.status === 'completed' ? 'مكتمل' :
                                                        task.priority === 'high' ? 'عالي' :
                                                            task.priority === 'medium' ? 'متوسط' : 'منخفض'}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3 mr-1" />
                                                <span>{task.dueDate}</span>
                                                <span className="mx-1">•</span>
                                                <span>تم تعيينه لـ {task.assignedTo}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle>النشاطات الأخيرة</CardTitle>
                                <Button variant="ghost" size="sm" className="text-xs">
                                    عرض الكل
                                    <ArrowRight className="h-4 w-4 mr-1" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="max-h-[300px] overflow-auto">
                            <div className="space-y-4">
                                {activities.map((activity) => (
                                    <div key={activity.id} className="flex items-center gap-4">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={activity.avatar} alt={activity.user} />
                                            <AvatarFallback>{activity.user[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                <span className="font-bold">{activity.user}</span> {activity.action} <span className="font-bold">{activity.target}</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle>تقدم الأطفال</CardTitle>
                                <Button variant="ghost" size="sm" className="text-xs">
                                    عرض الكل
                                    <ArrowRight className="h-4 w-4 mr-1" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="max-h-[300px] overflow-auto">
                            <div className="space-y-4">
                                {children.map((child) => (
                                    <div key={child.id} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={child.avatar} alt={child.name} />
                                                    <AvatarFallback>{child.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{child.name}</span>
                                            </div>
                                            <span className="text-sm">{child.progress}%</span>
                                        </div>
                                        <Progress value={child.progress} className="h-2" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>الإشعارات الأخيرة</CardTitle>
                            <CardDescription>آخر التنبيهات والإشعارات من النظام</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {notifications.map((notification) => (
                                    <div key={notification.id} className="flex items-start gap-4 rounded-lg border p-3">
                                        <div className={`mt-0.5 h-2 w-2 rounded-full ${notification.read ? 'bg-muted' : 'bg-[#ffac33]'}`} />
                                        <div className="flex-1 space-y-1">
                                            <p className="font-medium">{notification.title}</p>
                                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="h-4 w-4"
                                            >
                                                <circle cx="12" cy="12" r="1" />
                                                <circle cx="19" cy="12" r="1" />
                                                <circle cx="5" cy="12" r="1" />
                                            </svg>
                                            <span className="sr-only">القائمة</span>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>الأحداث القادمة</CardTitle>
                            <CardDescription>المواعيد والأحداث المهمة القادمة</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 rounded-lg border p-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ffac33]/20 text-[#ffac33]">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="font-medium">موعد مع الطبيب</p>
                                        <div className="flex items-center text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3 mr-1" />
                                            <span>غداً - 10:00 صباحاً</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 rounded-lg border p-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4f4eff]/20 text-[#4f4eff]">
                                        <GamepadIcon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="font-medium">مسابقة الألعاب التعليمية</p>
                                        <div className="flex items-center text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3 mr-1" />
                                            <span>الأحد القادم - 4:00 مساءً</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 rounded-lg border p-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff7b9b]/20 text-[#ff7b9b]">
                                        <BookOpen className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="font-medium">ورشة تعليمية للأطفال</p>
                                        <div className="flex items-center text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3 mr-1" />
                                            <span>الخميس القادم - 5:30 مساءً</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div> */}
      </main>
    </div>

  )
}
