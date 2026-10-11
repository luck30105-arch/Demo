import { useState } from 'react';
import { Calendar, Scissors, Clock, TrendingUp } from 'lucide-react';
import AppointmentList from './AppointmentList';
import ServiceManager from './ServiceManager';
import { useAppointments } from '@/hooks/useAppointments';

type Tab = 'appointments' | 'services';

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>('appointments');
  const { appointments, loading } = useAppointments();

  const today = new Date().toISOString().split('T')[0];
  const todayCount = appointments.filter(
    (a) => a.requested_date === today && a.status !== 'cancelled'
  ).length;
  const pendingCount = appointments.filter((a) => a.status === 'pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;

  const stats = [
    {
      label: "Today's Appointments",
      value: loading ? '—' : todayCount,
      icon: Calendar,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Pending Requests',
      value: loading ? '—' : pendingCount,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Confirmed',
      value: loading ? '—' : confirmedCount,
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white">
            <Scissors className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Owner Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Manage appointments and services in one place.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5"
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-1 rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setTab('appointments')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === 'appointments'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Calendar className="h-4 w-4" />
            Appointments
          </button>
          <button
            onClick={() => setTab('services')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === 'services'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Scissors className="h-4 w-4" />
            Services
          </button>
        </div>

        <div className="mt-6">
          {tab === 'appointments' ? <AppointmentList /> : <ServiceManager />}
        </div>
      </div>
    </div>
  );
}
