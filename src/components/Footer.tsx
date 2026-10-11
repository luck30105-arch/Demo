import { Scissors, Phone, MapPin, Instagram, Facebook, Clock } from 'lucide-react';
import { salonConfig } from '@/lib/salon-config';
import { navigate } from '@/hooks/useRouter';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-lg font-bold text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                <Scissors className="h-5 w-5" />
              </span>
              {salonConfig.name}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              {salonConfig.description}
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href={salonConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-white/20"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={salonConfig.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-white/20"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                <span>{salonConfig.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-gray-500" />
                <a href={`tel:${salonConfig.phone}`} className="hover:text-white">
                  {salonConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 flex-shrink-0 text-gray-500" />
                <span>Open 7 days a week</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Opening Hours
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {salonConfig.hours.map((h) => (
                <li key={h.day} className="flex justify-between">
                  <span className="text-gray-400">{h.day}</span>
                  <span>{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} {salonConfig.name}. All rights reserved.
          </p>
          <button
            onClick={() => navigate('book')}
            className="rounded-lg bg-white px-5 py-2 text-sm font-medium text-gray-900 transition-opacity hover:opacity-90"
          >
            Book an Appointment
          </button>
        </div>
      </div>
    </footer>
  );
}
