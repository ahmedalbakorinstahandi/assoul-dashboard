// ClientAppointments.js
"use client";
import dynamic from 'next/dynamic';

const AppointmentsManagement = dynamic(
  () => import('@/components/appointments-management'),
  { ssr: false }
);

export default function ClientAppointments() {
  return <AppointmentsManagement />;
}
