import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Server,
  Bell,
  Shield,
  Database,
  Radio,
  Wifi,
  WifiOff,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  User,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export const SettingsPage: React.FC = () => {
  const {
    isDemoMode,
    setDemoMode,
    systemHealth,
    refreshHealth,
    showToast,
    userName,
    setUserName,
    userRole,
    setUserRole,
    userEmail,
    setUserEmail,
  } = useApp();

  const [apiUrl, setApiUrl] = useState<string>(api.getBaseUrl());
  const [localUserName, setLocalUserName] = useState<string>(userName);
  const [localUserRole, setLocalUserRole] = useState<string>(userRole);
  const [localNotifyEmail, setLocalNotifyEmail] = useState<string>(userEmail);
  const [workspaceName, setWorkspaceName] = useState<string>('Enterprise ML Observatory');
  const [evalInterval, setEvalInterval] = useState<string>('1h');
  const [alphaThreshold, setAlphaThreshold] = useState<number>(0.05);
  const [retentionDays, setRetentionDays] = useState<number>(90);
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);

  const handleSaveApi = () => {
    api.setBaseUrl(apiUrl);
    showToast('API Configuration Saved', 'success', `FastAPI endpoint set to ${apiUrl}`);
    refreshHealth();
  };

  const handleSaveProfile = () => {
    setUserName(localUserName);
    setUserRole(localUserRole);
    setUserEmail(localNotifyEmail);
    showToast('Operator Profile Saved', 'success', `Display name updated to "${localUserName.trim() || 'User'}"`);
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    await refreshHealth();
    setIsTestingConnection(false);

    const health = api.getLastHealth();
    if (health.backendConnected) {
      showToast('FastAPI Reached Successfully', 'success', `Latency: ${health.latencyMs}ms`);
    } else {
      showToast('Backend Unreachable', 'warning', `Unable to connect to ${apiUrl}. Check if uvicorn server is running.`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-brand-midnight tracking-tight">
          Workspace Settings & Observability Config
        </h1>
        <p className="text-sm text-brand-slate mt-0.5">
          Configure user identity, API endpoints, automated monitoring intervals, and security protocols
        </p>
      </div>

      {/* Operator Identity & Profile Card */}
      <div className="card-subtle p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border/60 pb-3">
          <div className="flex items-center gap-3">
            <User size={20} className="text-brand-indigo" />
            <div>
              <h2 className="text-base font-display font-bold text-brand-midnight">
                Operator Identity & Profile
              </h2>
              <p className="text-xs text-brand-slate">
                Personalize your operator display name, role designation, and incident alert dispatch email
              </p>
            </div>
          </div>
          <button
            onClick={handleSaveProfile}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-brand-indigo text-white text-xs font-bold hover:bg-brand-indigo-dark shadow-sm transition-all"
          >
            Save Profile
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="text-xs font-bold text-brand-midnight block mb-1">
              Operator Name
            </label>
            <input
              type="text"
              value={localUserName}
              onChange={(e) => setLocalUserName(e.target.value)}
              placeholder="e.g. User, Vishwajit, Alex"
              className="w-full px-4 py-2 rounded-xl bg-brand-ivory/60 border border-brand-border text-xs sm:text-sm text-brand-midnight focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-brand-midnight block mb-1">
              Platform Role
            </label>
            <input
              type="text"
              value={localUserRole}
              onChange={(e) => setLocalUserRole(e.target.value)}
              placeholder="e.g. ML Platform Lead"
              className="w-full px-4 py-2 rounded-xl bg-brand-ivory/60 border border-brand-border text-xs sm:text-sm text-brand-midnight focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-brand-midnight block mb-1">
              Incident Alert Email
            </label>
            <input
              type="email"
              value={localNotifyEmail}
              onChange={(e) => setLocalNotifyEmail(e.target.value)}
              placeholder="user@modelguard.ai"
              className="w-full px-4 py-2 rounded-xl bg-brand-ivory/60 border border-brand-border text-xs sm:text-sm text-brand-midnight focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Backend & Demo Mode Configuration Card */}
      <div className="card-subtle p-6 sm:p-7 space-y-6">
        <div className="flex items-center gap-3 border-b border-brand-border/60 pb-3">
          <Server size={20} className="text-brand-indigo" />
          <h2 className="text-base font-display font-bold text-brand-midnight">
            FastAPI Backend & Demonstration Mode
          </h2>
        </div>

        {/* Demo Mode Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-brand-ivory border border-brand-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-brand-midnight">
                Enable Demonstration Mode
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                ACTIVE BY DEFAULT
              </span>
            </div>
            <p className="text-xs text-brand-slate mt-1 leading-relaxed">
              When enabled, ModelGuard utilizes high-fidelity simulated models, deterministic drift calculations, and offline inference graphs.
            </p>
          </div>

          <button
            onClick={() => setDemoMode(!isDemoMode)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              isDemoMode
                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                : 'bg-white text-brand-slate border-brand-border hover:text-brand-midnight'
            }`}
          >
            {isDemoMode ? 'Demo Mode Active' : 'Switch to Demo Mode'}
          </button>
        </div>

        {/* API Base URL Setting */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-brand-midnight block">
            FastAPI Monitoring Service Base URL
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:8000"
              className="flex-1 px-4 py-2.5 rounded-xl bg-brand-ivory/60 border border-brand-border text-xs sm:text-sm font-mono text-brand-midnight focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:bg-white"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveApi}
                className="px-4 py-2.5 rounded-xl bg-brand-indigo text-white text-xs font-bold hover:bg-brand-indigo-dark shadow-sm transition-all"
              >
                Save URL
              </button>
              <button
                onClick={handleTestConnection}
                disabled={isTestingConnection}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-brand-border text-xs font-bold text-brand-midnight hover:bg-brand-ivory shadow-subtle transition-all"
              >
                <RefreshCw size={13} className={isTestingConnection ? 'animate-spin' : ''} />
                <span>Test Ping</span>
              </button>
            </div>
          </div>

          {/* Current Health Status Feedback */}
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="font-semibold text-brand-slate">Connectivity Status:</span>
            {systemHealth.backendConnected ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <CheckCircle2 size={13} />
                <span>FastAPI Active ({systemHealth.latencyMs}ms response time)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                <WifiOff size={13} />
                <span>FastAPI Unreachable on {apiUrl}. Serving local offline telemetry safely.</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Monitoring Defaults & Statistical Bounds */}
      <div className="card-subtle p-6 sm:p-7 space-y-5">
        <div className="flex items-center gap-3 border-b border-brand-border/60 pb-3">
          <Database size={20} className="text-brand-indigo" />
          <h2 className="text-base font-display font-bold text-brand-midnight">
            Surveillance & Statistical Defaults
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="text-xs font-bold text-brand-midnight block mb-1">
              Automated Drift Evaluation Frequency
            </label>
            <select
              value={evalInterval}
              onChange={(e) => setEvalInterval(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-brand-ivory/60 border border-brand-border text-xs font-semibold text-brand-midnight cursor-pointer"
            >
              <option value="15m">Every 15 Minutes (High Traffic)</option>
              <option value="1h">Hourly Evaluation (Standard)</option>
              <option value="24h">Daily Evaluation (Low Frequency)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-brand-midnight block mb-1">
              Kolmogorov-Smirnov Significance (α)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.001"
              max="0.2"
              value={alphaThreshold}
              onChange={(e) => setAlphaThreshold(parseFloat(e.target.value) || 0.05)}
              className="w-full px-4 py-2 rounded-xl bg-brand-ivory/60 border border-brand-border text-xs sm:text-sm font-mono text-brand-midnight"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-brand-midnight block mb-1">
              Inference Telemetry Retention Window
            </label>
            <input
              type="number"
              value={retentionDays}
              onChange={(e) => setRetentionDays(parseInt(e.target.value) || 90)}
              className="w-full px-4 py-2 rounded-xl bg-brand-ivory/60 border border-brand-border text-xs sm:text-sm font-mono text-brand-midnight"
            />
            <span className="text-[10px] text-brand-slate mt-1 block">
              Inference vectors retained for {retentionDays} days.
            </span>
          </div>
        </div>
      </div>

      {/* Security Guidance Box */}
      <div className="card-subtle p-6 space-y-3 bg-brand-ivory/60 border-brand-border">
        <div className="flex items-center gap-2.5 text-brand-midnight">
          <Shield size={18} className="text-brand-indigo" />
          <h3 className="text-sm font-bold">Client-Side Architecture & Security Assurance</h3>
        </div>
        <p className="text-xs text-brand-slate leading-relaxed">
          ModelGuard AI maintains strict credential hygiene: private service-role keys, database passwords, and cloud tokens are never exposed in browser-accessible runtime variables. Only public endpoints designated via <code className="font-mono text-brand-midnight bg-white px-1.5 py-0.5 rounded border border-brand-border">VITE_API_BASE_URL</code> are queried.
        </p>
      </div>
    </div>
  );
};
