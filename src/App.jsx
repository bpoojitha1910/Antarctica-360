import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import CommandCenter from './pages/CommandCenter';
import DigitalTwin from './components/DigitalTwin';
import WeatherAnalytics from './components/WeatherAnalytics';
import WhatIfSimulator from './components/WhatIfSimulator';
import RiskManagement from './pages/RiskManagement';
import ShiftHandover from './pages/ShiftHandover';
import About from './pages/About';
import { DashboardProvider, useDashboard } from './DashboardContext';

function DashboardContent({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab }) {
  const { data, loading, error, refresh } = useDashboard();

  if (loading && !data) {
    return <div className="flex h-screen items-center justify-center bg-[#06152d] text-white">Loading station data...</div>;
  }

  if (error && !data) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-[#06152d] px-6 text-center text-white">
        <p>Unable to load station data from the backend.</p>
        <p className="text-sm text-slate-300">{error.message}</p>
        <button onClick={refresh} className="btn-gradient rounded-xl px-4 py-2 text-sm font-semibold">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#06152d]">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((isOpen) => !isOpen)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'Command Center' && <CommandCenter onOpenRiskManagement={() => setActiveTab('Risk Management')} />}
        {activeTab === 'Digital Twin' && <DigitalTwin />}
        {activeTab === 'Weather Analytics' && <WeatherAnalytics />}
        {activeTab === 'What-If Simulator' && <WhatIfSimulator />}
        {activeTab === 'Risk Management' && <RiskManagement />}
        {activeTab === 'Shift Handover' && <ShiftHandover />}
        {activeTab === 'About' && <About />}
      </main>
    </div>
  );
}

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Command Center');

  return (
    <DashboardProvider>
      <DashboardContent
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </DashboardProvider>
  );
}

export default DashboardLayout;
