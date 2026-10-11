import { useEffect, useState } from 'react';
import type { Appointment, AppointmentStatus } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAppointments() {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select('*, service:services(*)')
        .order('requested_date', { ascending: false })
        .order('requested_time', { ascending: false });

      if (cancelled) return;

      if (error) {
        setError(error.message);
      } else {
        setAppointments(data as Appointment[]);
      }
      setLoading(false);
    }

    fetchAppointments();
    return () => {
      cancelled = true;
    };
  }, []);

  async function updateStatus(id: string, status: AppointmentStatus) {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);

    if (error) throw error;

    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  }

  async function deleteAppointment(id: string) {
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) throw error;
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  }

  return {
    appointments,
    loading,
    error,
    updateStatus,
    deleteAppointment,
    refresh: () => setAppointments((prev) => [...prev]),
  };
}
