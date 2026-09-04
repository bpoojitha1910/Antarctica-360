import React from 'react';
import { RefreshCw, User } from 'lucide-react';
import { useDashboard } from '../DashboardContext';

export default function Header() {
  const { data, loading, refresh, lastRefreshedAt } = useDashboard();
  const headerInfo = data.headerInfo;

  return (
    <div className="pt-6">
      <div className="hero-bg relative mb-4 rounded-2xl overflow-hidden bg-[#071d3f] border border-cyan-500/20 shadow-lg">
        {/* Aurora / Hero background */}
        <div className="absolute top-0 right-0 w-full h-[180px] pointer-events-none overflow-hidden rounded-bl-3xl -z-0">
          {/* Aurora streaks - Multi-color with high-visibility movement */}
          <div className="absolute top-0 right-0 w-full h-full">
            {/* Ambient Polar Green Glow - Deep background wave */}
            <div 
              className="absolute -top-12 right-[25%] w-[460px] h-[190px] bg-emerald-400/35 rounded-full blur-3xl pointer-events-none animate-aurora-drift" 
            />

            {/* Ambient Purple Luminous Glow */}
            <div 
              className="absolute -top-10 right-[8%] w-[420px] h-[170px] bg-purple-500/40 rounded-full blur-3xl pointer-events-none animate-aurora-drift" 
              style={{ animationDelay: '2s' }} 
            />

            {/* Glowing Emerald Green Aurora Ribbon (Wide sweep) */}
            <div 
              className="absolute -top-3 right-[22%] w-[420px] h-[85px] bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent rotate-[-17deg] blur-md animate-aurora-primary mix-blend-screen" 
            />

            {/* Main Vibrant Purple Ribbon (Opposing sweep) */}
            <div 
              className="absolute top-0 right-[10%] w-[360px] h-[90px] bg-gradient-to-r from-transparent via-purple-500/85 to-transparent rotate-[-15deg] blur-md animate-aurora-secondary" 
            />

            {/* Electric Cyan / Sky Blue Streak */}
            <div 
              className="absolute -top-5 right-[5%] w-[350px] h-[80px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent rotate-[-12deg] blur-md animate-aurora-primary mix-blend-screen" 
              style={{ animationDelay: '1.2s' }} 
            />

            {/* Electric Fuchsia / Violet Streak */}
            <div 
              className="absolute top-6 right-[18%] w-[290px] h-[60px] bg-gradient-to-r from-transparent via-fuchsia-400/80 to-transparent rotate-[-11deg] blur-md animate-aurora-secondary" 
              style={{ animationDelay: '2s' }} 
            />

            {/* Deep Teal & Violet Highlight Streak */}
            <div 
              className="absolute top-2 right-[4%] w-[320px] h-[70px] bg-gradient-to-r from-transparent via-teal-300/75 via-violet-300/75 to-transparent rotate-[-13deg] blur-md animate-aurora-primary mix-blend-screen" 
              style={{ animationDelay: '3.5s' }} 
            />
          </div>
          
          {/* Antarctic station landscape */}
          <svg
            className="absolute bottom-0 right-0 w-[55%] h-[160px] opacity-[0.35]"
            viewBox="0 0 600 180"
            preserveAspectRatio="none"
            fill="none"
          >
            {/* Distant mountain range */}
            <path
              d="M0 180
                 L45 115
                 L80 135
                 L125 75
                 L165 120
                 L220 45
                 L270 105
                 L325 55
                 L365 95
                 L420 25
                 L470 90
                 L520 50
                 L560 105
                 L600 70
                 L600 180 Z"
              fill="url(#mountain-fill)"
            />

            {/* Snow caps */}
            <path
              d="M125 75 L105 105 L125 97 L140 108 L165 120 Z"
              fill="white"
              opacity="0.9"
            />

            <path
              d="M220 45 L195 82 L220 70 L242 88 L270 105 Z"
              fill="white"
              opacity="0.95"
            />

            <path
              d="M325 55 L300 87 L325 76 L345 91 L365 95 Z"
              fill="white"
              opacity="0.9"
            />

            <path
              d="M420 25 L390 68 L420 52 L445 72 L470 90 Z"
              fill="white"
              opacity="0.95"
            />

            <path
              d="M520 50 L495 82 L520 70 L540 88 L560 105 Z"
              fill="white"
              opacity="0.85"
            />

            {/* Snow ground */}
            <path
              d="M0 155
                 C100 145 180 160 270 150
                 C370 140 470 158 600 145
                 L600 180
                 L0 180 Z"
              fill="#E8F7FF"
              opacity="0.7"
            />

            {/* ============================= */}
            {/* BHARATI RESEARCH STATION */}
            {/* ============================= */}

            {/* Main station building */}
            <rect
              x="300"
              y="108"
              width="92"
              height="42"
              rx="3"
              fill="#123A68"
              stroke="#7DD3FC"
              strokeWidth="1"
            />

            {/* Main roof */}
            <path
              d="M294 108 L306 98 L386 98 L398 108 Z"
              fill="#0B2B50"
              stroke="#7DD3FC"
              strokeWidth="1"
            />

            {/* Main building windows */}
            <rect x="312" y="116" width="10" height="9" rx="1" fill="#FFD166" />
            <rect x="330" y="116" width="10" height="9" rx="1" fill="#FFD166" />
            <rect x="348" y="116" width="10" height="9" rx="1" fill="#FFD166" />
            <rect x="366" y="116" width="10" height="9" rx="1" fill="#FFD166" />

            <rect x="312" y="132" width="10" height="9" rx="1" fill="#38BDF8" />
            <rect x="330" y="132" width="10" height="9" rx="1" fill="#38BDF8" />
            <rect x="348" y="132" width="10" height="9" rx="1" fill="#38BDF8" />
            <rect x="366" y="132" width="10" height="9" rx="1" fill="#38BDF8" />

            {/* Left station module */}
            <rect
              x="245"
              y="119"
              width="48"
              height="31"
              rx="2"
              fill="#17466F"
              stroke="#7DD3FC"
              strokeWidth="0.8"
            />

            {/* Left module windows */}
            <rect x="253" y="127" width="9" height="7" rx="1" fill="#FFD166" />
            <rect x="268" y="127" width="9" height="7" rx="1" fill="#38BDF8" />
            <rect x="283" y="127" width="5" height="7" rx="1" fill="#38BDF8" />

            {/* Right station module */}
            <rect
              x="402"
              y="114"
              width="55"
              height="36"
              rx="2"
              fill="#17466F"
              stroke="#7DD3FC"
              strokeWidth="0.8"
            />

            {/* Right module windows */}
            <rect x="412" y="122" width="10" height="8" rx="1" fill="#FFD166" />
            <rect x="428" y="122" width="10" height="8" rx="1" fill="#38BDF8" />
            <rect x="444" y="122" width="8" height="8" rx="1" fill="#38BDF8" />

            {/* Small storage building */}
            <rect
              x="465"
              y="128"
              width="38"
              height="22"
              rx="2"
              fill="#123A68"
              stroke="#7DD3FC"
              strokeWidth="0.7"
            />

            <rect x="473" y="134" width="8" height="6" rx="1" fill="#38BDF8" />
            <rect x="487" y="134" width="8" height="6" rx="1" fill="#38BDF8" />

            {/* ============================= */}
            {/* RADAR / COMMUNICATION DOME */}
            {/* ============================= */}

            {/* Radar platform */}
            <rect
              x="510"
              y="137"
              width="35"
              height="4"
              rx="1"
              fill="#7DD3FC"
            />

            {/* Radar dome */}
            <path
              d="M513 137
                 C513 121 542 121 542 137 Z"
              fill="#D9F4FF"
              fillOpacity="0.25"
              stroke="#7DD3FC"
              strokeWidth="1"
            />

            {/* Radar antenna */}
            <line
              x1="527"
              y1="123"
              x2="527"
              y2="111"
              stroke="#7DD3FC"
              strokeWidth="1"
            />

            <circle
              cx="527"
              cy="109"
              r="3"
              fill="#38BDF8"
            />

            {/* ============================= */}
            {/* INDIAN FLAG - Elevated and clearly visible */}
            {/* ============================= */}

            {/* Flag pole - Tall and bright */}
            <line
              x1="318"
              y1="99"
              x2="318"
              y2="34"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            {/* Pole Finial (Golden top) */}
            <circle
              cx="318"
              cy="33"
              r="2.5"
              fill="#FBBF24"
            />

            {/* Flag Group with subtle waving ripple and bright colors */}
            <g>
              {/* Saffron Stripe */}
              <rect
                x="319"
                y="36"
                width="34"
                height="7.5"
                fill="#FF9933"
                rx="0.5"
              />

              {/* White Stripe */}
              <rect
                x="319"
                y="43.5"
                width="34"
                height="7.5"
                fill="#FFFFFF"
              />

              {/* Green Stripe */}
              <rect
                x="319"
                y="51"
                width="34"
                height="7.5"
                fill="#138808"
                rx="0.5"
              />

              {/* Ashoka Chakra */}
              <circle
                cx="336"
                cy="47.25"
                r="3"
                fill="none"
                stroke="#000080"
                strokeWidth="0.8"
              />

              <circle
                cx="336"
                cy="47.25"
                r="0.9"
                fill="#000080"
              />
            </g>

            {/* ============================= */}
            {/* ANTENNAS */}
            {/* ============================= */}

            <line
              x1="382"
              y1="98"
              x2="382"
              y2="82"
              stroke="#7DD3FC"
              strokeWidth="0.8"
            />

            <circle
              cx="382"
              cy="80"
              r="2"
              fill="#38BDF8"
            />

            <line
              x1="449"
              y1="114"
              x2="449"
              y2="96"
              stroke="#7DD3FC"
              strokeWidth="0.8"
            />

            <circle
              cx="449"
              cy="94"
              r="2"
              fill="#38BDF8"
            />

            {/* Small snow mounds around station */}
            <path
              d="M220 150 Q235 135 250 150"
              stroke="#E8F7FF"
              strokeWidth="5"
              opacity="0.7"
            />

            <path
              d="M455 150 Q470 136 486 150"
              stroke="#E8F7FF"
              strokeWidth="5"
              opacity="0.7"
            />

            {/* Mountain gradient */}
            <defs>
              <linearGradient
                id="mountain-fill"
                x1="300"
                y1="0"
                x2="300"
                y2="180"
              >
                <stop
                  offset="0%"
                  stopColor="#8ED8FF"
                />

                <stop
                  offset="55%"
                  stopColor="#4387B8"
                />

                <stop
                  offset="100%"
                  stopColor="#06224A"
                  stopOpacity="0.9"
                />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Header content */}
        <div className="relative z-10 flex items-start justify-between pt-4 pb-4 px-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow-sm">{headerInfo.title}</h1>
            <p className="text-cyan-100/70 text-sm font-medium">{headerInfo.subtitle}</p>
          </div>

          {/* Status pills */}
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-end gap-1">
              <div className="glass-card-static flex items-center gap-2 px-4 py-2 text-xs font-medium text-navy-900 bg-white/95">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-pulse-live absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="font-semibold">Live Replay</span>
              </span>
              <span className="text-navy-900/30">|</span>
              <span className="text-navy-900/70">{headerInfo.date}</span>
              <span className="text-navy-900/30">|</span>
              <span className="text-navy-900/70">{headerInfo.time}</span>
              <span className="text-navy-900/30">|</span>
              <button
                type="button"
                onClick={refresh}
                disabled={loading}
                title="Load the latest observations from the dataset"
                className="flex items-center gap-1 text-navy-900/70 hover:text-navy-900 disabled:cursor-wait disabled:opacity-50"
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                <span>{loading ? 'Updating...' : 'Refresh'}</span>
              </button>
              </div>
              <p className="text-[10px] text-cyan-100/60">
                Last data change: {headerInfo.lastDataChange || `${headerInfo.date}, ${headerInfo.time}`}
              </p>
              <p className="text-[10px] text-emerald-300/80">
                Last refreshed: {lastRefreshedAt ? lastRefreshedAt.toLocaleTimeString() : '--'}
              </p>
            </div>
            
            <button id="profile-button" className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
              <User size={16} className="text-white/80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}