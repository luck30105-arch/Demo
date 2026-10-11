import { ArrowRight } from 'lucide-react';
import { navigate } from '@/hooks/useRouter';

export default function CTA() {
  return (
    <section className="bg-gray-900 py-16">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready for a Fresh Look?
        </h2>
        <p className="mt-4 text-lg text-gray-300">
          Book your appointment in under a minute. Pick a service, choose your time, and we'll take care of the rest.
        </p>
        <button
          onClick={() => navigate('book')}
          className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-gray-900 transition-all hover:bg-gray-100 hover:shadow-xl"
        >
          Book an Appointment
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}
