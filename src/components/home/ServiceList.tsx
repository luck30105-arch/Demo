import { Clock, ArrowRight } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { navigate } from '@/hooks/useRouter';
import { categoryLabels, categoryColors } from '@/lib/salon-config';
import type { ServiceCategory } from '@/lib/types';
import { useState } from 'react';

type Filter = 'all' | ServiceCategory;

export default function ServiceList() {
  const { services, loading, error } = useServices();
  const [filter, setFilter] = useState<Filter>('all');

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All Services' },
    { key: 'men', label: "Men's" },
    { key: 'women', label: "Women's" },
    { key: 'unisex', label: 'Unisex' },
  ];

  const filtered = filter === 'all' ? services : services.filter((s) => s.category === filter);

  return (
    <section id="services" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Services & Prices
          </h2>
          <p className="mt-4 text-gray-600">
            Browse our full range of services. Pick one and book your appointment in seconds.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                filter === f.key
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="mt-12 text-center text-gray-500">Loading services…</div>
        )}
        {error && (
          <div className="mt-12 text-center text-rose-600">
            Could not load services. Please try again later.
          </div>
        )}

        {!loading && !error && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((service) => (
              <div
                key={service.id}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                      categoryColors[service.category]
                    }`}
                  >
                    {categoryLabels[service.category]}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {service.duration_minutes} min
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{service.price}
                  </span>
                  <button
                    onClick={() => navigate('book')}
                    className="group/btn inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800"
                  >
                    Book
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="mt-12 text-center text-gray-500">
            No services in this category yet.
          </div>
        )}
      </div>
    </section>
  );
}
