export type ServiceCategory = 'men' | 'women' | 'unisex';

export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  duration_minutes: number;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  service_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  requested_date: string;
  requested_time: string;
  notes: string | null;
  status: AppointmentStatus;
  created_at: string;
  service?: Service;
}

export interface ServiceInput {
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  duration_minutes: number;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface AppointmentInput {
  service_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  requested_date: string;
  requested_time: string;
  notes: string | null;
}
