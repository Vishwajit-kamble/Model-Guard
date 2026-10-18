export type ModelStatus = 'healthy' | 'warning' | 'critical' | 'insufficient_data';
export type ModelType = 'classification' | 'regression' | 'clustering';
export type DeploymentStatus = 'deployed' | 'staging' | 'offline';

export interface FeatureSchema {
  name: string;
  displayName: string;
  type: 'numerical' | 'categorical';
  min?: number;
  max?: number;
  unit?: string;
  default?: number | string;
  description: string;
}

export interface ModelRecord {
  id: string;
  name: string;
  version: string;
  type: ModelType;
  status: ModelStatus;
  deploymentStatus: DeploymentStatus;
  description: string;
  registeredAt: string;
  totalPredictions: number;
  avgLatencyMs: number;
  errorRate: number; // percentage, e.g. 0.14%
  activeDriftAlerts: number;
  lastActive: string;
  framework: string;
  inputFeatures: FeatureSchema[];
  outputSchema: {
    name: string;
    type: string;
    classes?: string[];
  };
  referenceDataset: {
    name: string;
    sampleCount: number;
    uploadedAt: string;
  };
  isDemo?: boolean;
}

export interface PredictionItem {
  id: string;
  modelId: string;
  modelVersion: string;
  inputs: Record<string, number | string>;
  prediction: string | number;
  probabilities?: Record<string, number>;
  confidence?: number;
  latencyMs: number;
  timestamp: string;
  status: 'success' | 'error';
  errorMessage?: string;
}

export interface MetricCardInfo {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  subtitle: string;
  change?: {
    value: string;
    isPositive: boolean;
    period: string;
  };
  sparkline?: number[];
  status?: 'healthy' | 'warning' | 'critical' | 'neutral';
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  category: 'system' | 'prediction' | 'drift' | 'alert' | 'deployment';
  status: 'healthy' | 'warning' | 'critical' | 'info';
  description: string;
  details?: string;
}

export interface DistributionBin {
  bin: string;
  referenceValue: number;
  incomingValue: number;
}

export interface FeatureDriftResult {
  featureName: string;
  displayName: string;
  driftScore: number; // 0.00 to 1.00 KS distance or Wasserstein distance
  pValue: number;
  threshold: number; // e.g. 0.05
  status: 'healthy' | 'warning' | 'critical';
  referenceMean: number;
  incomingMean: number;
  sampleCount: number;
  distribution: DistributionBin[];
  explanation: string;
  possibleImpact: string;
  recommendedAction: string;
}

export interface DriftEvaluation {
  id: string;
  modelId: string;
  modelName: string;
  timestamp: string;
  overallStatus: ModelStatus;
  evaluationWindow: '1h' | '24h' | '7d';
  featuresEvaluated: number;
  featuresDrifting: number;
  referenceSampleSize: number;
  incomingSampleSize: number;
  features: FeatureDriftResult[];
  plainSummary: string;
}

export interface IncidentAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  modelId: string;
  modelName: string;
  affectedFeature?: string;
  detectedAt: string;
  status: 'active' | 'investigating' | 'resolved';
  summary: string;
  observation: string;
  possibleImpact: string;
  recommendedAction: string;
  metricEvidence: string;
  evaluationId?: string;
}

export interface SystemHealthStatus {
  backendConnected: boolean;
  isDemoMode: boolean;
  latencyMs: number;
  apiBaseUrl: string;
  lastChecked: string;
  fastApiVersion?: string;
}

export interface WorkspaceSettings {
  userName: string;
  workspaceName: string;
  isDemoMode: boolean;
  apiBaseUrl: string;
  theme: 'light' | 'system';
  evaluationInterval: string;
  alertEmail: string;
  notifyOnDrift: boolean;
  notifyOnErrors: boolean;
  retentionDays: number;
}
