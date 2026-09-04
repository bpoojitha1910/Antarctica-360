import React, { useState } from 'react';
import {
  Home, CloudSun, TriangleAlert, Box, FlaskConical,
  Shield, FileText, RefreshCw, Info, Mountain, Snowflake,
  MapPin, Thermometer, Wind, Menu, X, Activity
} from 'lucide-react';
import { useDashboard } from '../DashboardContext';

const iconMap = {
  Home, CloudSun, TriangleAlert, Box, FlaskConical,
  Shield, FileText, RefreshCw, Info, Activity
};

export default function Sidebar({ isOpen, onToggle, activeTab, onSelectTab }) {
  const { data } = useDashboard();
  const { navigationItems, stationInfo } = data;

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay lg:hidden ${isOpen ? 'active' : ''}`}
        onClick={onToggle}
      />

      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 lg:hidden bg-navy-900 text-white p-2 rounded-xl shadow-lg"
        id="sidebar-toggle"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-[240px] sidebar-gradient flex flex-col z-40 
          transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="relative">
              <svg width="40" height="36" viewBox="0 0 40 36" fill="none">
                <path d="M20 2L35 28H5L20 2Z" fill="url(#mountain-grad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
                <path d="M12 18L20 6L28 18" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1"/>
                <path d="M8 28L14 16L20 22L26 14L32 28" fill="rgba(255,255,255,0.2)"/>
                <circle cx="32" cy="6" r="2" fill="#60A5FA"/>
                <line x1="32" y1="2" x2="32" y2="10" stroke="#60A5FA" strokeWidth="0.5"/>
                <line x1="28" y1="6" x2="36" y2="6" stroke="#60A5FA" strokeWidth="0.5"/>
                <defs>
                  <linearGradient id="mountain-grad" x1="20" y1="2" x2="20" y2="28">
                    <stop offset="0%" stopColor="#60A5FA"/>
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.4"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <div className="text-white font-bold text-sm tracking-wider leading-tight">ANTARCTICA</div>
              <div className="text-white font-bold text-sm tracking-wider leading-tight">360</div>
            </div>
          </div>
          <div className="text-white text-[11px] mt-1 opacity-90">{stationInfo.name.replace('Bharati ', 'Bharati Research ')}</div>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-white/10" />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const IconComponent = iconMap[item.icon] || Box;
            const isActive = activeTab ? activeTab === item.label : item.active;

            return (
              <button
                key={item.label}
                id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => {
                  if (onSelectTab) onSelectTab(item.label);
                  if (isOpen && onToggle) onToggle();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer
                  ${isActive
                    ? 'sidebar-nav-active text-white'
                    : 'text-white hover:text-white hover:bg-white/10'
                  }`}
              >
                {IconComponent && <IconComponent size={17} strokeWidth={isActive ? 2 : 1.5} className="text-white" />}
                <span className="text-white">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Station info card */}
        <div className="px-3 pb-2 relative z-10">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🇮🇳</span>
              <div>
                <div className="text-white text-xs font-semibold">{stationInfo.name}</div>
                <div className="text-white text-[10px] opacity-80">{stationInfo.location}</div>
              </div>
            </div>

            {/* Mini Antarctica map */}
            <div className="relative bg-navy-800/50 rounded-lg p-2 mb-2 h-12 flex items-center justify-center overflow-hidden">
              <svg width="80" height="32" viewBox="0 0 80 32" fill="none" className="opacity-60">
                <path d="M5 20C10 15 15 18 20 12C25 8 30 10 40 8C50 6 55 10 60 14C65 18 70 16 75 20" 
                  stroke="#60A5FA" strokeWidth="1" fill="none"/>
                <path d="M5 20C10 22 15 25 20 24C25 23 30 26 40 28C50 27 55 25 60 26C65 24 70 23 75 20" 
                  stroke="#60A5FA" strokeWidth="0.5" fill="rgba(96,165,250,0.15)"/>
                <circle cx="45" cy="15" r="2" fill="#EF4444" opacity="0.9"/>
                <circle cx="45" cy="15" r="4" fill="none" stroke="#EF4444" opacity="0.4" strokeWidth="0.5"/>
              </svg>
              <div className="absolute bottom-1 right-2 text-[8px] text-white opacity-80">Antarctica</div>
            </div>

            <div className="flex items-center gap-1 text-white text-[10px] mb-1 opacity-90">
              <MapPin size={10} className="text-white" />
              <span>Outside</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-white text-xl font-bold">{stationInfo.outsideTemp}°C</span>
            </div>
            <div className="flex items-center gap-1 text-white text-[10px] mt-0.5 opacity-90">
              <Wind size={10} className="text-white" />
              <span>{stationInfo.windCondition}</span>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
}