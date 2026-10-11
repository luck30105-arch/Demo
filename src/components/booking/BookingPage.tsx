import { useState } from 'react';
import {
  Calendar,
  Clock,
  Check,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Mail,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { supabase } from '@/lib/supabase';
import { salonConfig, categoryLabels, categoryColors, timeSlots } from '@/lib/salon-config';
import type { Service, AppointmentInput } from '@/lib/types';
import { navigate } from '@/hooks/useRouter';

type Step = 'service' | 'datetime' | 'details' | 'success';

export default function BookingPage() {
  const { services, loading, error } = useServices();
  const [step, setStep] = useState<Step>('service');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  function handleServiceSelect(service: Service) {
    setSelectedService(service);
    setStep('datetime');
  }

  function handleDateTimeNext() {
    if (selectedDate && selectedTime) {
      setStep('details');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedService) return;

    setSubmitting(true);
    setSubmitError(null);

    const input: AppointmentInput = {
      service_id: selectedService.id,
      customer_name: form.customer_name,
      customer_phone: form.customer_phone,
      customer_email: form.customer_email || null,
      requested_date: selectedDate,
      requested_time: selectedTime,
      notes: form.notes || null,
    };

    const { error } = await supabase.from('appointments').insert(input);

    setSubmitting(false);

    if (error) {
      setSubmitError('Something went wrong. Please try again or call us directly.');
    } else {
      setStep('success');
    }
  }

  function reset() {
    setSelectedService(null);
    setSelectedDate('');
    setSelectedTime('');
    setForm({ customer_name: '', customer_phone: '', customer_email: '', notes: '' });
    setStep('service');
  }

  const stepOrder: Step[] = ['service', 'datetime', 'details', 'success'];
  const currentStepIndex = stepOrder.indexOf(step);

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Book an Appointment
          </h1>
          <p className="mt-2 text-gray-600">
            Pick a service, choose your preferred time, and we'll confirm your request.
          </p>
        </div>

        {step !== 'success' && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {['Service', 'Date & Time', 'Your Details'].map((label, i) => (
              <div key={label} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    i <= currentStepIndex
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i < currentStepIndex ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span
                  className={`ml-2 hidden text-sm font-medium sm:inline ${
                    i <= currentStepIndex ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
                {i < 2 && <ChevronRight className="mx-2 h-4 w-4 text-gray-300 sm:mx-4" />}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          {loading && (
            <div className="flex items-center justify-center py-12 text-gray-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading services…
            </div>
          )}

          {error && (
            <div className="py-12 text-center text-rose-600">
              Could not load services. Please try again later.
            </div>
          )}

          {/* Step 1: Service Selection */}
          {!loading && !error && step === 'service' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Choose a Service</h2>
              <div className="mt-4 space-y-3">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className="group flex w-full items-center justify-between rounded-xl border border-gray-200 p-4 text-left transition-all hover:border-gray-300 hover:shadow-md"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{service.name}</h3>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                            categoryColors[service.category]
                          }`}
                        >
                          {categoryLabels[service.category]}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{service.description}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {service.duration_minutes} min
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{service.price}
                      </span>
                      <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 'datetime' && selectedService && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <button
                  onClick={() => setStep('service')}
                  className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <div className="rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-700">
                  {selectedService.name} — ₹{selectedService.price}
                </div>
              </div>

              <h2 className="text-lg font-semibold text-gray-900">Pick a Date</h2>
              <div className="mt-3">
                <input
                  type="date"
                  min={today}
                  max={maxDateStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
              </div>

              {selectedDate && (
                <>
                  <h2 className="mt-6 text-lg font-semibold text-gray-900">Pick a Time</h2>
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                          selectedTime === time
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {formatTime(time)}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <button
                onClick={handleDateTimeNext}
                disabled={!selectedDate || !selectedTime}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 3: Customer Details */}
          {step === 'details' && selectedService && (
            <form onSubmit={handleSubmit}>
              <div className="mb-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('datetime')}
                  className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <div className="rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-700">
                  {selectedService.name} — {formatDate(selectedDate)} at {formatTime(selectedTime)}
                </div>
              </div>

              <h2 className="text-lg font-semibold text-gray-900">Your Details</h2>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={form.customer_name}
                      onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={form.customer_phone}
                      onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Email <span className="text-gray-400">(optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={form.customer_email}
                      onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Notes <span className="text-gray-400">(optional)</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      rows={3}
                      className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                      placeholder="Any specific requests or preferences…"
                    />
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4" />
                    Submit Appointment Request
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-xs text-gray-500">
                This is a request — the salon will confirm your appointment by phone.
              </p>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <Check className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                Request Submitted!
              </h2>
              <p className="mt-2 text-gray-600">
                Thank you, {form.customer_name.split(' ')[0]}! We've received your appointment request for{' '}
                <span className="font-medium text-gray-900">{selectedService?.name}</span> on{' '}
                <span className="font-medium text-gray-900">{formatDate(selectedDate)}</span> at{' '}
                <span className="font-medium text-gray-900">{formatTime(selectedTime)}</span>.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                We'll call you at {form.customer_phone} to confirm. For urgent bookings, call us directly.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a
                  href={`tel:${salonConfig.phone}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                  <Phone className="h-4 w-4" />
                  Call Salon
                </a>
                <button
                  onClick={() => {
                    reset();
                    navigate('home');
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Back to Home
                </button>
                <button
                  onClick={() => navigate('my-appointments')}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  View My Appointments
                </button>
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Book Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
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
