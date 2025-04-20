"use client"

import { useState } from "react"
import { Activity, Users, Calendar, AlertTriangle, CheckCircle, Clock, Award, BarChart3, Heart, MessageCircle, BookOpen, User, UserCheck, Stethoscope, CheckSquare, Bell, GamepadIcon, TrendingUp, CalendarClock, MessageSquare, ClipboardList } from 'lucide-react'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"

// Mock data for charts
const dailyTasksData = [
    { day: "السبت", count: 45 },
    { day: "الأحد", count: 52 },
    { day: "الاثنين", count: 48 },
    { day: "الثلاثاء", count: 61 },
    { day: "الأربعاء", count: 55 },
    { day: "الخميس", count: 67 },
    { day: "الجمعة", count: 50 },
]

const userActivityData = [
    { day: "السبت", active: 120 },
    { day: "الأحد", active: 132 },
    { day: "الاثنين", active: 101 },
    { day: "الثلاثاء", active: 134 },
    { day: "الأربعاء", active: 90 },
    { day: "الخميس", active: 130 },
    { day: "الجمعة", active: 120 },
]

const statusData = [
    { name: "مستقرة", value: 65 },
    { name: "تحتاج متابعة", value: 25 },
    { name: "طارئة", value: 10 },
]

const COLORS = ["#0088FE", "#FFBB28", "#FF8042"]

export default function Dashboard() {
    const [dateRange, setDateRange] = useState("week")

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 rtl">
            <div className="flex flex-col">
                <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                    <div className="flex flex-1 items-center gap-4 md:gap-6">
                        <div className="flex items-center gap-2">
                            <Heart className="h-6 w-6 text-rose-500" />
                            <h1 className="text-xl font-semibold">نظام عسول الصحي</h1>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                            <Select value={dateRange} onValueChange={setDateRange}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="اختر الفترة الزمنية" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="day">اليوم</SelectItem>
                                    <SelectItem value="week">آخر أسبوع</SelectItem>
                                    <SelectItem value="month">آخر شهر</SelectItem>
                                    <SelectItem value="year">آخر سنة</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" size="sm">
                                تحديث
                            </Button>
                        </div>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    إجمالي المستخدمين
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">1,248</div>
                                <p className="text-xs text-muted-foreground">
                                    +20% عن الشهر الماضي
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    الأطفال المسجلين
                                </CardTitle>
                                <User className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">624</div>
                                <p className="text-xs text-muted-foreground">
                                    +12% عن الشهر الماضي
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    الأهالي المسجلين
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">512</div>
                                <p className="text-xs text-muted-foreground">
                                    +8% عن الشهر الماضي
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    الأطباء المسجلين
                                </CardTitle>
                                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">112</div>
                                <p className="text-xs text-muted-foreground">
                                    +5% عن الشهر الماضي
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Tabs defaultValue="general" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="general">إحصاءات عامة</TabsTrigger>
                            <TabsTrigger value="usage">تحليلات الاستخدام</TabsTrigger>
                            <TabsTrigger value="medical">مؤشرات طبية</TabsTrigger>
                            <TabsTrigger value="interaction">بيانات التفاعل</TabsTrigger>
                        </TabsList>

                        <TabsContent value="general" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            الأطفال النشطين (آخر 7 أيام)
                                        </CardTitle>
                                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">412</div>
                                        <p className="text-xs text-muted-foreground">
                                            66% من إجمالي الأطفالفال
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            المهام المكتملة يومياً
                                        </CardTitle>
                                        <CheckSquare className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">328</div>
                                        <p className="text-xs text-muted-foreground">
                                            +15% عن المتوسط
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            حالات الطوارئ المسجلة
                                        </CardTitle>
                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">24</div>
                                        <p className="text-xs text-muted-foreground">
                                            -5% عن الشهر الماضي
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>


                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                                <Card className="col-span-1">
                                    <CardHeader>
                                        <CardTitle>توزيع الحجوزات حسب الحالة</CardTitle>
                                        <CardDescription>مستقرة، تحتاج متابعة، طارئة</CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-2">
                                        <div className="h-80 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={statusData}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={true}
                                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                    >
                                                        {statusData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Card className="col-span-1">
                                    <CardHeader>
                                        <CardTitle>المهام المكتملة يومياً</CardTitle>
                                        <CardDescription>قياس، حقن، وغيرها</CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-2">
                                        <div className="h-80 w-full">
                                            <ChartContainer
                                                config={{
                                                    count: {
                                                        label: "عدد المهام",
                                                        color: "hsl(var(--chart-1))",
                                                    },
                                                }}
                                            >
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={dailyTasksData}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="day" />
                                                        <YAxis />
                                                        <ChartTooltip content={<ChartTooltipContent />} />
                                                        <Bar dataKey="count" fill="var(--color-count)" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </ChartContainer>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="col-span-1">
                                    <CardHeader>
                                        <CardTitle>نشاط المستخدمين</CardTitle>
                                        <CardDescription>عدد المستخدمين النشطين يومياً</CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-2">
                                        <div className="h-80 w-full">
                                            <ChartContainer
                                                config={{
                                                    active: {
                                                        label: "المستخدمين النشطين",
                                                        color: "hsl(var(--chart-2))",
                                                    },
                                                }}
                                            >
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={userActivityData}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="day" />
                                                        <YAxis />
                                                        <ChartTooltip content={<ChartTooltipContent />} />
                                                        <Line type="monotone" dataKey="active" stroke="var(--color-active)" strokeWidth={2} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </ChartContainer>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="usage" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            متوسط القراءات اليومية
                                        </CardTitle>
                                        <Activity className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">3.8</div>
                                        <p className="text-xs text-muted-foreground">
                                            لكل طفل نشط
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            التنبيهات المفعلة
                                        </CardTitle>
                                        <Bell className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">1,248</div>
                                        <p className="text-xs text-muted-foreground">
                                            2 لكل طفل في المتوسط
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            معدل الالتزام بالمهام
                                        </CardTitle>
                                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">78%</div>
                                        <Progress value={78} className="mt-2" />
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            النقاط الموزعة
                                        </CardTitle>
                                        <Award className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">24,892</div>
                                        <p className="text-xs text-muted-foreground">
                                            +12% عن الأسبوع الماضي
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>أكثر الألعاب التعليمية استخداماً</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center">
                                                <GamepadIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">لعبة تعلم الجرعات</p>
                                                </div>
                                                <div className="mr-auto font-medium">1,248 مستخدم</div>
                                            </div>
                                            <div className="flex items-center">
                                                <GamepadIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">تحدي القياسات</p>
                                                </div>
                                                <div className="mr-auto font-medium">982 مستخدم</div>
                                            </div>
                                            <div className="flex items-center">
                                                <GamepadIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">رحلة الغذاء الصحي</p>
                                                </div>
                                                <div className="mr-auto font-medium">876 مستخدم</div>
                                            </div>
                                            <div className="flex items-center">
                                                <GamepadIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">مغامرة الأنسولين</p>
                                                </div>
                                                <div className="mr-auto font-medium">654 مستخدم</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>نسبة الأطفال بحسب الانتظام</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-8">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm font-medium">
                                                        5+ أيام متتالية
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        42%
                                                    </div>
                                                </div>
                                                <Progress value={42} className="h-2" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm font-medium">
                                                        3-4 أيام متتالية
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        28%
                                                    </div>
                                                </div>
                                                <Progress value={28} className="h-2" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm font-medium">
                                                        1-2 أيام متتالية
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        18%
                                                    </div>
                                                </div>
                                                <Progress value={18} className="h-2" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm font-medium">
                                                        غير منتظمين
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        12%
                                                    </div>
                                                </div>
                                                <Progress value={12} className="h-2" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="medical" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            قراءات غير طبيعية متكررة
                                        </CardTitle>
                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">48</div>
                                        <p className="text-xs text-muted-foreground">
                                            طفل سجلوا 3+ قراءات غير طبيعية متتالية
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            أطفال بدون قراءات أسبوعية
                                        </CardTitle>
                                        <Clock className="h-4 w-4 text-amber-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">87</div>
                                        <p className="text-xs text-muted-foreground">
                                            14% من إجمالي الأطفال
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            تنبيهات أنماط غير طبيعية
                                        </CardTitle>
                                        <Bell className="h-4 w-4 text-red-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">156</div>
                                        <p className="text-xs text-muted-foreground">
                                            خلال الأسبوع الماضي
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>الحالات التي تحتاج متابعة عاجلة</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center">
                                                <AlertTriangle className="ml-2 h-4 w-4 text-red-500" />
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">أحمد محمد</p>
                                                    <p className="text-sm text-muted-foreground">3 قراءات مرتفعة متتالية</p>
                                                </div>
                                                <Button variant="outline" size="sm" className="mr-auto">
                                                    عرض السجل
                                                </Button>
                                            </div>
                                            <div className="flex items-center">
                                                <AlertTriangle className="ml-2 h-4 w-4 text-red-500" />
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">سارة خالد</p>
                                                    <p className="text-sm text-muted-foreground">قراءات منخفضة متكررة</p>
                                                </div>
                                                <Button variant="outline" size="sm" className="mr-auto">
                                                    عرض السجل
                                                </Button>
                                            </div>
                                            <div className="flex items-center">
                                                <AlertTriangle className="ml-2 h-4 w-4 text-amber-500" />
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">عمر أحمد</p>
                                                    <p className="text-sm text-muted-foreground">عدم انتظام في القراءات</p>
                                                </div>
                                                <Button variant="outline" size="sm" className="mr-auto">
                                                    عرض السجل
                                                </Button>
                                            </div>
                                            <div className="flex items-center">
                                                <AlertTriangle className="ml-2 h-4 w-4 text-amber-500" />
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">ليلى سعيد</p>
                                                    <p className="text-sm text-muted-foreground">لم تسجل قراءات لمدة 5 أيام</p>
                                                </div>
                                                <Button variant="outline" size="sm" className="mr-auto">
                                                    عرض السجل
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>توزيع الحالات حسب المنطقة</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center">
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">الرياض</p>
                                                </div>
                                                <div className="mr-auto font-medium">187 طفل</div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">جدة</p>
                                                </div>
                                                <div className="mr-auto font-medium">156 طفل</div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">الدمام</p>
                                                </div>
                                                <div className="mr-auto font-medium">98 طفل</div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">المدينة المنورة</p>
                                                </div>
                                                <div className="mr-auto font-medium">76 طفل</div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">مناطق أخرى</p>
                                                </div>
                                                <div className="mr-auto font-medium">107 طفل</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="interaction" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            ملاحظات الأهالي
                                        </CardTitle>
                                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">328</div>
                                        <p className="text-xs text-muted-foreground">
                                            خلال الشهر الحالي
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            المواعيد المحجوزة
                                        </CardTitle>
                                        <CalendarClock className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">156</div>
                                        <p className="text-xs text-muted-foreground">
                                            خلال الأسبوع القادم
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            التوصيات الطبية
                                        </CardTitle>
                                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">243</div>
                                        <p className="text-xs text-muted-foreground">
                                            من الأطباء للأهالي
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>آخر التفاعلات</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center">
                                                <MessageSquare className="ml-2 h-4 w-4 text-muted-foreground" />
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">د. محمد علي</p>
                                                    <p className="text-sm text-muted-foreground">أضاف توصية طبية لـ أحمد خالد</p>
                                                </div>
                                                <div className="mr-auto text-sm text-muted-foreground">منذ 35 دقيقة</div>
                                            </div>
                                            <div className="flex items-center">
                                                <CalendarClock className="ml-2 h-4 w-4 text-muted-foreground" />
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">سارة أحمد</p>
                                                    <p className="text-sm text-muted-foreground">حجزت موعد مع د. خالد</p>
                                                </div>
                                                <div className="mr-auto text-sm text-muted-foreground">منذ ساعة</div>
                                            </div>
                                            <div className="flex items-center">
                                                <MessageCircle className="ml-2 h-4 w-4 text-muted-foreground" />
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">فاطمة محمد</p>
                                                    <p className="text-sm text-muted-foreground">أضافت ملاحظة لسجل ابنها</p>
                                                </div>
                                                <div className="mr-auto text-sm text-muted-foreground">منذ 3 ساعات</div>
                                            </div>
                                            <div className="flex items-center">
                                                <Bell className="ml-2 h-4 w-4 text-muted-foreground" />
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">نظام عسول</p>
                                                    <p className="text-sm text-muted-foreground">أرسل تنبيه لـ 12 طفل</p>
                                                </div>
                                                <div className="mr-auto text-sm text-muted-foreground">منذ 5 ساعات</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>معدل الاستجابة للتوصيات</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-8">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm font-medium">
                                                        استجابة فورية (خلال 24 ساعة)
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        68%
                                                    </div>
                                                </div>
                                                <Progress value={68} className="h-2" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm font-medium">
                                                        استجابة متوسطة (2-3 أيام)
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        22%
                                                    </div>
                                                </div>
                                                <Progress value={22} className="h-2" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm font-medium">
                                                        استجابة متأخرة (أكثر من 3 أيام)
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        7%
                                                    </div>
                                                </div>
                                                <Progress value={7} className="h-2" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm font-medium">
                                                        لم يتم الاستجابة
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        3%
                                                    </div>
                                                </div>
                                                <Progress value={3} className="h-2" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div >
    )
}
