import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Clock,
  ArrowRight,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { ModelRecord } from '../../types';

interface ModelObservatoryProps {
  model: ModelRecord;
  lastPredictionTime?: string;
}

export const ModelObservatory: React.FC<ModelObservatoryProps> = ({
  model,
  lastPredictionTime = 'Just now',
}) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Status visual configurations
  const isHealthy = model.status === 'healthy';
  const isWarning = model.status === 'warning';
  const isCritical = model.status === 'critical';

  let statusBadgeBg = 'bg-brand-mint-tint border-brand-mint/60 text-emerald-800';
  let coreGradient = 'from-brand-mint via-brand-mint-dark to-emerald-600';
  let pulseRingColor = 'border-brand-mint/50';
  let statusText = 'Healthy & Balanced';
  let StatusIcon = ShieldCheck;
  let explanation =
    'Your model is responding normally, and no significant input-distribution changes have been detected in the latest evaluation.';

  if (isWarning) {
    statusBadgeBg = 'bg-brand-amber-tint border-brand-amber/60 text-amber-900';
    coreGradient = 'from-brand-amber via-brand-amber-dark to-amber-700';
    pulseRingColor = 'border-brand-amber/50';
    statusText = 'Attention Required: Distribution Shift';
    StatusIcon = AlertTriangle;
    explanation =
      'The latest evaluation indicates that incoming petal-width measurements differ from the reference dataset. Model may over-predict certain species.';
  } else if (isCritical) {
    statusBadgeBg = 'bg-brand-coral-tint border-brand-coral/60 text-rose-900';
    coreGradient = 'from-brand-coral via-brand-coral-dark to-rose-700';
    pulseRingColor = 'border-brand-coral/50';
    statusText = 'Critical Alert: Operational Degradation';
    StatusIcon = AlertCircle;
    explanation =
      'High inference failure rate or severe feature distribution skew has been reported. Immediate review advised.';
  } else if (model.status === 'insufficient_data') {
    statusBadgeBg = 'bg-gray-100 border-gray-300 text-gray-700';
    coreGradient = 'from-gray-300 via-gray-400 to-gray-500';
    pulseRingColor = 'border-gray-300';
    statusText = 'Monitoring Initializing';
    StatusIcon = Info;
    explanation =
      'Monitoring has not started yet. Collect more observations to begin evaluating distribution changes.';
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-brand-border p-6 sm:p-8 shadow-card">
      {/* Subtle background ambient mesh */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-brand-indigo-tint/50 to-brand-sky-tint/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-brand-mint-tint/30 to-brand-ivory/80 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Visual Observatory */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="relative w-72 h-72 sm:w-84 sm:h-84 flex items-center justify-center">
            {/* Outer Orbit Ring 3 */}
            <div className="absolute inset-0 rounded-full border border-dashed border-brand-border/90 animate-orbit-3 flex items-center justify-center">
              {/* Satellite Node 3 */}
              <div
                onMouseEnter={() => setHoveredNode('Baseline Reference: 1,500 Botanical Records')}
                onMouseLeave={() => setHoveredNode(null)}
                className="absolute -top-2 w-4 h-4 rounded-full bg-brand-sky border-2 border-white shadow-md cursor-pointer transition-transform hover:scale-150"
              />
            </div>

            {/* Orbit Ring 2 */}
            <div className="absolute inset-8 rounded-full border border-brand-border/70 animate-orbit-2 flex items-center justify-center">
              {/* Satellite Node 2 (recent prediction) */}
              <div
                onMouseEnter={() => setHoveredNode('Prediction #904: Latency 39ms')}
                onMouseLeave={() => setHoveredNode(null)}
                className="absolute -right-2 w-4 h-4 rounded-full bg-brand-indigo border-2 border-white shadow-md cursor-pointer transition-transform hover:scale-150"
              />
            </div>

            {/* Orbit Ring 1 (Inner) */}
            <div className="absolute inset-16 rounded-full border border-dashed border-brand-indigo/30 animate-orbit-1 flex items-center justify-center">
              {/* Satellite Node 1 (monitoring checkpoint) */}
              <div
                onMouseEnter={() => setHoveredNode('KS Drift Check: p-value 0.002 on Petal Width')}
                onMouseLeave={() => setHoveredNode(null)}
                className={`absolute -bottom-2 w-3.5 h-3.5 rounded-full ${
                  isWarning ? 'bg-brand-amber' : 'bg-brand-mint'
                } border-2 border-white shadow-sm cursor-pointer transition-transform hover:scale-150`}
              />
            </div>

            {/* Subtle Expanding Breathing Pulse Halo */}
            <div
              className={`absolute inset-24 rounded-full border-2 ${pulseRingColor} animate-ping-slow pointer-events-none`}
            />

            {/* Central Model Sphere Core */}
            <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr shadow-float flex flex-col items-center justify-center text-white p-3 text-center border-4 border-white">
              <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${coreGradient} opacity-95`} />
              
              {/* Central Symbol & Model Identifier */}
              <div className="relative z-10 flex flex-col items-center">
                <Activity size={24} className="mb-0.5 animate-pulse-subtle text-white drop-shadow-sm" />
                <span className="font-display font-extrabold text-xs tracking-tight uppercase leading-none drop-shadow">
                  {model.type === 'classification' ? 'Classify' : 'Regression'}
                </span>
                <span className="font-mono text-[10px] opacity-90 mt-0.5">
                  {model.version}
                </span>
              </div>
            </div>

            {/* Tooltip on Node Hover */}
            {hoveredNode && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-xl bg-brand-midnight text-white text-xs font-medium shadow-float backdrop-blur-md whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                {hoveredNode}
              </div>
            )}
          </div>

          {/* Quick status footnote under graphic */}
          <div className="mt-2 text-center">
            <span className="text-xs text-brand-slate font-medium flex items-center justify-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isWarning ? 'bg-brand-amber' : isCritical ? 'bg-brand-coral' : 'bg-brand-mint'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isWarning ? 'bg-brand-amber-dark' : isCritical ? 'bg-brand-coral-dark' : 'bg-brand-mint-deep'
                  }`}
                />
              </span>
              Continuous telemetry stream synchronized
            </span>
          </div>
        </div>

        {/* Right Column: Model Details, Assessment & Fast Actions */}
        <div className="lg:col-span-6 space-y-5">
          {/* Status Badge & Version */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeBg}`}
            >
              <StatusIcon size={14} className="flex-shrink-0" />
              <span>{statusText}</span>
            </div>

            <span className="text-xs font-mono font-medium text-brand-slate bg-brand-ivory px-2.5 py-1 rounded-lg border border-brand-border">
              {model.framework}
            </span>

            {model.isDemo && (
              <span className="text-[11px] font-mono font-bold uppercase text-brand-indigo bg-brand-indigo-tint px-2 py-0.5 rounded-md border border-brand-indigo/30">
                Sample Benchmark
              </span>
            )}
          </div>

          {/* Title & Tagline */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-brand-midnight tracking-tight">
              {model.name}
            </h2>
            <p className="text-xs sm:text-sm text-brand-slate mt-1 leading-relaxed">
              {model.description}
            </p>
          </div>

          {/* Plain-Language Intelligence Assessment Box */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isWarning
                ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                : isCritical
                ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                : 'bg-brand-ivory/80 border-brand-border text-brand-midnight'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <Sparkles
                size={18}
                className={`flex-shrink-0 mt-0.5 ${
                  isWarning ? 'text-amber-600' : isCritical ? 'text-rose-600' : 'text-brand-indigo'
                }`}
              />
              <div className="space-y-1">
                <h4 className="text-xs uppercase font-bold tracking-wider text-brand-slate">
                  Observatory Intelligence Report
                </h4>
                <p className="text-sm leading-relaxed font-medium">
                  {explanation}
                </p>
              </div>
            </div>
          </div>

          {/* Telemetry Micro-Bar */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-brand-ivory/60 border border-brand-border/70">
              <span className="text-[10px] uppercase font-bold text-brand-slate block">
                Last Prediction
              </span>
              <span className="text-xs sm:text-sm font-semibold text-brand-midnight flex items-center gap-1 mt-0.5">
                <Clock size={12} className="text-brand-slate" />
                {lastPredictionTime}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-brand-ivory/60 border border-brand-border/70">
              <span className="text-[10px] uppercase font-bold text-brand-slate block">
                Inference Latency
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold text-brand-midnight mt-0.5 block">
                {model.avgLatencyMs} ms
              </span>
            </div>

            <div className="p-3 rounded-xl bg-brand-ivory/60 border border-brand-border/70">
              <span className="text-[10px] uppercase font-bold text-brand-slate block">
                Drift Incidents
              </span>
              <span
                className={`text-xs sm:text-sm font-mono font-bold mt-0.5 block ${
                  model.activeDriftAlerts > 0 ? 'text-amber-600' : 'text-emerald-600'
                }`}
              >
                {model.activeDriftAlerts} Active
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to={`/models/${model.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-midnight text-white text-xs sm:text-sm font-semibold hover:bg-black shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Model Details</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              to="/predictions"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-brand-border text-brand-midnight text-xs sm:text-sm font-semibold hover:bg-brand-ivory shadow-subtle transition-all"
            >
              <Terminal size={15} className="text-brand-indigo" />
              <span>Test Live Inference</span>
            </Link>

            {isWarning && (
              <Link
                to="/monitoring"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs sm:text-sm font-semibold hover:bg-amber-200 transition-all"
              >
                <AlertTriangle size={15} />
                <span>Investigate Drift</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
