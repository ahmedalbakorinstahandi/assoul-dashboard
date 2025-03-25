export const units = [
    { id: 1, name: "mg/dL", name_ar: "ملجم/ديسيلتر" },
    { id: 2, name: "mmol/L", name_ar: "مليمول/لتر" },
];

export const injectionSites = [
    { id: 1, name: "arm", name_ar: "ذراع" },
    { id: 2, name: "thigh", name_ar: "فخذ" },
    { id: 3, name: "abdomen", name_ar: "بطن" },
    { id: 4, name: "lower_back", name_ar: "أسفل الظهر" },
];

export const takenTime = [
    { id: 1, name: "befor_breakfast_2h", name_ar: "قبل الإفطار بساعتين" },
    { id: 2, name: "befor_lunch_2h", name_ar: "قبل الغداء بساعتين" },
    { id: 3, name: "befor_dinner_2h", name_ar: "قبل العشاء بساعتين" },
];

export const measurementTypes = [
    { id: 1, name: "fasting", name_ar: "صيام" },
    { id: 2, name: "befor_breakfast", name_ar: "قبل الإفطار" },
    { id: 3, name: "befor_lunch", name_ar: "قبل الغداء" },
    { id: 4, name: "befor_dinner", name_ar: "قبل العشاء" },
    { id: 5, name: "after_snack", name_ar: "بعد الوجبة الخفيفة" },
    { id: 6, name: "after_breakfast", name_ar: "بعد الإفطار" },
    { id: 7, name: "after_lunch", name_ar: "بعد الغداء" },
    { id: 8, name: "after_dinner", name_ar: "بعد العشاء" },
    { id: 9, name: "befor_activity", name_ar: "قبل النشاط" },
    { id: 10, name: "after_activity", name_ar: "بعد النشاط" },
];

export const activityTime = [
    { id: 1, name: "6-8", name_ar: "6-8 صباحًا" },
    { id: 2, name: "8-10", name_ar: "8-10 صباحًا" },
    { id: 3, name: "10-12", name_ar: "10-12 ظهرًا" },
    { id: 4, name: "12-14", name_ar: "12-2 ظهرًا" },
    { id: 5, name: "14-16", name_ar: "2-4 عصرًا" },
    { id: 6, name: "16-18", name_ar: "4-6 مساءً" },
    { id: 7, name: "18-20", name_ar: "6-8 مساءً" },
    { id: 8, name: "20-22", name_ar: "8-10 مساءً" },
];

export const intensity = [
    { id: 1, name: "low", name_ar: "منخفض" },
    { id: 2, name: "moderate", name_ar: "متوسط" },
    { id: 3, name: "high", name_ar: "عالي" },
];

export const typeMeals = [
    { id: 1, name: "breakfast", name_ar: "إفطار" },
    { id: 2, name: "lunch", name_ar: "غداء" },
    { id: 3, name: "dinner", name_ar: "عشاء" },
    { id: 4, name: "snack", name_ar: "وجبة خفيفة" },
];

export const statusUser = [
    { id: 1, name: "Active", name_ar: "نشط" },
    { id: 2, name: "Pending", name_ar: "معلق" },
    { id: 3, name: "Banned", name_ar: "محظور" },
];

export const patientStatus = [
    { id: 1, name: "emergency", name_ar: "حالة طارئة" },
    { id: 2, name: "needs_follow_up", name_ar: "يحتاج متابعة" },
    { id: 3, name: "stable", name_ar: "مستقر" },
];

export const statusAppointment = [
    { id: 1, name: "pending", name_ar: "معلق" },
    { id: 2, name: "confirmed", name_ar: "مؤكد" },
    { id: 3, name: "cancelled", name_ar: "ملغى" },
    { id: 4, name: "completed", name_ar: "مكتمل" },
];