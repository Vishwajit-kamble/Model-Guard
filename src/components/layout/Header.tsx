import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  Bell,
  Sparkles,
  Zap,
  Radio,
  ChevronDown,
  Activity,
  Layers,
  Terminal,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  onOpenTour?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu, onOpenTour }) => {
  const location = useLocation();
  const {
    currentModel,
    models,
    setCurrentModelId,
    unreadAlertsCount,
    isDemoMode,
    setDemoMode,
  } = useApp();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Command Center';
    if (path.startsWith('/models/register')) return 'Register New Model';
    if (path.startsWith('/models/') && path !== '/models') return 'Model Inspection';
    if (path.startsWith('/models')) return 'Model Library';
    if (path.startsWith('/monitoring')) return 'Model Monitoring & Data Drift';
    if (path.startsWith('/predictions')) return 'Predictions Explorer';
    if (path.startsWith('/alerts')) return 'Incidents & Alerts';
    if (path.startsWith('/settings')) return 'Workspace Settings';
    return 'Model Observatory';
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-brand-surface/90 backdrop-blur-md border-b border-brand-border px-4 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger & Page Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-brand-slate hover:text-brand-midnight hover:bg-brand-ivory transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold tracking-wider text-brand-slate hidden sm:inline-block">
            Observatory
          </span>
          <span className="text-brand-slate/40 hidden sm:inline-block">/</span>
          <h1 className="text-base sm:text-lg font-display font-bold text-brand-midnight tracking-tight">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right: Actions, Model Switcher, Mode Toggle & Alerts */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Model Switcher Dropdown */}
        <div className="relative hidden md:flex items-center">
          <div className="relative">
            <select
              value={currentModel?.id || ''}
              onChange={(e) => setCurrentModelId(e.target.value)}
              className="appearance-none bg-brand-ivory hover:bg-white text-brand-midnight text-xs font-semibold pl-8 pr-8 py-2 rounded-xl border border-brand-border shadow-subtle cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 transition-all"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.version})
                </option>
              ))}
            </select>
            <Layers
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-slate pointer-events-none"
            />
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-slate pointer-events-none"
            />
          </div>
        </div>

        {/* Demo Mode Toggle Badge */}
        <button
          onClick={() => setDemoMode(!isDemoMode)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            isDemoMode
              ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 shadow-sm'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
          }`}
          title={isDemoMode ? 'Click to switch to Live Backend' : 'Click to switch to Demo Mode'}
        >
          <Radio size={13} className={isDemoMode ? 'animate-pulse text-blue-600' : 'text-emerald-600'} />
          <span className="hidden sm:inline font-mono text-[11px]">
            {isDemoMode ? 'DEMO DATA' : 'LIVE API'}
          </span>
        </button>

        {/* Quick CTA to test predictions */}
        <Link
          to="/predictions"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-indigo text-white text-xs font-semibold hover:bg-brand-indigo-dark shadow-sm shadow-brand-indigo/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Terminal size={14} />
          <span>Test Model</span>
        </Link>

        {/* Alerts Bell */}
        <Link
          to="/alerts"
          className="relative p-2 rounded-xl text-brand-slate hover:text-brand-midnight hover:bg-brand-ivory border border-transparent hover:border-brand-border transition-all"
          title="Incident Alerts"
          aria-label="View alerts"
        >
          <Bell size={18} />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-coral text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
              {unreadAlertsCount}
            </span>
          )}
        </Link>

        {/* Onboarding / Tour Icon */}
        {onOpenTour && (
          <button
            onClick={onOpenTour}
            className="p-2 rounded-xl text-brand-indigo bg-brand-indigo-subtle hover:bg-brand-indigo-tint transition-all"
            title="Start Interactive Tour"
            aria-label="Start product tour"
          >
            <Sparkles size={18} />
          </button>
        )}
      </div>
    </header>
  );
};
