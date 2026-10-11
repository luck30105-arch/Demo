import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Clock,
  Save,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAllServices } from '@/hooks/useServices';
import { categoryLabels, categoryColors } from '@/lib/salon-config';
import type { Service, ServiceCategory, ServiceInput } from '@/lib/types';

export default function ServiceManager() {
  const { services, loading, error, setServices } = useAllServices();
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);

  function handleEdit(service: Service) {
    setEditing(service);
    setShowForm(true);
  }

  function handleNew() {
    setEditing(null);
    setShowForm(true);
  }

  async function handleSave(input: ServiceInput, id?: string) {
    if (id) {
      const { data, error } = await supabase
        .from('services')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setServices((prev) => prev.map((s) => (s.id === id ? (data as Service) : s)));
    } else {
      const { data, error } = await supabase
        .from('services')
        .insert(input)
        .select()
        .single();

      if (error) throw error;

      setServices((prev) => [...prev, data as Service]);
    }
    setShowForm(false);
    setEditing(null);
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) {
      alert('Could not delete this service — it may have existing appointments linked to it.');
      return;
    }
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleToggleActive(service: Service) {
    const { error } = await supabase
      .from('services')
      .update({ is_active: !service.is_active })
      .eq('id', service.id);

    if (error) return;

    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? { ...s, is_active: !s.is_active } : s))
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading services…
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center text-rose-600">
        Could not load services. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Services ({services.length})
        </h3>
        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900">{service.name}</h4>
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                    categoryColors[service.category]
                  }`}
                >
                  {categoryLabels[service.category]}
                </span>
                {!service.is_active && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                    Hidden
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">{service.description}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {service.duration_minutes} min
                </span>
                <span className="font-medium text-gray-700">₹{service.price}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleActive(service)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  service.is_active
                    ? 'text-gray-500 hover:bg-gray-50'
                    : 'text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                {service.is_active ? 'Hide' : 'Show'}
              </button>
              <button
                onClick={() => handleEdit(service)}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="rounded-lg p-2 text-rose-500 transition-colors hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <ServiceForm
          service={editing}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

interface ServiceFormProps {
  service: Service | null;
  onSave: (input: ServiceInput, id?: string) => Promise<void>;
  onCancel: () => void;
}

function ServiceForm({ service, onSave, onCancel }: ServiceFormProps) {
  const [form, setForm] = useState({
    name: service?.name ?? '',
    description: service?.description ?? '',
    category: (service?.category ?? 'men') as ServiceCategory,
    price: service?.price ?? 0,
    duration_minutes: service?.duration_minutes ?? 30,
    sort_order: service?.sort_order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    const input: ServiceInput = {
      name: form.name,
      description: form.description,
      category: form.category,
      price: Number(form.price),
      duration_minutes: Number(form.duration_minutes),
      image_url: service?.image_url ?? null,
      sort_order: Number(form.sort_order),
      is_active: service?.is_active ?? true,
    };

    try {
      await onSave(input, service?.id);
    } catch {
      setSaveError('Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {service ? 'Edit Service' : 'Add New Service'}
          </h3>
          <button
            onClick={onCancel}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Service Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              placeholder="e.g. Classic Haircut"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              placeholder="Short description of the service"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as ServiceCategory })
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              >
                <option value="men">Men's</option>
                <option value="women">Women's</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Price (₹)
              </label>
              <input
                type="number"
                required
                min={0}
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Duration (minutes)
              </label>
              <input
                type="number"
                required
                min={5}
                step={5}
                value={form.duration_minutes}
                onChange={(e) =>
                  setForm({ ...form, duration_minutes: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Sort Order
              </label>
              <input
                type="number"
                min={0}
                value={form.sort_order}
                onChange={(e) =>
                  setForm({ ...form, sort_order: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              />
            </div>
          </div>

          {saveError && (
            <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {saveError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {service ? 'Save Changes' : 'Add Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
