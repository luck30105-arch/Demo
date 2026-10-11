import { Phone, MapPin, MessageCircle, Clock } from 'lucide-react';
import { salonConfig } from '@/lib/salon-config';

export default function ContactSection() {
  return (
    <section id="contact" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Visit Us
          </h2>
          <p className="mt-4 text-gray-600">
            Walk in or book ahead — we're ready to take care of you.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <a
              href={`tel:${salonConfig.phone}`}
              className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-gray-500">Call us</p>
                <p className="text-lg font-semibold text-gray-900">{salonConfig.phone}</p>
              </div>
            </a>

            <a
              href={`https://wa.me/${salonConfig.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <MessageCircle className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-gray-500">WhatsApp</p>
                <p className="text-lg font-semibold text-gray-900">Chat with us</p>
              </div>
            </a>

            <a
              href={salonConfig.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-600 text-white">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-gray-500">Find us</p>
                <p className="text-lg font-semibold text-gray-900">{salonConfig.address}</p>
              </div>
            </a>

            <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5">
              <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
                <Clock className="h-5 w-5" />
              </span>
              <div className="w-full">
                <p className="text-sm font-medium text-gray-500">Opening hours</p>
                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                  {salonConfig.hours.map((h) => (
                    <li key={h.day} className="flex justify-between">
                      <span>{h.day}</span>
                      <span className="font-medium">{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200">
            <iframe
              title="Salon location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.457!2d77.6408!3d12.9719!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzE5LjAiTiA3N8KwMzgnMjMuMCJF!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
