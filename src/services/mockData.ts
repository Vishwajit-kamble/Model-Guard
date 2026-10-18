import {
  ModelRecord,
  PredictionItem,
  TimelineEvent,
  DriftEvaluation,
  IncidentAlert,
  MetricCardInfo,
} from '../types';

export const DEMO_MODELS: ModelRecord[] = [
  {
    id: 'model-iris-01',
    name: 'Iris Species Classifier',
    version: 'v1.4.2',
    type: 'classification',
    status: 'warning',
    deploymentStatus: 'deployed',
    description: 'Multiclass Fisher Iris botanical classifier trained on morphological measurements of sepals and petals.',
    registeredAt: '2026-09-12',
    totalPredictions: 14820,
    avgLatencyMs: 38,
    errorRate: 0.12,
    activeDriftAlerts: 1,
    lastActive: 'Just now',
    framework: 'scikit-learn 1.4',
    isDemo: true,
    inputFeatures: [
      {
        name: 'sepal_length',
        displayName: 'Sepal Length',
        type: 'numerical',
        min: 4.0,
        max: 8.5,
        unit: 'cm',
        default: 5.8,
        description: 'Length of the sepals in centimeters',
      },
      {
        name: 'sepal_width',
        displayName: 'Sepal Width',
        type: 'numerical',
        min: 2.0,
        max: 5.0,
        unit: 'cm',
        default: 3.0,
        description: 'Width of the sepals in centimeters',
      },
      {
        name: 'petal_length',
        displayName: 'Petal Length',
        type: 'numerical',
        min: 1.0,
        max: 7.5,
        unit: 'cm',
        default: 4.35,
        description: 'Length of the petals in centimeters',
      },
      {
        name: 'petal_width',
        displayName: 'Petal Width',
        type: 'numerical',
        min: 0.1,
        max: 3.0,
        unit: 'cm',
        default: 1.3,
        description: 'Width of the petals in centimeters',
      },
    ],
    outputSchema: {
      name: 'species',
      type: 'categorical',
      classes: ['Iris-setosa', 'Iris-versicolor', 'Iris-virginica'],
    },
    referenceDataset: {
      name: 'iris_reference_baseline_v1.csv',
      sampleCount: 1500,
      uploadedAt: '2026-09-12',
    },
  },
  {
    id: 'model-house-02',
    name: 'Suburban House Price Estimator',
    version: 'v1.2.0',
    type: 'regression',
    status: 'healthy',
    deploymentStatus: 'deployed',
    description: 'Gradient boosted tree regressor predicting real-estate valuation based on square footage, bedrooms, and zip code metrics.',
    registeredAt: '2026-09-28',
    totalPredictions: 8940,
    avgLatencyMs: 64,
    errorRate: 0.05,
    activeDriftAlerts: 0,
    lastActive: '12 mins ago',
    framework: 'XGBoost 2.0',
    isDemo: true,
    inputFeatures: [
      { name: 'sqft', displayName: 'Square Footage', type: 'numerical', min: 400, max: 10000, unit: 'sq ft', default: 1850, description: 'Living area' },
      { name: 'bedrooms', displayName: 'Bedrooms', type: 'numerical', min: 1, max: 8, default: 3, description: 'Number of bedrooms' },
      { name: 'bathrooms', displayName: 'Bathrooms', type: 'numerical', min: 1, max: 6, default: 2, description: 'Number of bathrooms' },
      { name: 'lot_size', displayName: 'Lot Size', type: 'numerical', min: 1000, max: 50000, unit: 'sq ft', default: 6000, description: 'Total lot size' },
    ],
    outputSchema: {
      name: 'estimated_price_usd',
      type: 'continuous',
    },
    referenceDataset: {
      name: 'housing_q2_benchmark.parquet',
      sampleCount: 4200,
      uploadedAt: '2026-09-28',
    },
  },
  {
    id: 'model-churn-03',
    name: 'Enterprise Customer Churn Predictor',
    version: 'v2.0.1',
    type: 'classification',
    status: 'healthy',
    deploymentStatus: 'staging',
    description: 'Neural risk scoring engine identifying churn propensity across SaaS enterprise accounts based on seat engagement and ticket velocity.',
    registeredAt: '2026-10-04',
    totalPredictions: 4310,
    avgLatencyMs: 92,
    errorRate: 0.28,
    activeDriftAlerts: 0,
    lastActive: '1 hour ago',
    framework: 'PyTorch 2.2',
    isDemo: true,
    inputFeatures: [
      { name: 'monthly_logins', displayName: 'Monthly Logins', type: 'numerical', min: 0, max: 500, default: 42, description: 'User login frequency' },
      { name: 'support_tickets', displayName: 'Support Tickets', type: 'numerical', min: 0, max: 20, default: 1, description: 'Open inquiries in last 30d' },
      { name: 'nps_score', displayName: 'NPS Score', type: 'numerical', min: 1, max: 10, default: 8, description: 'Latest survey score' },
    ],
    outputSchema: {
      name: 'churn_risk',
      type: 'categorical',
      classes: ['Low Risk', 'Moderate Risk', 'High Risk'],
    },
    referenceDataset: {
      name: 'enterprise_churn_2026q3.csv',
      sampleCount: 3800,
      uploadedAt: '2026-10-04',
    },
  },
];

export const DEMO_PREDICTIONS: PredictionItem[] = [
  {
    id: 'pred-901',
    modelId: 'model-iris-01',
    modelVersion: 'v1.4.2',
    inputs: { sepal_length: 5.1, sepal_width: 3.5, petal_length: 1.4, petal_width: 0.2 },
    prediction: 'Iris-setosa',
    probabilities: { 'Iris-setosa': 0.984, 'Iris-versicolor': 0.014, 'Iris-virginica': 0.002 },
    confidence: 0.984,
    latencyMs: 34,
    timestamp: '2 mins ago',
    status: 'success',
  },
  {
    id: 'pred-902',
    modelId: 'model-iris-01',
    modelVersion: 'v1.4.2',
    inputs: { sepal_length: 6.4, sepal_width: 3.2, petal_length: 4.5, petal_width: 1.5 },
    prediction: 'Iris-versicolor',
    probabilities: { 'Iris-setosa': 0.012, 'Iris-versicolor': 0.923, 'Iris-virginica': 0.065 },
    confidence: 0.923,
    latencyMs: 41,
    timestamp: '7 mins ago',
    status: 'success',
  },
  {
    id: 'pred-903',
    modelId: 'model-iris-01',
    modelVersion: 'v1.4.2',
    inputs: { sepal_length: 6.9, sepal_width: 3.1, petal_length: 5.4, petal_width: 2.1 },
    prediction: 'Iris-virginica',
    probabilities: { 'Iris-setosa': 0.001, 'Iris-versicolor': 0.057, 'Iris-virginica': 0.942 },
    confidence: 0.942,
    latencyMs: 36,
    timestamp: '14 mins ago',
    status: 'success',
  },
  {
    id: 'pred-904',
    modelId: 'model-iris-01',
    modelVersion: 'v1.4.2',
    inputs: { sepal_length: 5.7, sepal_width: 2.8, petal_length: 4.1, petal_width: 1.3 },
    prediction: 'Iris-versicolor',
    probabilities: { 'Iris-setosa': 0.018, 'Iris-versicolor': 0.895, 'Iris-virginica': 0.087 },
    confidence: 0.895,
    latencyMs: 39,
    timestamp: '28 mins ago',
    status: 'success',
  },
  {
    id: 'pred-905',
    modelId: 'model-iris-01',
    modelVersion: 'v1.4.2',
    inputs: { sepal_length: 4.9, sepal_width: 3.0, petal_length: 1.4, petal_width: 0.2 },
    prediction: 'Iris-setosa',
    probabilities: { 'Iris-setosa': 0.991, 'Iris-versicolor': 0.008, 'Iris-virginica': 0.001 },
    confidence: 0.991,
    latencyMs: 31,
    timestamp: '42 mins ago',
    status: 'success',
  },
];

export const DEMO_METRICS: MetricCardInfo[] = [
  {
    id: 'total-predictions',
    title: 'TOTAL PREDICTIONS',
    value: '14,820',
    subtitle: 'Requests processed during the selected period.',
    change: { value: '+18.4%', isPositive: true, period: 'vs previous 24h' },
    sparkline: [240, 310, 420, 390, 520, 610, 780, 890, 940, 1020, 1180, 1240],
    status: 'healthy',
  },
  {
    id: 'avg-latency',
    title: 'AVERAGE LATENCY',
    value: '38 ms',
    subtitle: 'Typical time required to return a prediction.',
    change: { value: '-4 ms', isPositive: true, period: 'faster than baseline' },
    sparkline: [46, 44, 42, 45, 41, 40, 39, 41, 38, 37, 39, 38],
    status: 'healthy',
  },
  {
    id: 'prediction-errors',
    title: 'PREDICTION ERRORS',
    value: '18',
    subtitle: 'Requests that failed during the selected period.',
    change: { value: '0.12%', isPositive: true, period: 'well under 1% SLA' },
    sparkline: [1, 2, 0, 1, 3, 2, 1, 4, 1, 0, 2, 1],
    status: 'healthy',
  },
  {
    id: 'active-drift-alerts',
    title: 'ACTIVE DRIFT ALERTS',
    value: '1',
    subtitle: 'Features requiring investigation.',
    change: { value: 'Petal Width', isPositive: false, period: 'needs review' },
    sparkline: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
    status: 'warning',
  },
];

export const DEMO_TIMELINE: TimelineEvent[] = [
  {
    id: 'ev-01',
    timestamp: '16:45 Today',
    title: 'Automated drift evaluation completed',
    category: 'drift',
    status: 'warning',
    description: 'Petal width distribution divergence exceeded 0.05 threshold (KS statistic = 0.38, p = 0.002).',
    details: 'Incoming samples show higher frequency of petal widths between 1.8cm - 2.4cm compared to training reference baseline.',
  },
  {
    id: 'ev-02',
    timestamp: '14:20 Today',
    title: 'Inference traffic peak handled',
    category: 'prediction',
    status: 'healthy',
    description: '1,420 predictions processed in 10 minutes with average latency of 36ms.',
  },
  {
    id: 'ev-03',
    timestamp: '11:00 Today',
    title: 'Daily reference baseline validated',
    category: 'system',
    status: 'healthy',
    description: 'Reference dataset integrity verified across 1,500 botanical records. Schema intact.',
  },
  {
    id: 'ev-04',
    timestamp: 'Yesterday 18:30',
    title: 'Model version v1.4.2 activated',
    category: 'deployment',
    status: 'info',
    description: 'Optimized ONNX runtime inference graph activated in production environment.',
  },
  {
    id: 'ev-05',
    timestamp: 'Oct 16, 2026',
    title: 'Low latency anomaly auto-recovered',
    category: 'alert',
    status: 'healthy',
    description: 'Container CPU throttling mitigated after auto-scaler expanded capacity to 3 pods.',
  },
];

export const DEMO_DRIFT_EVALUATION: DriftEvaluation = {
  id: 'eval-latest-iris',
  modelId: 'model-iris-01',
  modelName: 'Iris Species Classifier',
  timestamp: 'Today at 16:45',
  overallStatus: 'warning',
  evaluationWindow: '24h',
  featuresEvaluated: 4,
  featuresDrifting: 1,
  referenceSampleSize: 1500,
  incomingSampleSize: 850,
  plainSummary: '3 features show normal distribution consistency with the training dataset, while 1 feature (Petal Width) shows statistically significant distribution shift.',
  features: [
    {
      featureName: 'petal_width',
      displayName: 'Petal Width',
      driftScore: 0.38,
      pValue: 0.002,
      threshold: 0.05,
      status: 'warning',
      referenceMean: 1.20,
      incomingMean: 1.78,
      sampleCount: 850,
      distribution: [
        { bin: '0.0 - 0.5 cm', referenceValue: 33, incomingValue: 12 },
        { bin: '0.5 - 1.0 cm', referenceValue: 18, incomingValue: 15 },
        { bin: '1.0 - 1.5 cm', referenceValue: 26, incomingValue: 22 },
        { bin: '1.5 - 2.0 cm', referenceValue: 16, incomingValue: 34 },
        { bin: '2.0 - 2.5 cm', referenceValue: 7, incomingValue: 17 },
      ],
      explanation: 'The incoming values for petal width are shifted significantly higher than the reference dataset. Incoming specimens have a mean of 1.78 cm vs 1.20 cm in training baseline.',
      possibleImpact: 'The model may predict Iris-virginica more frequently because wider petals correlate with that class.',
      recommendedAction: 'Inspect recent data sources or customer queries to check if the incoming population represents late-season flowers or distinct geographical varieties.',
    },
    {
      featureName: 'petal_length',
      displayName: 'Petal Length',
      driftScore: 0.12,
      pValue: 0.08,
      threshold: 0.05,
      status: 'healthy',
      referenceMean: 3.76,
      incomingMean: 3.92,
      sampleCount: 850,
      distribution: [
        { bin: '1.0 - 2.5 cm', referenceValue: 32, incomingValue: 29 },
        { bin: '2.5 - 4.0 cm', referenceValue: 12, incomingValue: 14 },
        { bin: '4.0 - 5.5 cm', referenceValue: 38, incomingValue: 40 },
        { bin: '5.5 - 7.0 cm', referenceValue: 18, incomingValue: 17 },
      ],
      explanation: 'Incoming values closely match the reference distribution curve. P-value (0.08) is above the 0.05 drift threshold.',
      possibleImpact: 'No observable impact on classification boundaries.',
      recommendedAction: 'Continue passive monitoring on scheduled intervals.',
    },
    {
      featureName: 'sepal_length',
      displayName: 'Sepal Length',
      driftScore: 0.07,
      pValue: 0.45,
      threshold: 0.05,
      status: 'healthy',
      referenceMean: 5.84,
      incomingMean: 5.89,
      sampleCount: 850,
      distribution: [
        { bin: '4.0 - 5.0 cm', referenceValue: 16, incomingValue: 15 },
        { bin: '5.0 - 6.0 cm', referenceValue: 40, incomingValue: 41 },
        { bin: '6.0 - 7.0 cm', referenceValue: 34, incomingValue: 33 },
        { bin: '7.0 - 8.5 cm', referenceValue: 10, incomingValue: 11 },
      ],
      explanation: 'Sepal length distribution is virtually identical to the reference dataset with p-value of 0.45.',
      possibleImpact: 'Normal model behavior expected.',
      recommendedAction: 'No action required.',
    },
    {
      featureName: 'sepal_width',
      displayName: 'Sepal Width',
      driftScore: 0.09,
      pValue: 0.31,
      threshold: 0.05,
      status: 'healthy',
      referenceMean: 3.05,
      incomingMean: 3.01,
      sampleCount: 850,
      distribution: [
        { bin: '2.0 - 2.8 cm', referenceValue: 28, incomingValue: 29 },
        { bin: '2.8 - 3.4 cm', referenceValue: 52, incomingValue: 50 },
        { bin: '3.4 - 4.2 cm', referenceValue: 20, incomingValue: 21 },
      ],
      explanation: 'Sepal width shows standard Gaussian distribution centered at 3.01 cm, completely aligned with baseline.',
      possibleImpact: 'Normal model behavior expected.',
      recommendedAction: 'No action required.',
    },
  ],
};

export const DEMO_ALERTS: IncidentAlert[] = [
  {
    id: 'alert-drift-01',
    severity: 'warning',
    title: 'Input distribution changed for Petal Width',
    modelId: 'model-iris-01',
    modelName: 'Iris Species Classifier',
    affectedFeature: 'petal_width',
    detectedAt: 'Today at 16:45',
    status: 'active',
    summary: 'The latest evaluation found a statistically significant divergence between the reference and incoming distributions for petal_width.',
    observation: 'KS test statistic = 0.38 (threshold: 0.05, p-value = 0.002). Incoming mean is 1.78 cm vs reference 1.20 cm.',
    possibleImpact: 'The model may be receiving botanical data that differs from its initial training environment, potentially skewing predictions toward Iris-virginica.',
    recommendedAction: 'Review the incoming data source, verify if recent specimens originate from a new greenhouse/region, and validate predictions against labeled ground truth.',
    metricEvidence: 'KS Distance: 0.380 | p-value: 0.002 | Reference Mean: 1.20cm | Incoming Mean: 1.78cm',
    evaluationId: 'eval-latest-iris',
  },
  {
    id: 'alert-perf-02',
    severity: 'info',
    title: 'Baseline dataset updated',
    modelId: 'model-iris-01',
    modelName: 'Iris Species Classifier',
    detectedAt: 'Yesterday at 14:00',
    status: 'resolved',
    summary: 'Reference baseline dataset was synchronized with 1,500 curated horticultural records.',
    observation: 'All schema validations passed with zero missing null values.',
    possibleImpact: 'Provides a more robust statistical foundation for future Kolmogorov-Smirnov drift tests.',
    recommendedAction: 'Resolved. No further action needed.',
    metricEvidence: '1,500 samples validated | 4 continuous feature columns',
  },
  {
    id: 'alert-perf-03',
    severity: 'critical',
    title: 'Prediction latency spike detected',
    modelId: 'model-churn-03',
    modelName: 'Enterprise Customer Churn Predictor',
    detectedAt: '3 days ago',
    status: 'resolved',
    summary: 'Average latency briefly spiked to 310ms during batch ETL ingestion window.',
    observation: 'Inference worker memory saturation reached 94% on replica node 2.',
    possibleImpact: 'Client requests experienced 220ms delay before horizontal pod autoscaler spun up 2 additional replicas.',
    recommendedAction: 'Resolved. Horizontal pod autoscaler minimum replicas adjusted from 1 to 3.',
    metricEvidence: 'P99 Latency: 310ms | Error Count: 0 | CPU Throttling: 14%',
  },
];

// High-fidelity local classifier simulation for Iris model when offline or in Demo Mode
export function runLocalIrisPrediction(inputs: Record<string, number>): {
  prediction: string;
  probabilities: Record<string, number>;
  confidence: number;
  latencyMs: number;
} {
  const sl = Number(inputs.sepal_length) || 5.8;
  const sw = Number(inputs.sepal_width) || 3.0;
  const pl = Number(inputs.petal_length) || 4.3;
  const pw = Number(inputs.petal_width) || 1.3;

  // Real Fisher Iris discriminant scoring
  // Setosa: small petals (pl < 2.5)
  // Versicolor: intermediate (2.5 <= pl < 4.9, pw < 1.75)
  // Virginica: large petals (pl >= 4.9 or pw >= 1.75)
  let scoreSetosa = 0;
  let scoreVersicolor = 0;
  let scoreVirginica = 0;

  if (pl < 2.5) {
    scoreSetosa = 5.0 - pl;
    scoreVersicolor = 0.2;
    scoreVirginica = 0.05;
  } else if (pw >= 1.8 || pl >= 5.0) {
    scoreVirginica = 3.0 + (pw - 1.5) * 2 + (pl - 4.5);
    scoreVersicolor = 1.0;
    scoreSetosa = 0.01;
  } else {
    scoreVersicolor = 3.5 - Math.abs(pl - 4.2) - Math.abs(pw - 1.3);
    scoreVirginica = Math.max(0.2, (pw - 1.2) * 2);
    scoreSetosa = 0.05;
  }

  // Softmax
  const expSetosa = Math.exp(scoreSetosa);
  const expVersicolor = Math.exp(scoreVersicolor);
  const expVirginica = Math.exp(scoreVirginica);
  const sumExp = expSetosa + expVersicolor + expVirginica;

  const probSetosa = Number((expSetosa / sumExp).toFixed(3));
  const probVersicolor = Number((expVersicolor / sumExp).toFixed(3));
  const probVirginica = Number((1 - probSetosa - probVersicolor).toFixed(3));

  let prediction = 'Iris-setosa';
  let confidence = probSetosa;

  if (probVersicolor > probSetosa && probVersicolor > probVirginica) {
    prediction = 'Iris-versicolor';
    confidence = probVersicolor;
  } else if (probVirginica > probSetosa && probVirginica > probVersicolor) {
    prediction = 'Iris-virginica';
    confidence = probVirginica;
  }

  // Realistic randomized micro-latency between 28ms and 45ms
  const latencyMs = Math.floor(28 + Math.random() * 18);

  return {
    prediction,
    probabilities: {
      'Iris-setosa': probSetosa,
      'Iris-versicolor': probVersicolor,
      'Iris-virginica': probVirginica,
    },
    confidence,
    latencyMs,
  };
}
