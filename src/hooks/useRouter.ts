import { useEffect, useState } from 'react';

export type Route = 'home' | 'book' | 'my-appointments' | 'dashboard';

function parseHash(): Route {
  const hash = window.location.hash.replace('#/', '').replace('#', '');
  if (hash === 'book') return 'book';
  if (hash === 'my-appointments') return 'my-appointments';
  if (hash === 'dashboard') return 'dashboard';
  return 'home';
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(parseHash());

  useEffect(() => {
    const handler = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return route;
}

export function navigate(route: Route) {
  window.location.hash = `/${route}`;
}
