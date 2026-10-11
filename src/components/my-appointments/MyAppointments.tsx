import { useState } from 'react';
import {
  Search,
  Phone,
  Calendar,
  Clock,
  Loader2,
  ClipboardList,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { statusConfig } from '@/lib/salon-config';
import { navigate } from '@/hooks/useRouter';
import type { Appointment } from '@/lib/types';

export default function MyAppointments() {
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = phone.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    const { data, error } = await supabase
      .from('appointments')
      .select('*, service:services(*)')
      .ilike('customer_phone', `%${trimmed}%`)
      .order('requested_date', { ascending: false })
      .order('requested_time', { ascending: false });

    setLoading(false);

    if (error) {
      setError('Something went wrong. Please try again.');
    } else {
      setAppointments(data as Appointment[]);
    }
  }

  const upcoming = appointments.filter(
    (a) => a.status === 'pending' || a.status === 'confirmed'
  );
  const past = appointments.filter(
    (a) => a.status === 'completed' || a.status === 'cancelled'
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            My Appointments
          </h1>
          <p className="mt-2 text-gray-600">
            Enter the phone number you used to book and we'll look up your appointments.
          </p>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="mx-auto mt-8 flex max-w-md gap-2"
        >
          <div className="relative flex-1">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              placeholder="Your phone number"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Search
          </button>
        </form>

        {/* Results */}
        {searched && !loading && !error && appointments.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 py-16 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-gray-500">
              No appointments found for that phone number.
            </p>
            <button
              onClick={() => navigate('book')}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Book an Appointment
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-lg bg-rose-50 px-4 py-3 text-center text-sm text-rose-700">
            {error}
          </div>
        )}

        {!loading && !error && appointments.length > 0 && (
          <div className="mt-8 space-y-8">
            {upcoming.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Upcoming ({upcoming.length})
                </h2>
                <div className="space-y-3">
                  {upcoming.map((apt) => (
                    <AppointmentRow key={apt.id} appointment={apt} />
                  ))}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  History ({past.length})
                </h2>
                <div className="space-y-3">
                  {past.map((apt) => (
                    <AppointmentRow key={apt.id} appointment={apt} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AppointmentRow({ appointment }: { appointment: Appointment }) {
  const status = statusConfig[appointment.status];
  const serviceName = appointment.service?.name ?? 'Unknown service';

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300">
      <div className="flex items-center gap-4">
        <div className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${status.dot}`} />
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">{serviceName}</h3>
            <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${status.badge}`}>
              {status.label}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(appointment.requested_date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {formatTime(appointment.requested_time)}
            </span>
          </div>
          {appointment.notes && (
            <p className="mt-1 text-xs text-gray-400">"{appointment.notes}"</p>
          )}
        </div>
      </div>
      <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-300" />
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
