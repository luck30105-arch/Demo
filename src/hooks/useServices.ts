import { useEffect, useState } from 'react';
import type { Service } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchServices() {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (cancelled) return;

      if (error) {
        setError(error.message);
      } else {
        setServices(data as Service[]);
      }
      setLoading(false);
    }

    fetchServices();
    return () => {
      cancelled = true;
    };
  }, []);

  return { services, loading, error };
}

export function useAllServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchServices() {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true });

      if (cancelled) return;

      if (error) {
        setError(error.message);
      } else {
        setServices(data as Service[]);
      }
      setLoading(false);
    }

    fetchServices();
    return () => {
      cancelled = true;
    };
  }, []);

  return { services, loading, error, setServices };
}
