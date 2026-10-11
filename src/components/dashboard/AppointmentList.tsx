import { useState } from 'react';
import {
  Calendar,
  Clock,
  Check,
  X,
  Phone,
  Mail,
  Trash2,
  Loader2,
  ChevronDown,
  User,
  MessageSquare,
} from 'lucide-react';
import { useAppointments } from '@/hooks/useAppointments';
import { statusConfig } from '@/lib/salon-config';
import type { Appointment, AppointmentStatus } from '@/lib/types';

type Filter = 'all' | AppointmentStatus;

export default function AppointmentList() {
  const { appointments, loading, error, updateStatus, deleteAppointment } = useAppointments();
  const [filter, setFilter] = useState<Filter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);

  const counts = {
    all: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  };

  async function handleStatusChange(id: string, status: AppointmentStatus) {
    try {
      await updateStatus(id, status);
    } catch {
      // silently fail — error is already surfaced by the hook not updating
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteAppointment(id);
      setExpandedId(null);
    } catch {
      // ignore
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading appointments…
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center text-rose-600">
        Could not load appointments. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === f.key
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {f.label}
            <span
              className={`rounded-full px-1.5 text-xs ${
                filter === f.key ? 'bg-white/20' : 'bg-gray-100'
              }`}
            >
              {counts[f.key]}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 py-16 text-center">
          <Calendar className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-gray-500">No appointments in this category.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              expanded={expandedId === apt.id}
              onToggle={() => setExpandedId(expandedId === apt.id ? null : apt.id)}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface AppointmentCardProps {
  appointment: Appointment;
  expanded: boolean;
  onToggle: () => void;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onDelete: (id: string) => void;
}

function AppointmentCard({
  appointment,
  expanded,
  onToggle,
  onStatusChange,
  onDelete,
}: AppointmentCardProps) {
  const status = statusConfig[appointment.status];
  const serviceName = appointment.service?.name ?? 'Unknown service';

  return (
    <div className="rounded-xl border border-gray-200 bg-white transition-all hover:border-gray-300">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`h-2.5 w-2.5 rounded-full ${status.dot}`} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900">{appointment.customer_name}</h3>
              <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${status.badge}`}>
                {status.label}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              {serviceName} · {formatDate(appointment.requested_date)} at {formatTime(appointment.requested_time)}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {expanded && (
        <div className="border-t border-gray-100 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Phone className="h-4 w-4 text-gray-400" />
              <a href={`tel:${appointment.customer_phone}`} className="hover:text-gray-900">
                {appointment.customer_phone}
              </a>
            </div>
            {appointment.customer_email && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Mail className="h-4 w-4 text-gray-400" />
                <a href={`mailto:${appointment.customer_email}`} className="hover:text-gray-900">
                  {appointment.customer_email}
                </a>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <User className="h-4 w-4 text-gray-400" />
              {serviceName}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock className="h-4 w-4 text-gray-400" />
              {appointment.service?.duration_minutes ?? 30} min
            </div>
          </div>

          {appointment.notes && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
              <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
              {appointment.notes}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {appointment.status !== 'confirmed' && (
              <button
                onClick={() => onStatusChange(appointment.id, 'confirmed')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
              >
                <Check className="h-3.5 w-3.5" />
                Confirm
              </button>
            )}
            {appointment.status !== 'completed' && (
              <button
                onClick={() => onStatusChange(appointment.id, 'completed')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
              >
                <Check className="h-3.5 w-3.5" />
                Mark Completed
              </button>
            )}
            {appointment.status !== 'cancelled' && (
              <button
                onClick={() => onStatusChange(appointment.id, 'cancelled')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>
            )}
            <button
              onClick={() => onDelete(appointment.id)}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${m} ${ampm}`;
}
