import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Activity,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Sparkles,
  Zap,
  Filter,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { ModelObservatory } from '../components/observatory/ModelObservatory';
import { DEMO_METRICS, DEMO_TIMELINE } from '../services/mockData';
import { TimelineEvent } from '../types';

export const CommandCenter: React.FC = () => {
  const { currentModel, isDemoMode, unreadAlertsCount } = useApp();
  const [trendTab, setTrendTab] = useState<'volume' | 'latency' | 'errors' | 'drift'>('volume');
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('24h');
  const [selectedTimelineEvent, setSelectedTimelineEvent] = useState<TimelineEvent | null>(
    DEMO_TIMELINE[0]
  );

  // Time-series mock data for the 4 separate health trends
  const trendData24h = [
    { time: '00:00', volume: 420, latency: 42, errors: 0, drift: 0.08 },
    { time: '02:00', volume: 280, latency: 40, errors: 0, drift: 0.07 },
    { time: '04:00', volume: 190, latency: 38, errors: 0, drift: 0.09 },
    { time: '06:00', volume: 340, latency: 39, errors: 1, drift: 0.08 },
    { time: '08:00', volume: 890, latency: 41, errors: 2, drift: 0.12 },
    { time: '10:00', volume: 1420, latency: 43, errors: 3, drift: 0.15 },
    { time: '12:00', volume: 1680, latency: 45, errors: 2, drift: 0.22 },
    { time: '14:00', volume: 1540, latency: 39, errors: 4, drift: 0.31 },
    { time: '16:00', volume: 1820, latency: 38, errors: 3, drift: 0.38 },
    { time: '18:00', volume: 1350, latency: 37, errors: 1, drift: 0.36 },
    { time: '20:00', volume: 980, latency: 38, errors: 1, drift: 0.34 },
    { time: '22:00', volume: 640, latency: 39, errors: 1, drift: 0.35 },
  ];

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (!currentModel) {
    return <div className="p-8 text-center text-brand-slate">Loading Observatory...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* A. Welcome Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-slate mb-1">
            <Calendar size={14} className="text-brand-indigo" />
            <span>{currentDateStr}</span>
            <span>•</span>
            <span className="text-brand-indigo font-medium">Last evaluated 12 mins ago</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-brand-midnight tracking-tight">
            Good morning, <span className="text-brand-indigo">Sanskruti</span>.
          </h1>
          <p className="text-sm text-brand-slate mt-0.5">
            Here's what's happening with your machine learning models today.
          </p>
        </div>

        {/* Demo Mode or Live Status Alert Pill */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-brand-border px-3.5 py-2 rounded-2xl shadow-subtle flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-mint animate-pulse" />
            <span className="text-xs font-semibold text-brand-midnight">
              All 3 Workspaces Operational
            </span>
          </div>
        </div>
      </div>

      {/* B. Hero Centerpiece: Model Observatory */}
      <ModelObservatory model={currentModel} lastPredictionTime="2 mins ago" />

      {/* C. Primary Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {DEMO_METRICS.map((metric) => {
          let badgeColor = 'bg-brand-ivory text-brand-slate border-brand-border';
          if (metric.status === 'healthy') {
            badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
          } else if (metric.status === 'warning') {
            badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
          }

          return (
            <div
              key={metric.id}
              className="card-subtle p-5 flex flex-col justify-between hover:shadow-card-hover transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-slate">
                    {metric.title}
                  </span>
                  {metric.change && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${badgeColor}`}
                    >
                      {metric.change.value}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-display font-extrabold text-brand-midnight tracking-tight">
                    {metric.value}
                  </span>
                </div>

                <p className="text-xs text-brand-slate mt-1.5 leading-snug">
                  {metric.subtitle}
                </p>
              </div>

              {/* Sparkline mini-chart */}
              {metric.sparkline && (
                <div className="h-10 mt-4 pt-2 border-t border-brand-border/40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metric.sparkline.map((v, i) => ({ val: v, idx: i }))}>
                      <defs>
                        <linearGradient id={`spark-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor={metric.status === 'warning' ? '#F4B942' : '#635BFF'}
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={metric.status === 'warning' ? '#F4B942' : '#635BFF'}
                            stopOpacity={0.0}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="val"
                        stroke={metric.status === 'warning' ? '#F4B942' : '#635BFF'}
                        strokeWidth={2}
                        fill={`url(#spark-${metric.id})`}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* F. Recommended Next Action Panel */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-indigo to-brand-indigo-dark p-6 sm:p-7 text-white shadow-float">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-sm">
              <Sparkles size={13} className="text-brand-mint" />
              <span>Recommended Next Step</span>
            </div>
            <h3 className="text-xl font-display font-extrabold tracking-tight">
              Review recent change in Petal Width distribution
            </h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              The latest evaluation indicates that incoming petal-width measurements differ from the
              reference dataset (KS statistic = 0.38, p = 0.002). Review the incoming sample source or retrain model weights.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/monitoring"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-brand-indigo font-bold text-xs sm:text-sm hover:bg-brand-ivory transition-all shadow-md hover:scale-105 active:scale-95"
            >
              <span>Investigate Drift</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              to="/alerts"
              className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-xs sm:text-sm hover:bg-white/20 transition-all border border-white/20"
            >
              View Alerts ({unreadAlertsCount})
            </Link>
          </div>
        </div>
      </div>

      {/* E & D. Model Health Trend Chart & Health Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Model Health Trend Chart */}
        <div className="lg:col-span-7 card-subtle p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-display font-extrabold text-brand-midnight tracking-tight">
                Model Health & Telemetry Trend
              </h3>
              <p className="text-xs text-brand-slate">
                Dedicated independent visualizations over the selected operational window
              </p>
            </div>

            {/* Time Window Selector */}
            <div className="flex items-center gap-1 bg-brand-ivory p-1 rounded-xl border border-brand-border self-start">
              {(['1h', '24h', '7d'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    timeRange === t
                      ? 'bg-white text-brand-midnight shadow-subtle'
                      : 'text-brand-slate hover:text-brand-midnight'
                  }`}
                >
                  {t === '1h' ? '1 Hour' : t === '24h' ? '24 Hours' : '7 Days'}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-2 border-b border-brand-border pb-2 overflow-x-auto">
            <button
              onClick={() => setTrendTab('volume')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                trendTab === 'volume'
                  ? 'bg-brand-indigo-tint text-brand-indigo border border-brand-indigo/30'
                  : 'text-brand-slate hover:text-brand-midnight'
              }`}
            >
              Request Volume (req/hr)
            </button>
            <button
              onClick={() => setTrendTab('latency')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                trendTab === 'latency'
                  ? 'bg-brand-indigo-tint text-brand-indigo border border-brand-indigo/30'
                  : 'text-brand-slate hover:text-brand-midnight'
              }`}
            >
              Inference Latency (ms)
            </button>
            <button
              onClick={() => setTrendTab('errors')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                trendTab === 'errors'
                  ? 'bg-brand-indigo-tint text-brand-indigo border border-brand-indigo/30'
                  : 'text-brand-slate hover:text-brand-midnight'
              }`}
            >
              Prediction Errors
            </button>
            <button
              onClick={() => setTrendTab('drift')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                trendTab === 'drift'
                  ? 'bg-brand-indigo-tint text-brand-indigo border border-brand-indigo/30'
                  : 'text-brand-slate hover:text-brand-midnight'
              }`}
            >
              Drift Statistic (KS)
            </button>
          </div>

          {/* Chart Canvas */}
          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {trendTab === 'volume' ? (
                <AreaChart data={trendData24h}>
                  <defs>
                    <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#635BFF" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#635BFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F2ED" />
                  <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#17212B',
                      borderRadius: '12px',
                      color: '#FFF',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="volume"
                    name="Requests"
                    stroke="#635BFF"
                    strokeWidth={2.5}
                    fill="url(#volGradient)"
                  />
                </AreaChart>
              ) : trendTab === 'latency' ? (
                <AreaChart data={trendData24h}>
                  <defs>
                    <linearGradient id="latGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#79E2B5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#79E2B5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F2ED" />
                  <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} unit="ms" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#17212B',
                      borderRadius: '12px',
                      color: '#FFF',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="latency"
                    name="Latency (ms)"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fill="url(#latGradient)"
                  />
                </AreaChart>
              ) : trendTab === 'errors' ? (
                <BarChart data={trendData24h}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F2ED" />
                  <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#17212B',
                      borderRadius: '12px',
                      color: '#FFF',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                  <Bar dataKey="errors" name="Failed Requests" fill="#F16C68" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <AreaChart data={trendData24h}>
                  <defs>
                    <linearGradient id="driftGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F4B942" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F4B942" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F2ED" />
                  <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 0.5]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#17212B',
                      borderRadius: '12px',
                      color: '#FFF',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="drift"
                    name="KS Statistic"
                    stroke="#F4B942"
                    strokeWidth={2.5}
                    fill="url(#driftGradient)"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Model Health Timeline */}
        <div className="lg:col-span-5 card-subtle p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-display font-extrabold text-brand-midnight tracking-tight">
                Activity Timeline
              </h3>
              <p className="text-xs text-brand-slate">
                Key evaluation and telemetry events
              </p>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-ivory border border-brand-border text-brand-slate">
              {DEMO_TIMELINE.length} Events
            </span>
          </div>

          {/* Timeline Feed */}
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {DEMO_TIMELINE.map((event) => {
              const isSelected = selectedTimelineEvent?.id === event.id;
              let dotColor = 'bg-brand-indigo';
              if (event.status === 'warning') dotColor = 'bg-brand-amber';
              if (event.status === 'critical') dotColor = 'bg-brand-coral';
              if (event.status === 'healthy') dotColor = 'bg-brand-mint-deep';

              return (
                <div
                  key={event.id}
                  onClick={() => setSelectedTimelineEvent(event)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-indigo-tint/50 border-brand-indigo/40 shadow-sm'
                      : 'bg-brand-ivory/50 border-brand-border/60 hover:bg-white hover:border-brand-border'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${dotColor}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-brand-midnight truncate">
                          {event.title}
                        </span>
                        <span className="text-[10px] text-brand-slate font-medium whitespace-nowrap">
                          {event.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-brand-slate mt-0.5 line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Event Detail Modal / Expanded View */}
          {selectedTimelineEvent && (
            <div className="p-3.5 rounded-2xl bg-white border border-brand-border text-xs space-y-1.5 mt-2">
              <span className="text-[10px] uppercase font-bold text-brand-indigo block">
                Selected Event Detail
              </span>
              <p className="font-semibold text-brand-midnight">
                {selectedTimelineEvent.title}
              </p>
              <p className="text-brand-slate leading-relaxed">
                {selectedTimelineEvent.details || selectedTimelineEvent.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
