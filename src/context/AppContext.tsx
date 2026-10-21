import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ModelRecord,
  PredictionItem,
  IncidentAlert,
  SystemHealthStatus,
} from '../types';
import { api, DEFAULT_API_URL } from '../services/api';
import { DEMO_MODELS } from '../services/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
}

interface AppContextType {
  models: ModelRecord[];
  currentModelId: string;
  currentModel: ModelRecord | null;
  setCurrentModelId: (id: string) => void;
  predictions: PredictionItem[];
  alerts: IncidentAlert[];
  unreadAlertsCount: number;
  systemHealth: SystemHealthStatus;
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  toasts: ToastMessage[];
  showToast: (title: string, type?: 'success' | 'warning' | 'error' | 'info', message?: string) => void;
  removeToast: (id: string) => void;
  refreshHealth: () => Promise<void>;
  registerNewModel: (modelData: Partial<ModelRecord>) => Promise<ModelRecord>;
  resolveAlertById: (alertId: string) => Promise<void>;
  addNewPrediction: (item: PredictionItem) => void;
  reloadModels: () => Promise<void>;
  userName: string;
  setUserName: (name: string) => void;
  userRole: string;
  setUserRole: (role: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [models, setModels] = useState<ModelRecord[]>(DEMO_MODELS);
  const [currentModelId, setCurrentModelId] = useState<string>('model-iris-01');
  const [predictions, setPredictions] = useState<PredictionItem[]>([]);
  const [alerts, setAlerts] = useState<IncidentAlert[]>([]);
  const [isDemoMode, setIsDemoModeState] = useState<boolean>(api.getDemoMode());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealthStatus>({
    backendConnected: false,
    isDemoMode: api.getDemoMode(),
    latencyMs: 0,
    apiBaseUrl: DEFAULT_API_URL,
    lastChecked: 'Checking...',
  });

  const [userName, setUserNameState] = useState<string>(() => {
    try {
      return localStorage.getItem('modelguard_user_name') || 'User';
    } catch {
      return 'User';
    }
  });

  const [userRole, setUserRoleState] = useState<string>(() => {
    try {
      return localStorage.getItem('modelguard_user_role') || 'ML Platform Lead';
    } catch {
      return 'ML Platform Lead';
    }
  });

  const [userEmail, setUserEmailState] = useState<string>(() => {
    try {
      return localStorage.getItem('modelguard_user_email') || 'user@modelguard.ai';
    } catch {
      return 'user@modelguard.ai';
    }
  });

  const setUserName = (name: string) => {
    const val = name.trim() || 'User';
    setUserNameState(val);
    try {
      localStorage.setItem('modelguard_user_name', val);
    } catch {
      // ignore
    }
  };

  const setUserRole = (role: string) => {
    const val = role.trim() || 'ML Platform Lead';
    setUserRoleState(val);
    try {
      localStorage.setItem('modelguard_user_role', val);
    } catch {
      // ignore
    }
  };

  const setUserEmail = (email: string) => {
    const val = email.trim() || 'user@modelguard.ai';
    setUserEmailState(val);
    try {
      localStorage.setItem('modelguard_user_email', val);
    } catch {
      // ignore
    }
  };

  const showToast = (title: string, type: 'success' | 'warning' | 'error' | 'info' = 'info', message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshHealth = async () => {
    const health = await api.checkHealth();
    setSystemHealth(health);
  };

  const reloadModels = async () => {
    const loaded = await api.getModels();
    setModels(loaded);
  };

  useEffect(() => {
    const init = async () => {
      await refreshHealth();
      const loadedModels = await api.getModels();
      setModels(loadedModels);
      const loadedPredictions = await api.getPredictions();
      setPredictions(loadedPredictions);
      const loadedAlerts = await api.getAlerts();
      setAlerts(loadedAlerts);
    };
    init();

    // Check backend health periodically every 20 seconds
    const interval = setInterval(() => {
      refreshHealth();
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const setDemoMode = (enabled: boolean) => {
    api.setDemoMode(enabled);
    setIsDemoModeState(enabled);
    setSystemHealth((prev) => ({ ...prev, isDemoMode: enabled }));
    showToast(
      enabled ? 'Demo Mode Active' : 'Live Backend Mode Active',
      'info',
      enabled
        ? 'Using high-fidelity simulated models and deterministic evaluations.'
        : `Connecting directly to FastAPI at ${api.getBaseUrl()}`
    );
  };

  const registerNewModel = async (modelData: Partial<ModelRecord>): Promise<ModelRecord> => {
    const created = await api.registerModel(modelData);
    setModels((prev) => [created, ...prev]);
    setCurrentModelId(created.id);
    showToast('Model Registered Successfully', 'success', `${created.name} (${created.version}) is now tracked.`);
    return created;
  };

  const resolveAlertById = async (alertId: string) => {
    const updated = await api.resolveAlert(alertId);
    setAlerts(updated);
    showToast('Alert Marked as Resolved', 'success');
  };

  const addNewPrediction = (item: PredictionItem) => {
    setPredictions((prev) => [item, ...prev]);
  };

  const currentModel = models.find((m) => m.id === currentModelId) || models[0] || null;
  const unreadAlertsCount = alerts.filter((a) => a.status === 'active').length;

  return (
    <AppContext.Provider
      value={{
        models,
        currentModelId,
        currentModel,
        setCurrentModelId,
        predictions,
        alerts,
        unreadAlertsCount,
        systemHealth,
        isDemoMode,
        setDemoMode,
        toasts,
        showToast,
        removeToast,
        refreshHealth,
        registerNewModel,
        resolveAlertById,
        addNewPrediction,
        reloadModels,
        userName,
        setUserName,
        userRole,
        setUserRole,
        userEmail,
        setUserEmail,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
