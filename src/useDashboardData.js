import { useState, useEffect } from 'react';

export function useDashboardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDashboard() {
      try {
        setLoading(true);
        setError(null);

        // Requests relative route /api/dashboard via Vite proxy
        const response = await fetch('/api/dashboard', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to connect to backend API');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();

    return () => controller.abort();
  }, []);

  return { data, loading, error };
}