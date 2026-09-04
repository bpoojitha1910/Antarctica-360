const API_BASE_URL = "http://localhost:8000";

export const api = {
  health: async () => {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) throw new Error("Health API failed");
    return response.json();
  },

  dashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/api/dashboard`);
    if (!response.ok) throw new Error("Dashboard API failed");
    return response.json();
  },

  weather: async () => {
    const response = await fetch(`${API_BASE_URL}/api/weather`);
    if (!response.ok) throw new Error("Weather API failed");
    return response.json();
  },

  station: async () => {
    const response = await fetch(`${API_BASE_URL}/api/station`);
    if (!response.ok) throw new Error("Station API failed");
    return response.json();
  },

  alerts: async () => {
    const response = await fetch(`${API_BASE_URL}/api/alerts`);
    if (!response.ok) throw new Error("Alerts API failed");
    return response.json();
  },

  digitalTwin: async () => {
    const response = await fetch(`${API_BASE_URL}/api/digital-twin`);
    if (!response.ok) throw new Error("Digital Twin API failed");
    return response.json();
  },

  simulate: async (simulationData) => {
    const response = await fetch(`${API_BASE_URL}/api/simulate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(simulationData),
    });

    if (!response.ok) throw new Error("Simulation API failed");

    return response.json();
  },
};