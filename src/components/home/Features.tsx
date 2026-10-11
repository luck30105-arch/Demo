import { Scissors, Sparkles, Palette, Heart, Clock, Users } from 'lucide-react';

const features = [
  {
    icon: Scissors,
    title: 'Expert Stylists',
    description: 'Skilled professionals with years of experience in modern and classic cuts.',
  },
  {
    icon: Sparkles,
    title: 'Premium Products',
    description: 'We use only high-quality products for all our treatments and services.',
  },
  {
    icon: Palette,
    title: 'Custom Coloring',
    description: 'From subtle highlights to bold transformations, we bring your vision to life.',
  },
  {
    icon: Heart,
    title: 'Personalized Care',
    description: 'Every service is tailored to your preferences, hair type, and style goals.',
  },
  {
    icon: Clock,
    title: 'Quick & Easy Booking',
    description: 'Request appointments online in under a minute — no phone calls needed.',
  },
  {
    icon: Users,
    title: 'For Everyone',
    description: "Men's, women's, and unisex services all under one roof.",
  },
];

export default function Features() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Why Choose Us
          </h2>
          <p className="mt-4 text-gray-600">
            We combine skill, style, and warmth to give you an experience worth coming back to.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-gray-200 p-6 transition-all hover:border-gray-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white transition-transform group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
