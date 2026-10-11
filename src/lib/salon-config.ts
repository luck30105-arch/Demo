export const salonConfig = {
  name: 'Luxe & Blade',
  tagline: 'Where Style Meets Precision',
  description:
    'A premium salon offering expert haircuts, beard styling, hair spa treatments, coloring, and facials for everyone.',
  phone: '+91 98765 43210',
  whatsapp: '919876543210',
  email: 'hello@luxeandblade.com',
  address: '12 MG Road, Indiranagar, Bengaluru, Karnataka 560038',
  mapUrl: 'https://maps.google.com/?q=MG+Road+Indiranagar+Bengaluru',
  hours: [
    { day: 'Monday', time: '9:00 AM – 8:00 PM' },
    { day: 'Tuesday', time: '9:00 AM – 8:00 PM' },
    { day: 'Wednesday', time: '9:00 AM – 8:00 PM' },
    { day: 'Thursday', time: '9:00 AM – 8:00 PM' },
    { day: 'Friday', time: '9:00 AM – 9:00 PM' },
    { day: 'Saturday', time: '8:00 AM – 9:00 PM' },
    { day: 'Sunday', time: '9:00 AM – 6:00 PM' },
  ],
  socials: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
  },
};

export const heroImage =
  'https://images.pexels.com/photos/7195805/pexels-photo-7195805.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export const galleryImages = [
  {
    url: 'https://images.pexels.com/photos/7195806/pexels-photo-7195806.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Reception area',
  },
  {
    url: 'https://images.pexels.com/photos/7195821/pexels-photo-7195821.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Wash stations',
  },
  {
    url: 'https://images.pexels.com/photos/7518721/pexels-photo-7518721.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Barbershop interior',
  },
  {
    url: 'https://images.pexels.com/photos/13138585/pexels-photo-13138585.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Men haircut',
  },
  {
    url: 'https://images.pexels.com/photos/8834042/pexels-photo-8834042.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Hair wash treatment',
  },
  {
    url: 'https://images.pexels.com/photos/12115040/pexels-photo-12115040.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Facial treatment',
  },
];

export const categoryLabels: Record<string, string> = {
  men: "Men's",
  women: "Women's",
  unisex: 'Unisex',
};

export const categoryColors: Record<string, string> = {
  men: 'bg-blue-100 text-blue-700 border-blue-200',
  women: 'bg-rose-100 text-rose-700 border-rose-200',
  unisex: 'bg-amber-100 text-amber-700 border-amber-200',
};

export const statusConfig: Record<
  string,
  { label: string; badge: string; dot: string }
> = {
  pending: {
    label: 'Pending',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  confirmed: {
    label: 'Confirmed',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  completed: {
    label: 'Completed',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  cancelled: {
    label: 'Cancelled',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
  },
};

export const timeSlots = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
];
