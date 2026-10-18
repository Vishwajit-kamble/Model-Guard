import React, { useState } from 'react';
import {
  Compass,
  CheckCircle,
  BarChart2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  X,
  Sparkles,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Welcome to ModelGuard AI',
      subtitle: 'Your models deserve a second pair of eyes.',
      icon: Sparkles,
      color: 'bg-brand-indigo text-white',
      content:
        'ModelGuard AI is a Living Intelligence Observatory designed to monitor machine learning models in production, detect distribution drift, and safeguard reliability in plain English.',
      highlight: 'Understand your AI health without a Ph.D. in statistics.',
    },
    {
      title: '1. Is my model working?',
      subtitle: 'Continuous health monitoring and heartbeat telemetry',
      icon: CheckCircle,
      color: 'bg-brand-mint text-emerald-950',
      content:
        'The centerpiece Model Observatory reflects your model’s live state. A calm, green orbit means everything is operating smoothly. An amber or coral aura alerts you to shifts.',
      highlight: 'Check the central observatory ring anytime on the Command Center.',
    },
    {
      title: '2. How many predictions has it made?',
      subtitle: 'Real-time throughput and latency tracking',
      icon: BarChart2,
      color: 'bg-brand-indigo text-white',
      content:
        'Track total requests processed, average inference latency in milliseconds, and error rates against strict SLAs with historical trend sparklines.',
      highlight: 'Review inference speed in the primary metrics panel.',
    },
    {
      title: '3. Is anything unusual happening?',
      subtitle: 'Automated Kolmogorov-Smirnov drift detection',
      icon: AlertTriangle,
      color: 'bg-brand-amber text-amber-950',
      content:
        'Production data shifts over time. When incoming request distributions diverge from your training baseline (like Petal Width on the Iris model), ModelGuard catches it automatically.',
      highlight: 'Explore the Monitoring & Data Drift tab for feature-by-feature comparisons.',
    },
    {
      title: '4 & 5. What does it mean & what should I do?',
      subtitle: 'Plain-language diagnostics and clear recommendations',
      icon: Lightbulb,
      color: 'bg-brand-sky text-blue-950',
      content:
        'No cryptic logs or unreadable matrices. ModelGuard explains what caused the drift, how it might skew predictions, and gives actionable steps to retrain or inspect your inputs.',
      highlight: 'Review Recommended Next Steps on your Command Center and Incident Alerts.',
    },
  ];

  const step = steps[currentStep];
  const StepIcon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-midnight/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-brand-border shadow-float overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header bar */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-brand-border/60">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-indigo animate-pulse" />
            <span className="text-xs uppercase font-bold tracking-wider text-brand-slate">
              Observatory Tour Guide • Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-brand-slate hover:text-brand-midnight hover:bg-brand-ivory transition-colors"
            aria-label="Close guide"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${step.color}`}
            >
              <StepIcon size={24} />
            </div>
            <div>
              <h3 className="text-xl font-display font-extrabold text-brand-midnight tracking-tight">
                {step.title}
              </h3>
              <p className="text-xs text-brand-slate font-medium mt-0.5">
                {step.subtitle}
              </p>
            </div>
          </div>

          <p className="text-sm text-brand-midnight/90 leading-relaxed">
            {step.content}
          </p>

          <div className="p-4 rounded-2xl bg-brand-ivory/80 border border-brand-border text-xs font-semibold text-brand-midnight flex items-center gap-2.5">
            <Sparkles size={16} className="text-brand-indigo flex-shrink-0" />
            <span>{step.highlight}</span>
          </div>

          {/* Stepper indicators */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentStep
                      ? 'w-7 bg-brand-indigo'
                      : 'w-2 bg-brand-border hover:bg-brand-slate-light'
                  }`}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-brand-slate hover:text-brand-midnight hover:bg-brand-ivory transition-colors"
                >
                  Previous
                </button>
              )}

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-indigo text-white text-xs font-semibold hover:bg-brand-indigo-dark shadow-sm transition-all"
                >
                  <span>Next Step</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-brand-midnight text-white text-xs font-semibold hover:bg-black shadow-sm transition-all"
                >
                  Start Exploring
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
