import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { OnboardingModal } from './components/common/OnboardingModal';

// Pages
import { CommandCenter } from './pages/CommandCenter';
import { ModelsPage } from './pages/ModelsPage';
import { ModelDetailsPage } from './pages/ModelDetailsPage';
import { PredictionsExplorer } from './pages/PredictionsExplorer';
import { MonitoringDriftPage } from './pages/MonitoringDriftPage';
import { AlertsPage } from './pages/AlertsPage';
import { RegisterModelWizard } from './pages/RegisterModelWizard';
import { SettingsPage } from './pages/SettingsPage';

function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  // Check if first-time user to show welcome tour
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('modelguard_has_seen_tour');
    if (!hasSeenTour) {
      setTourOpen(true);
      localStorage.setItem('modelguard_has_seen_tour', 'true');
    }
  }, []);

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-midnight flex">
      {/* Collapsible / Mobile Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOpenTour={() => setTourOpen(true)}
      />

      {/* Main Content Area (shifted right on desktop for persistent sidebar) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        <Header
          onToggleMobileMenu={() => setMobileOpen(!mobileOpen)}
          onOpenTour={() => setTourOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/" element={<CommandCenter />} />
            <Route path="/models" element={<ModelsPage />} />
            <Route path="/models/register" element={<RegisterModelWizard />} />
            <Route path="/models/:id" element={<ModelDetailsPage />} />
            <Route path="/predictions" element={<PredictionsExplorer />} />
            <Route path="/monitoring" element={<MonitoringDriftPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer className="border-t border-brand-border/60 py-6 px-8 text-center text-xs text-brand-slate">
          <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-2">
            <span>ModelGuard AI — Living Intelligence Observatory</span>
            <span className="font-mono text-[11px]">
              "Your models deserve a second pair of eyes."
            </span>
          </div>
        </footer>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Interactive Tour Modal */}
      <OnboardingModal isOpen={tourOpen} onClose={() => setTourOpen(false)} />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
