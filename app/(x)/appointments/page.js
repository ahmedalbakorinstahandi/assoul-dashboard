import dynamic from "next/dynamic";

// استيراد مكون AppointmentsManagement ديناميكيًا
const AppointmentsManagement = dynamic(() => import('@/components/appointments-management'), {
  ssr: false // تعطيل التوليد المسبق (SSR)
});

export default function Page() {
  return <AppointmentsManagement />;
}
