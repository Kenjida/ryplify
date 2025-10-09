import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const AnalyticsTracker: React.FC = () => {
  const { pathname, search } = useLocation();
  const hasTracked = useRef(false);

  useEffect(() => {
    // In development with StrictMode, effects run twice. This ensures we only track once per location change.
    if (hasTracked.current) {
        hasTracked.current = false;
        return;
    }

    // Don't track admin pages
    if (pathname.startsWith('/admin')) {
      return;
    }

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname + search }),
    }).catch(error => {
      console.error('Analytics tracking failed:', error);
    });

    hasTracked.current = true;

  }, [pathname, search]);

  return null; // This component does not render anything
};

export default AnalyticsTracker;
