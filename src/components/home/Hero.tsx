import { ArrowRight, Star, Clock, MapPin, Phone, MessageCircle } from 'lucide-react';
import { navigate } from '@/hooks/useRouter';
import { salonConfig, heroImage } from '@/lib/salon-config';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gray-900">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Salon interior"
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/60 to-gray-900" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            Rated 4.9 by 500+ happy clients
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {salonConfig.name}
          </h1>
          <p className="mt-3 text-xl font-medium text-gray-200">
            {salonConfig.tagline}
          </p>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-300">
            {salonConfig.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('book')}
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-100 hover:shadow-lg"
            >
              Book an Appointment
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href={`https://wa.me/${salonConfig.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-500 hover:shadow-lg"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-300">
            <a
              href={`tel:${salonConfig.phone}`}
              className="flex items-center gap-2 hover:text-white"
            >
              <Phone className="h-4 w-4" />
              {salonConfig.phone}
            </a>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Open 7 days
            </span>
            <a
              href={salonConfig.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white"
            >
              <MapPin className="h-4 w-4" />
              {salonConfig.address.split(',').slice(0, 3).join(',')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
