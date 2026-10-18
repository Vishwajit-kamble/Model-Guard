import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Terminal,
  Activity,
  GitCompare,
  Database,
  Calendar,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Code,
  FileText,
  Sliders,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useApp } from '../context/AppContext';

export const ModelDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { models, setCurrentModelId } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'reliability' | 'versions'>('overview');

  const model = models.find((m) => m.id === id) || models[0];

  if (!model) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-brand-midnight">Model Not Found</h2>
        <Link to="/models" className="mt-4 inline-block text-brand-indigo font-semibold">
          Return to All Models
        </Link>
      </div>
    );
  }

  const latencyHistory = [
    { time: '10:00', latency: 36, volume: 420 },
    { time: '11:00', latency: 41, volume: 740 },
    { time: '12:00', latency: 45, volume: 920 },
    { time: '13:00', latency: 39, volume: 680 },
    { time: '14:00', latency: 38, volume: 1100 },
    { time: '15:00', latency: 37, volume: 850 },
    { time: '16:00', latency: 39, volume: 1240 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Back button */}
      <div>
        <Link
          to="/models"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-slate hover:text-brand-midnight transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Models Library</span>
        </Link>
      </div>

      {/* Model Header Card */}
      <div className="card-subtle p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-indigo to-brand-mint flex items-center justify-center text-white shadow-md flex-shrink-0">
              <Activity size={28} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    model.status === 'healthy'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {model.status === 'healthy' ? <ShieldCheck size={13} /> : <AlertTriangle size={13} />}
                  <span className="capitalize">{model.status}</span>
                </span>

                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-brand-ivory border border-brand-border text-brand-slate">
                  {model.version}
                </span>

                <span className="text-xs font-mono font-semibold uppercase px-2 py-0.5 rounded-md bg-brand-ivory border border-brand-border text-brand-slate">
                  {model.type}
                </span>

                <span className="text-xs font-mono text-brand-indigo bg-brand-indigo-tint px-2 py-0.5 rounded-md border border-brand-indigo/30">
                  {model.framework}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-brand-midnight tracking-tight">
                {model.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-brand-slate mt-2">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  Registered {model.registeredAt}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  Active {model.lastActive}
                </span>
                <span>•</span>
                <span className="font-mono text-emerald-700 font-semibold">
                  {model.deploymentStatus.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/predictions"
              onClick={() => setCurrentModelId(model.id)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-indigo text-white text-xs sm:text-sm font-semibold hover:bg-brand-indigo-dark shadow-sm transition-all"
            >
              <Terminal size={15} />
              <span>Test Live Prediction</span>
            </Link>

            <Link
              to="/monitoring"
              onClick={() => setCurrentModelId(model.id)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-brand-border text-brand-midnight text-xs sm:text-sm font-semibold hover:bg-brand-ivory shadow-subtle transition-all"
            >
              <GitCompare size={15} className="text-brand-indigo" />
              <span>View Data Drift</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-brand-border/80 pt-4 overflow-x-auto">
          {(
            [
              { key: 'overview', label: 'Overview & Schema' },
              { key: 'activity', label: 'Prediction Activity' },
              { key: 'reliability', label: 'Reliability & Drift' },
              { key: 'versions', label: 'Version History' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-brand-indigo-tint text-brand-indigo border border-brand-indigo/30'
                  : 'text-brand-slate hover:text-brand-midnight'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview & Schema */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            {/* Description */}
            <div className="card-subtle p-6 space-y-3">
              <h3 className="text-base font-display font-extrabold text-brand-midnight">
                Model Architecture & Summary
              </h3>
              <p className="text-sm text-brand-slate leading-relaxed">
                {model.description}
              </p>
            </div>

            {/* Input Features Schema Table */}
            <div className="card-subtle p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-display font-extrabold text-brand-midnight">
                  Input Feature Specifications ({model.inputFeatures.length} Monitored Features)
                </h3>
                <span className="text-xs font-mono text-brand-slate">Strict Schema Enforced</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-brand-ivory uppercase font-mono text-[11px] text-brand-slate border-b border-brand-border">
                    <tr>
                      <th className="px-4 py-3">Feature Key</th>
                      <th className="px-4 py-3">Display Name</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Valid Range / Default</th>
                      <th className="px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/60">
                    {model.inputFeatures.map((f) => (
                      <tr key={f.name} className="hover:bg-brand-ivory/40">
                        <td className="px-4 py-3 font-mono font-bold text-brand-midnight">
                          {f.name}
                        </td>
                        <td className="px-4 py-3 font-semibold">{f.displayName}</td>
                        <td className="px-4 py-3 font-mono uppercase text-brand-slate">{f.type}</td>
                        <td className="px-4 py-3 font-mono">
                          {f.min !== undefined && f.max !== undefined
                            ? `${f.min} - ${f.max} ${f.unit || ''}`
                            : 'N/A'}{' '}
                          <span className="text-brand-slate">(def: {f.default})</span>
                        </td>
                        <td className="px-4 py-3 text-brand-slate">{f.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right side metadata */}
          <div className="lg:col-span-4 space-y-6">
            <div className="card-subtle p-6 space-y-4">
              <h3 className="text-base font-display font-extrabold text-brand-midnight">
                Reference Dataset
              </h3>

              <div className="p-3.5 rounded-2xl bg-brand-ivory border border-brand-border space-y-2">
                <div className="flex items-center gap-2">
                  <Database size={16} className="text-brand-indigo" />
                  <span className="text-xs font-bold text-brand-midnight truncate">
                    {model.referenceDataset.name}
                  </span>
                </div>
                <div className="text-xs text-brand-slate space-y-1 pt-1 border-t border-brand-border/60">
                  <div className="flex justify-between">
                    <span>Sample Count:</span>
                    <span className="font-mono font-bold text-brand-midnight">
                      {model.referenceDataset.sampleCount.toLocaleString()} rows
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uploaded:</span>
                    <span className="font-mono text-brand-midnight">
                      {model.referenceDataset.uploadedAt}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-brand-border space-y-2">
                <span className="text-[10px] uppercase font-bold text-brand-slate block">
                  Output Target Definition
                </span>
                <span className="text-xs font-bold text-brand-midnight block">
                  {model.outputSchema.name} ({model.outputSchema.type})
                </span>
                {model.outputSchema.classes && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {model.outputSchema.classes.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-indigo-tint text-brand-indigo"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Activity */}
      {activeTab === 'activity' && (
        <div className="card-subtle p-6 space-y-6">
          <div>
            <h3 className="text-base font-display font-extrabold text-brand-midnight">
              Response Latency & Traffic Volume
            </h3>
            <p className="text-xs text-brand-slate">
              Continuous request profiling over recent monitoring windows
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={latencyHistory}>
                <defs>
                  <linearGradient id="detailLat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#635BFF" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#635BFF" stopOpacity={0} />
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
                  name="Inference Latency"
                  stroke="#635BFF"
                  strokeWidth={2.5}
                  fill="url(#detailLat)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tab 3: Reliability */}
      {activeTab === 'reliability' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-subtle p-6 space-y-2">
            <span className="text-[10px] uppercase font-bold text-brand-slate">
              Input Validation Failures
            </span>
            <div className="text-2xl font-extrabold font-display text-brand-midnight">0.00%</div>
            <p className="text-xs text-brand-slate">
              All incoming requests adhered strictly to numeric bounds and schema definitions.
            </p>
          </div>

          <div className="card-subtle p-6 space-y-2">
            <span className="text-[10px] uppercase font-bold text-brand-slate">
              Active Data Drift Alerts
            </span>
            <div className="text-2xl font-extrabold font-display text-amber-600">
              {model.activeDriftAlerts} Feature Flagged
            </div>
            <p className="text-xs text-brand-slate">
              Petal width has drifted past the 0.05 Kolmogorov-Smirnov significance threshold.
            </p>
          </div>

          <div className="card-subtle p-6 space-y-2">
            <span className="text-[10px] uppercase font-bold text-brand-slate">
              Labeled Accuracy Metric
            </span>
            <div className="text-sm font-semibold text-brand-slate mt-2 italic">
              "Accuracy requires labeled evaluation ground truth."
            </div>
            <p className="text-xs text-brand-slate mt-1">
              ModelGuard adheres to scientific monitoring best practices and does not invent accuracy scores without verified ground truth labels.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Version History */}
      {activeTab === 'versions' && (
        <div className="card-subtle p-6 space-y-4">
          <h3 className="text-base font-display font-extrabold text-brand-midnight">
            Version Lineage & Deployment History
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-brand-ivory border border-brand-border flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-brand-midnight">v1.4.2</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    CURRENT PRODUCTION
                  </span>
                </div>
                <p className="text-xs text-brand-slate mt-1">
                  Active since October 2026. Optimized ONNX graph with vectorized feature scaling.
                </p>
              </div>
              <span className="text-xs font-mono text-brand-slate">Latency: 38ms</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-brand-border flex items-center justify-between opacity-75">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-brand-midnight">v1.4.0</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                    SUPERSEDED
                  </span>
                </div>
                <p className="text-xs text-brand-slate mt-1">
                  Baseline model release trained on classic 1,500 Fisher benchmark instances.
                </p>
              </div>
              <span className="text-xs font-mono text-brand-slate">Latency: 44ms</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
