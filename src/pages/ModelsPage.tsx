import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid,
  List,
  PlusCircle,
  Activity,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Clock,
  ArrowRight,
  Terminal,
  Zap,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ModelRecord } from '../types';

export const ModelsPage: React.FC = () => {
  const { models, setCurrentModelId } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredModels = models.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.framework.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ? true : model.status === statusFilter;

    const matchesType =
      typeFilter === 'all' ? true : model.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-brand-midnight tracking-tight">
            Registered Models
          </h1>
          <p className="text-sm text-brand-slate mt-0.5">
            Living inventory of all monitored machine learning systems, artifacts, and baselines
          </p>
        </div>

        <Link
          to="/models/register"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-indigo text-white text-xs sm:text-sm font-semibold hover:bg-brand-indigo-dark shadow-sm shadow-brand-indigo/30 transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle size={16} />
          <span>Register a Model</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-subtle p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by model name, description, framework..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-brand-ivory/60 border border-brand-border text-xs sm:text-sm text-brand-midnight placeholder:text-brand-slate focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:bg-white transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-brand-ivory/60 border border-brand-border text-xs font-semibold text-brand-midnight focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 transition-all cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="healthy">Healthy</option>
            <option value="warning">Warning / Drift</option>
            <option value="critical">Critical</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-brand-ivory/60 border border-brand-border text-xs font-semibold text-brand-midnight focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 transition-all cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="classification">Classification</option>
            <option value="regression">Regression</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-brand-ivory p-1 rounded-xl border border-brand-border">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-brand-indigo shadow-subtle'
                  : 'text-brand-slate hover:text-brand-midnight'
              }`}
              title="Grid View"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-brand-indigo shadow-subtle'
                  : 'text-brand-slate hover:text-brand-midnight'
              }`}
              title="Table View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredModels.length === 0 ? (
        <div className="card-subtle p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-brand-indigo-tint text-brand-indigo flex items-center justify-center mx-auto shadow-sm">
            <Activity size={32} />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-brand-midnight">
              Your observatory is waiting for its first model.
            </h3>
            <p className="text-xs sm:text-sm text-brand-slate max-w-md mx-auto mt-1">
              No matching models found. Register a machine learning model to begin continuous drift monitoring and telemetry.
            </p>
          </div>
          <Link
            to="/models/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-indigo text-white text-xs sm:text-sm font-semibold hover:bg-brand-indigo-dark shadow-sm transition-all"
          >
            <PlusCircle size={16} />
            <span>Register your first model</span>
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => {
            const isHealthy = model.status === 'healthy';
            const isWarning = model.status === 'warning';
            let statusBadge = 'bg-emerald-50 text-emerald-800 border-emerald-200';
            let StatusIcon = ShieldCheck;
            let statusLabel = 'Healthy';

            if (isWarning) {
              statusBadge = 'bg-amber-50 text-amber-800 border-amber-200';
              StatusIcon = AlertTriangle;
              statusLabel = 'Drift Warning';
            } else if (model.status === 'critical') {
              statusBadge = 'bg-rose-50 text-rose-800 border-rose-200';
              StatusIcon = AlertCircle;
              statusLabel = 'Critical Incident';
            }

            return (
              <div
                key={model.id}
                className="card-subtle p-6 flex flex-col justify-between hover:shadow-card-hover transition-all group"
              >
                <div className="space-y-4">
                  {/* Top Bar: Icon, Version, Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-brand-ivory border border-brand-border flex items-center justify-center text-brand-indigo group-hover:bg-brand-indigo group-hover:text-white transition-colors shadow-subtle">
                        <Activity size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-slate block">
                          {model.type}
                        </span>
                        <span className="text-xs font-mono font-semibold text-brand-midnight">
                          {model.version}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusBadge}`}
                    >
                      <StatusIcon size={12} />
                      <span>{statusLabel}</span>
                    </div>
                  </div>

                  {/* Model Name & Description */}
                  <div>
                    <h3 className="text-lg font-display font-bold text-brand-midnight tracking-tight group-hover:text-brand-indigo transition-colors">
                      {model.name}
                    </h3>
                    <p className="text-xs text-brand-slate mt-1 line-clamp-2 leading-relaxed">
                      {model.description}
                    </p>
                  </div>

                  {/* Telemetry Grid */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div className="p-2.5 rounded-xl bg-brand-ivory/60 border border-brand-border/60">
                      <span className="text-[10px] uppercase font-bold text-brand-slate block">
                        Predictions
                      </span>
                      <span className="text-xs sm:text-sm font-mono font-bold text-brand-midnight">
                        {model.totalPredictions.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-brand-ivory/60 border border-brand-border/60">
                      <span className="text-[10px] uppercase font-bold text-brand-slate block">
                        Avg Latency
                      </span>
                      <span className="text-xs sm:text-sm font-mono font-bold text-brand-midnight">
                        {model.avgLatencyMs} ms
                      </span>
                    </div>
                  </div>

                  {/* Framework & Sample Tag */}
                  <div className="flex items-center justify-between text-[11px] text-brand-slate pt-1 border-t border-brand-border/60">
                    <span className="font-mono">{model.framework}</span>
                    {model.isDemo && (
                      <span className="font-semibold text-brand-indigo bg-brand-indigo-tint px-2 py-0.5 rounded text-[10px]">
                        Demo Benchmark
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center gap-2 pt-5 border-t border-brand-border/80 mt-5">
                  <Link
                    to={`/models/${model.id}`}
                    onClick={() => setCurrentModelId(model.id)}
                    className="flex-1 text-center py-2 px-3 rounded-xl bg-brand-ivory hover:bg-white border border-brand-border text-xs font-bold text-brand-midnight shadow-subtle transition-all"
                  >
                    View Details
                  </Link>

                  <Link
                    to="/predictions"
                    onClick={() => setCurrentModelId(model.id)}
                    className="p-2 rounded-xl bg-brand-indigo-tint text-brand-indigo hover:bg-brand-indigo hover:text-white transition-all shadow-subtle"
                    title="Test Prediction"
                  >
                    <Terminal size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="card-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-ivory border-b border-brand-border uppercase font-mono text-[11px] text-brand-slate">
                <tr>
                  <th className="px-5 py-3.5">Model Name</th>
                  <th className="px-5 py-3.5">Version</th>
                  <th className="px-5 py-3.5">Type</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Total Inferences</th>
                  <th className="px-5 py-3.5">Avg Latency</th>
                  <th className="px-5 py-3.5">Framework</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {filteredModels.map((model) => (
                  <tr key={model.id} className="hover:bg-brand-ivory/50 transition-colors">
                    <td className="px-5 py-4 font-bold text-brand-midnight">
                      <div className="flex items-center gap-2">
                        <Activity size={14} className="text-brand-indigo" />
                        <span>{model.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-brand-slate">{model.version}</td>
                    <td className="px-5 py-4 uppercase font-mono text-brand-slate">{model.type}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          model.status === 'healthy'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {model.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono">{model.totalPredictions.toLocaleString()}</td>
                    <td className="px-5 py-4 font-mono">{model.avgLatencyMs} ms</td>
                    <td className="px-5 py-4 font-mono text-brand-slate">{model.framework}</td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/models/${model.id}`}
                        onClick={() => setCurrentModelId(model.id)}
                        className="inline-flex items-center gap-1 text-brand-indigo font-bold hover:underline"
                      >
                        <span>Details</span>
                        <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
