import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Filter,
  ArrowRight,
  ShieldAlert,
  GitCompare,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { IncidentAlert } from '../types';

export const AlertsPage: React.FC = () => {
  const { alerts, resolveAlertById } = useApp();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<IncidentAlert | null>(
    alerts.length > 0 ? alerts[0] : null
  );

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity === 'all') return true;
    if (filterSeverity === 'resolved') return alert.status === 'resolved';
    return alert.severity === filterSeverity;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-brand-midnight tracking-tight">
          Incidents & Telemetry Alerts
        </h1>
        <p className="text-sm text-brand-slate mt-0.5">
          Intelligent automated investigation workspace diagnosing model drift, latency spikes, and input anomalies
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-border pb-3 overflow-x-auto">
        {(
          [
            { key: 'all', label: 'All Incidents' },
            { key: 'warning', label: 'Warnings' },
            { key: 'critical', label: 'Critical' },
            { key: 'resolved', label: 'Resolved' },
          ] as const
        ).map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterSeverity(f.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterSeverity === f.key
                ? 'bg-brand-indigo-tint text-brand-indigo border border-brand-indigo/30'
                : 'text-brand-slate hover:text-brand-midnight'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Main 2-Column Investigation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Alerts List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="card-subtle p-8 text-center text-brand-slate">
              <CheckCircle2 size={32} className="mx-auto text-emerald-600 mb-2" />
              <p className="text-sm font-semibold text-brand-midnight">No incidents found</p>
              <p className="text-xs">All monitored systems are within acceptable bounds.</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isSelected = selectedAlert?.id === alert.id;
              let badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
              let Icon = AlertTriangle;

              if (alert.severity === 'critical') {
                badgeColor = 'bg-rose-50 text-rose-800 border-rose-200';
                Icon = AlertCircle;
              } else if (alert.severity === 'info' || alert.status === 'resolved') {
                badgeColor = 'bg-gray-100 text-gray-700 border-gray-200';
                Icon = CheckCircle2;
              }

              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`card-subtle p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'ring-2 ring-brand-indigo border-transparent shadow-card-hover bg-brand-indigo-tint/10'
                      : 'hover:border-brand-slate-light'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${badgeColor}`}
                      >
                        <Icon size={11} />
                        <span>{alert.status === 'resolved' ? 'RESOLVED' : alert.severity}</span>
                      </span>
                      <span className="text-[11px] font-mono text-brand-slate">
                        {alert.detectedAt}
                      </span>
                    </div>

                    <span className="text-[11px] font-bold text-brand-indigo truncate max-w-[120px]">
                      {alert.modelName}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-brand-midnight mt-2 leading-snug">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-brand-slate mt-1 line-clamp-2">
                    {alert.summary}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Detailed Investigation Workspace (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedAlert ? (
            <div className="card-subtle p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border/60 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold uppercase text-brand-slate">
                      Incident Ref #{selectedAlert.id}
                    </span>
                    <span>•</span>
                    <span className="text-xs font-mono text-brand-slate">
                      {selectedAlert.detectedAt}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-extrabold text-brand-midnight tracking-tight">
                    {selectedAlert.title}
                  </h2>
                </div>

                {selectedAlert.status !== 'resolved' && (
                  <button
                    onClick={() => resolveAlertById(selectedAlert.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm transition-all"
                  >
                    <CheckCircle2 size={14} />
                    <span>Mark Resolved</span>
                  </button>
                )}
              </div>

              {/* 5 Inquiry Pillars */}
              <div className="space-y-4">
                {/* 1. What Happened */}
                <div className="p-4 rounded-2xl bg-brand-ivory/80 border border-brand-border space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-brand-slate block">
                    1. What Happened?
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-brand-midnight leading-relaxed">
                    {selectedAlert.summary}
                  </p>
                </div>

                {/* 2. Model & Feature Affected */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-brand-ivory/60 border border-brand-border/70">
                    <span className="text-[10px] uppercase font-bold text-brand-slate block">
                      Target Model
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-brand-midnight mt-0.5 block">
                      {selectedAlert.modelName}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-brand-ivory/60 border border-brand-border/70">
                    <span className="text-[10px] uppercase font-bold text-brand-slate block">
                      Affected Feature
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-brand-midnight mt-0.5 block">
                      {selectedAlert.affectedFeature || 'Multiple vectors'}
                    </span>
                  </div>
                </div>

                {/* 3. Evidence */}
                <div className="p-4 rounded-2xl bg-brand-midnight text-white space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-brand-slate-light block">
                    3. Statistical Telemetry Evidence
                  </span>
                  <p className="text-xs font-mono text-emerald-400">
                    {selectedAlert.metricEvidence}
                  </p>
                  <p className="text-xs text-white/80 pt-1">
                    {selectedAlert.observation}
                  </p>
                </div>

                {/* 4. Possible Impact */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">
                    4. Potential Operational Impact
                  </span>
                  <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
                    {selectedAlert.possibleImpact}
                  </p>
                </div>

                {/* 5. Recommended Action */}
                <div className="p-4 rounded-2xl bg-brand-indigo-tint/60 border border-brand-indigo/30 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-brand-indigo block">
                    5. Prescribed Diagnostic Next Steps
                  </span>
                  <p className="text-xs sm:text-sm text-brand-midnight leading-relaxed font-medium">
                    {selectedAlert.recommendedAction}
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/monitoring"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-indigo hover:underline"
                    >
                      <GitCompare size={14} />
                      <span>Inspect Feature in Data Drift Observatory</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card-subtle p-12 text-center text-brand-slate">
              Select an incident from the left to view the complete diagnostic record.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
