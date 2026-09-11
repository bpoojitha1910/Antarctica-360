import React from 'react';
import Header from '../components/Header';
import MetricCard, { WindDirectionCard } from '../components/MetricCard';
import RiskGauge from '../components/RiskGauge';
import WeatherChart from '../components/WeatherChart';
import AlertCard from '../components/AlertCard';
import DigitalTwinCard from '../components/DigitalTwinCard';
import { useDashboard } from '../DashboardContext';

export default function CommandCenter() {
  const { data } = useDashboard();
  const currentWeather = data?.currentWeather || {};
  const weatherTrendData = data?.weatherTrendData || [];
  const tempSparkData = weatherTrendData.map((point) => point.temperature);
  const pressureSparkData = weatherTrendData.map((point) => point.pressure);
  const windSparkData = weatherTrendData.map((point) => point.windSpeed);
  const humiditySparkData = weatherTrendData.map((point) => point.humidity);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      <div className="max-w-[1360px] mx-auto px-4 md:px-6 pb-8">
        {/* Header */}
        <Header />

        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4 stagger-children">
          <MetricCard
            type="temperature"
            label="Temperature"
            value={currentWeather.temperature}
            unit="°C"
            change={currentWeather.temperatureChange}
            changePeriod={currentWeather.temperatureChangePeriod}
            sparkData={tempSparkData}
            sparkColor="#3B82F6"
          />
          <MetricCard
            type="pressure"
            label="Air Pressure"
            value={currentWeather.airPressure}
            unit="mbar"
            change={currentWeather.pressureChange}
            changePeriod={currentWeather.pressureChangePeriod}
            sparkData={pressureSparkData}
            sparkColor="#3B82F6"
          />
          <MetricCard
            type="wind"
            label="Wind Speed"
            value={currentWeather.windSpeed}
            unit="knots"
            change={currentWeather.windSpeedChange}
            changePeriod={currentWeather.windSpeedChangePeriod}
            sparkData={windSparkData}
            sparkColor="#F97316"
          />
          <MetricCard
            type="humidity"
            label="Humidity"
            value={currentWeather.humidity}
            unit="%"
            change={currentWeather.humidityChange}
            changePeriod={currentWeather.humidityChangePeriod}
            sparkData={humiditySparkData}
            sparkColor="#8B5CF6"
          />
          <WindDirectionCard
            degrees={currentWeather.windDirection}
            label={currentWeather.windDirectionLabel}
          />
          <RiskGauge
            value={currentWeather.weatherRisk}
            label={currentWeather.riskLabel}
          />
        </div>

        {/* Middle Row: Weather Trends + Alert + Digital Twin */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-4">
          {/* Weather Chart - spans ~6 cols */}
          <div className="lg:col-span-6">
            <WeatherChart />
          </div>
          {/* Alert Card - spans ~3 cols */}
          <div className="lg:col-span-3">
            <AlertCard />
          </div>
          {/* Digital Twin - spans ~3 cols */}
          <div className="lg:col-span-3">
            <DigitalTwinCard />
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
          <div className="glass-card-static p-3">
            <span className="block text-[10px] text-slate-400">Station Status</span>
            <strong className="mt-2 block text-xs text-emerald-300">OPERATIONAL</strong>
          </div>
          {[
            ['Power', 'NORMAL', 'text-emerald-300'],
            ['Heating', currentWeather.weatherRisk >= 50 ? 'WATCH' : 'NORMAL', 'text-amber-300'],
            ['Water', 'NORMAL', 'text-emerald-300'],
            ['Fuel', 'NORMAL', 'text-emerald-300'],
            ['Communication', 'DEGRADED', 'text-amber-300'],
            ['Outdoor Ops', currentWeather.weatherRisk >= 50 ? 'RESTRICT' : 'NORMAL', 'text-rose-300'],
          ].map(([label, status, color]) => (
            <div key={label} className="glass-card-static p-3">
              <span className="block text-[10px] text-slate-400">{label}</span>
              <strong className={`mt-2 block text-xs ${color}`}>{status}</strong>
            </div>
          ))}
        </div>
        <div className="glass-card-static mb-6 flex flex-wrap items-center gap-3 p-3 text-[10px]">
          <strong className="text-cyan-200">Critical actions</strong>
          <span className="text-slate-300">• Verify personnel status</span>
          <span className="text-slate-300">• Monitor heating demand</span>
          <span className="text-slate-300">• Restrict outdoor operations when risk is high</span>
        </div>

        {/* Footer tagline */}
        <div className="text-center pb-4">
          <p className="text-xs text-navy-900/30 italic font-medium tracking-wide">
            "Exploring Today &nbsp;•&nbsp; Sustaining Tomorrow"
          </p>
        </div>
      </div>
    </div>
  );
}
