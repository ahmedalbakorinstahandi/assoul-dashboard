"use client";
import dynamic from 'next/dynamic';

const SafeAppointmentsManagement = dynamic(
  () => import('@/components/appointments-management'),
  { ssr: false }
);

export default function Page() {
  return <SafeAppointmentsManagement />;
}
