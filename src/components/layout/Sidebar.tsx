import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Compass,
  Layers,
  PlusCircle,
  Activity,
  GitCompare,
  Terminal,
  AlertTriangle,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Database,
  Radio,
  Wifi,
  WifiOff,
  User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onOpenTour?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen, onOpenTour }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { unreadAlertsCount, systemHealth, isDemoMode, currentModel, userName, userRole } = useApp();

  const navGroups = [
    {
      group: 'OVERVIEW',
      items: [
        { label: 'Command Center', path: '/', icon: Compass },
      ],
    },
    {
      group: 'MODELS',
      items: [
        { label: 'All Models', path: '/models', icon: Layers },
        { label: 'Register Model', path: '/models/register', icon: PlusCircle },
      ],
    },
    {
      group: 'MONITORING',
      items: [
        {
          label: 'Model Health',
          path: currentModel ? `/models/${currentModel.id}` : '/models',
          icon: Activity,
        },
        { label: 'Data Drift', path: '/monitoring', icon: GitCompare },
        { label: 'Predictions', path: '/predictions', icon: Terminal },
        {
          label: 'Alerts',
          path: '/alerts',
          icon: AlertTriangle,
          badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined,
        },
      ],
    },
    {
      group: 'WORKSPACE',
      items: [
        { label: 'Settings', path: '/settings', icon: Settings },
      ],
    },
  ];

  const handleNavClick = () => {
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-brand-midnight/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-brand-surface border-r border-brand-border transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand / Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-brand-border/80">
          <NavLink
            to="/"
            onClick={handleNavClick}
            className="flex items-center gap-3 group overflow-hidden"
          >
            {/* Orbital Emblem */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-indigo to-brand-indigo-dark flex items-center justify-center shadow-md shadow-brand-indigo/25 flex-shrink-0 group-hover:scale-105 transition-transform">
              {/* Spinning subtle outer ring */}
              <div className="absolute inset-1 rounded-full border border-dashed border-brand-mint/60 animate-orbit" />
              {/* Inner observatory eye/core */}
              <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-indigo" />
              </div>
            </div>

            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-display font-bold text-base tracking-tight text-brand-midnight flex items-center gap-1.5">
                  ModelGuard <span className="text-brand-indigo">AI</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-brand-slate">
                  Observatory
                </span>
              </div>
            )}
          </NavLink>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-brand-slate hover:text-brand-midnight hover:bg-brand-ivory transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              {!collapsed ? (
                <div className="px-3 text-[11px] font-semibold text-brand-slate/80 tracking-wider uppercase">
                  {group.group}
                </div>
              ) : (
                <div className="h-2" />
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) => `
                      group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${
                        isActive
                          ? 'bg-brand-indigo-tint text-brand-indigo font-semibold shadow-sm'
                          : 'text-brand-slate hover:text-brand-midnight hover:bg-brand-ivory/80'
                      }
                      ${collapsed ? 'justify-center px-0' : ''}
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={18}
                          className={`flex-shrink-0 transition-transform group-hover:scale-110 ${
                            isActive ? 'text-brand-indigo' : 'text-brand-slate group-hover:text-brand-midnight'
                          }`}
                        />
                        {!collapsed && (
                          <span className="truncate">{item.label}</span>
                        )}

                        {item.badge && (
                          <span
                            className={`
                              flex items-center justify-center text-[10px] font-bold rounded-full
                              ${collapsed ? 'absolute -top-1 -right-1 w-4 h-4' : 'ml-auto px-1.5 py-0.5'}
                              bg-brand-coral text-white shadow-sm
                            `}
                          >
                            {item.badge}
                          </span>
                        )}

                        {isActive && !collapsed && (
                          <span className="absolute right-0 top-2 bottom-2 w-1 bg-brand-indigo rounded-l-full" />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}

          {/* Guide / Tour Button */}
          {onOpenTour && (
            <button
              onClick={() => {
                onOpenTour();
                handleNavClick();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-brand-slate hover:text-brand-indigo hover:bg-brand-indigo-subtle transition-colors ${
                collapsed ? 'justify-center px-0' : ''
              }`}
              title={collapsed ? 'Product Tour' : undefined}
            >
              <HelpCircle size={16} className="text-brand-indigo flex-shrink-0" />
              {!collapsed && <span>Observatory Guide</span>}
            </button>
          )}
        </div>

        {/* Bottom Workspace & Status Area */}
        <div className="p-3 border-t border-brand-border bg-brand-ivory/40 space-y-2">
          {/* Connectivity Status Indicator */}
          <div
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
              isDemoMode
                ? 'bg-brand-sky-tint border-brand-sky/40 text-blue-800'
                : systemHealth.backendConnected
                ? 'bg-brand-mint-tint border-brand-mint/50 text-emerald-800'
                : 'bg-brand-coral-tint border-brand-coral/40 text-rose-800'
            } ${collapsed ? 'justify-center px-0' : ''}`}
            title={`API: ${systemHealth.apiBaseUrl} | Mode: ${isDemoMode ? 'Demo Data' : 'Live'}`}
          >
            {isDemoMode ? (
              <Radio size={14} className="text-blue-600 flex-shrink-0 animate-pulse" />
            ) : systemHealth.backendConnected ? (
              <Wifi size={14} className="text-emerald-600 flex-shrink-0" />
            ) : (
              <WifiOff size={14} className="text-rose-500 flex-shrink-0" />
            )}

            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="truncate leading-tight">
                  {isDemoMode
                    ? 'DEMO DATA ACTIVE'
                    : systemHealth.backendConnected
                    ? 'FASTAPI CONNECTED'
                    : 'OFFLINE / DISCONNECTED'}
                </span>
              </div>
            )}
          </div>

          {/* User Profile Card */}
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-white border border-brand-border shadow-subtle ${
              collapsed ? 'justify-center p-2' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-indigo to-brand-mint flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm">
              {(userName || 'User').charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-brand-midnight truncate">
                  {userName || 'User'}
                </span>
                <span className="text-[10px] text-brand-slate truncate">
                  {userRole || 'ML Platform Lead'}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
