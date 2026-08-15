// ---------------------------------------------------------------------------
// useStats
// ---------------------------------------------------------------------------
// Loads the homepage impact statistics and keeps `loading` true until BOTH
// the request finishes AND the minimum splash-screen duration has elapsed,
// so the splash screen never flashes in and out.
// ---------------------------------------------------------------------------

import { useEffect, useState } from 'react';
import { fetchStats } from '../services/customerApi';
import type { Stats } from '../types';

/** Minimum time (ms) the splash screen stays visible. */
const MIN_SPLASH_DURATION = 2500;

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [statsData] = await Promise.all([
          // Stats are decorative on the homepage — a failure just means
          // the ImpactCounter section won't render.
          fetchStats().catch(() => null),
          new Promise((resolve) => setTimeout(resolve, MIN_SPLASH_DURATION)),
        ]);
        if (active) setStats(statsData);
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  return { stats, loading };
}
