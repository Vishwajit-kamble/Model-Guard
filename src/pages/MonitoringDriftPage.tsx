import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Play,
  Calendar,
  Sparkles,
  Info,
  Clock,
  Database,
  BarChart2,
  TrendingDown,
  CheckCircle2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { DriftEvaluation, FeatureDriftResult } from '../types';

export const MonitoringDriftPage: React.FC = () => {
  const { currentModel, showToast } = useApp();
  const [evaluation, setEvaluation] = useState<DriftEvaluation | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<FeatureDriftResult | null>(null);
  const [windowOption, setWindowOption] = useState<'1h' | '24h' | '7d'>('24h');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      const data = await api.getDriftEvaluation(currentModel?.id || 'model-iris-01');
      setEvaluation(data);
      if (data && data.features.length > 0) {
        // default select the drifting feature or first feature
        const drifting = data.features.find((f) => f.status === 'warning') || data.features[0];
        setSelectedFeature(drifting);
      }
    };
    load();
  }, [currentModel]);

  const handleRunEvaluation = async () => {
    if (isEvaluating) return;
    setIsEvaluating(true);

    try {
      const updated = await api.triggerEvaluation(
        currentModel?.id || 'model-iris-01',
        windowOption
      );
      setEvaluation(updated);
      showToast(
        'Drift Evaluation Complete',
        'success',
        `Evaluated ${updated.featuresEvaluated} features across ${updated.incomingSampleSize} incoming observations.`
      );
    } catch {
      showToast('Evaluation Failed', 'error');
    } finally {
      setIsEvaluating(false);
    }
  };

  if (!evaluation) {
    return <div className="p-12 text-center text-brand-slate">Loading Observatory Telemetry...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* A. Human-Readable Introduction Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-brand-border p-6 sm:p-8 shadow-card">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-indigo-tint text-brand-indigo text-xs font-semibold">
            <GitCompare size={14} />
            <span>Living Statistical Surveillance</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-brand-midnight tracking-tight">
            Is your model seeing something new?
          </h1>

          <p className="text-sm sm:text-base text-brand-slate leading-relaxed">
            Compare the distribution of live incoming prediction inputs with the baseline dataset your model was originally trained on.
          </p>
        </div>

        {/* 4-Step Visual Flow Diagram */}
        <div className="mt-8 pt-6 border-t border-brand-border/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-2xl bg-brand-ivory/60 border border-brand-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-indigo text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                1
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase text-brand-slate block">Source</span>
                <span className="text-xs font-bold text-brand-midnight truncate block">
                  Reference Baseline
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-brand-ivory/60 border border-brand-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-sky text-blue-950 flex items-center justify-center text-xs font-bold flex-shrink-0">
                2
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase text-brand-slate block">Live Stream</span>
                <span className="text-xs font-bold text-brand-midnight truncate block">
                  Incoming Inputs ({evaluation.incomingSampleSize} samples)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-brand-ivory/60 border border-brand-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-amber text-amber-950 flex items-center justify-center text-xs font-bold flex-shrink-0">
                3
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase text-brand-slate block">Test</span>
                <span className="text-xs font-bold text-brand-midnight truncate block">
                  Kolmogorov-Smirnov Test
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-brand-mint-tint border border-brand-mint/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-mint-dark text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                4
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase text-emerald-800 block">Decision</span>
                <span className="text-xs font-bold text-emerald-950 truncate block">
                  {evaluation.featuresDrifting > 0 ? 'Drift Alert Triggered' : 'Healthy Consistency'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Window Controls & Trigger Bar */}
      <div className="card-subtle p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-brand-indigo" />
          <span className="text-xs font-bold text-brand-midnight">Evaluation Horizon:</span>
          <div className="flex items-center gap-1 bg-brand-ivory p-1 rounded-xl border border-brand-border">
            {(['1h', '24h', '7d'] as const).map((w) => (
              <button
                key={w}
                onClick={() => setWindowOption(w)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  windowOption === w
                    ? 'bg-white text-brand-midnight shadow-subtle'
                    : 'text-brand-slate hover:text-brand-midnight'
                }`}
              >
                {w === '1h' ? 'Last Hour' : w === '24h' ? 'Last 24 Hours' : 'Last 7 Days'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-brand-slate font-medium hidden md:inline">
            Evaluated: {evaluation.timestamp}
          </span>
          <button
            onClick={handleRunEvaluation}
            disabled={isEvaluating}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-sm transition-all ${
              isEvaluating ? 'bg-brand-indigo/60 cursor-not-allowed' : 'bg-brand-indigo hover:bg-brand-indigo-dark active:scale-95'
            }`}
          >
            {isEvaluating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Computing Divergence...</span>
              </>
            ) : (
              <>
                <Play size={14} className="fill-current" />
                <span>Trigger Manual Evaluation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* B. Feature Monitoring Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-display font-extrabold text-brand-midnight">
            Feature Divergence Matrices
          </h2>
          <span className="text-xs font-mono text-brand-slate">
            Alpha significance threshold: α = 0.05
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {evaluation.features.map((feat) => {
            const isSelected = selectedFeature?.featureName === feat.featureName;
            const isWarning = feat.status === 'warning';

            return (
              <div
                key={feat.featureName}
                onClick={() => setSelectedFeature(feat)}
                className={`card-subtle p-5 cursor-pointer transition-all ${
                  isSelected
                    ? 'ring-2 ring-brand-indigo border-transparent shadow-card-hover bg-brand-indigo-tint/10'
                    : 'hover:border-brand-slate-light'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-brand-slate block">
                      Feature
                    </span>
                    <h3 className="text-base font-bold text-brand-midnight">
                      {feat.displayName}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      isWarning
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {isWarning ? <AlertTriangle size={11} /> : <ShieldCheck size={11} />}
                    <span>{isWarning ? 'DRIFT' : 'NORMAL'}</span>
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-brand-ivory border border-brand-border/60">
                    <span className="text-[10px] text-brand-slate block">KS Distance</span>
                    <span className="font-mono font-bold text-brand-midnight">
                      {feat.driftScore.toFixed(3)}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-brand-ivory border border-brand-border/60">
                    <span className="text-[10px] text-brand-slate block">p-value</span>
                    <span
                      className={`font-mono font-bold ${
                        feat.pValue < 0.05 ? 'text-amber-600' : 'text-emerald-700'
                      }`}
                    >
                      {feat.pValue.toFixed(3)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-brand-slate flex justify-between">
                  <span>Ref Mean: {feat.referenceMean}cm</span>
                  <span>Live Mean: {feat.incomingMean}cm</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* C. Distribution Comparison Deep Dive */}
      {selectedFeature && (
        <div className="card-subtle p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border/60 pb-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-brand-indigo">
                Selected Deep Dive
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-extrabold text-brand-midnight tracking-tight">
                {selectedFeature.displayName} Distribution Comparison
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-slate">
                <span className="w-3 h-3 rounded bg-brand-indigo" />
                <span>Reference Baseline</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-slate">
                <span className="w-3 h-3 rounded bg-brand-amber" />
                <span>Live Incoming Data</span>
              </div>
            </div>
          </div>

          {/* Histogram Chart */}
          <div className="h-72 sm:h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={selectedFeature.distribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F2ED" />
                <XAxis dataKey="bin" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#17212B',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Bar
                  dataKey="referenceValue"
                  name="Reference Baseline (%)"
                  fill="#635BFF"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="incomingValue"
                  name="Live Incoming (%)"
                  fill="#F4B942"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Statistical Explanation and Plain-Language Impact Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-brand-ivory/80 border border-brand-border space-y-2">
              <span className="text-[10px] uppercase font-bold text-brand-slate block">
                Statistical Observation
              </span>
              <p className="text-xs sm:text-sm text-brand-midnight leading-relaxed font-medium">
                {selectedFeature.explanation}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">
                Potential Impact & Recommendation
              </span>
              <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
                {selectedFeature.possibleImpact} {selectedFeature.recommendedAction}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
