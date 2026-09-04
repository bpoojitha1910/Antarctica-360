const API_BASE = import.meta.env.VITE_API_BASE || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => 'Request failed');
    throw new Error(`${response.status}: ${message}`);
  }

  return response.json();
}

export const api = {
  // Prevent the browser from serving an older dashboard response.
  dashboard: () => request(`/dashboard?live_tick=${Math.floor(Date.now() / 1000)}`),
  weatherRange: (startDate, endDate) => request(`/weather?start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}`),
  exportWeatherPdf: async (startDate, endDate) => {
    const params = startDate && endDate ? `?start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}` : '';
    const response = await fetch(`${API_BASE}/weather/export${params}`);
    if (!response.ok) throw new Error(`${response.status}: ${await response.text()}`);
    return response.blob();
  },
  simulate: (payload) => request('/simulate', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
};
