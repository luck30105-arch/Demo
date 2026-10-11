import { Scissors, Calendar, LayoutDashboard, ClipboardList, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { navigate, type Route } from '@/hooks/useRouter';
import { salonConfig } from '@/lib/salon-config';

interface NavbarProps {
  current: Route;
}

export default function Navbar({ current }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links: { route: Route; label: string; icon: typeof Calendar }[] = [
    { route: 'home', label: 'Home', icon: Scissors },
    { route: 'book', label: 'Book Appointment', icon: Calendar },
    { route: 'my-appointments', label: 'My Appointments', icon: ClipboardList },
    { route: 'dashboard', label: 'Owner Dashboard', icon: LayoutDashboard },
  ];

  function handleNav(route: Route) {
    navigate(route);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-gray-900"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white">
            <Scissors className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline">{salonConfig.name}</span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = current === link.route;
            return (
              <button
                key={link.route}
                onClick={() => handleNav(link.route)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = current === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => handleNav(link.route)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
