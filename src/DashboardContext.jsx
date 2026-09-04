import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from './services_api';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  // Start with null so data comes entirely from your FastAPI server
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = (showLoading) => {
      if (showLoading) setLoading(true);
      return api.dashboard()
        .then((payload) => {
          if (!cancelled) {
            setData(payload);
            setLastRefreshedAt(new Date());
          }
        })
        .catch((err) => {
          if (!cancelled) setError(err);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    };

    loadDashboard(true);
    const refreshTimer = window.setInterval(() => loadDashboard(false), 60_000);

    return () => {
      cancelled = true;
      window.clearInterval(refreshTimer);
    };
  }, []);

  const refresh = () => {
    setLoading(true);
    setError(null);
    api.dashboard()
      .then(setData)
      .then(() => setLastRefreshedAt(new Date()))
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return (
    <DashboardContext.Provider value={{ data, loading, error, refresh, lastRefreshedAt }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used inside DashboardProvider');
  return context;
}