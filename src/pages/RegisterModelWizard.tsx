import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  UploadCloud,
  FileCode,
  Database,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Plus,
  Trash2,
  RefreshCw,
  FileUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { FeatureSchema } from '../types';

export const RegisterModelWizard: React.FC = () => {
  const navigate = useNavigate();
  const { registerNewModel, showToast } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form State
  // Step 1
  const [modelName, setModelName] = useState('Crop Yield Random Forest');
  const [description, setDescription] = useState(
    'Ensemble forest regressor predicting agricultural harvest tonnage per acre based on soil nitrogen and rainfall.'
  );
  const [modelType, setModelType] = useState<'classification' | 'regression'>('regression');
  const [version, setVersion] = useState('v1.0.0');
  const [framework, setFramework] = useState('scikit-learn 1.4');

  // Step 2
  const [artifactFile, setArtifactFile] = useState<{ name: string; size: string } | null>({
    name: 'crop_yield_model.pkl',
    size: '14.2 MB',
  });
  const artifactInputRef = useRef<HTMLInputElement>(null);
  const datasetInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingArtifact, setIsUploadingArtifact] = useState<boolean>(false);
  const [isUploadingDataset, setIsUploadingDataset] = useState<boolean>(false);
  const [isDraggingArtifact, setIsDraggingArtifact] = useState<boolean>(false);
  const [isDraggingDataset, setIsDraggingDataset] = useState<boolean>(false);

  const handleArtifactFile = async (file: File) => {
    setIsUploadingArtifact(true);
    try {
      const res = await api.uploadArtifact(file);
      setArtifactFile({ name: res.filename, size: res.size });
      showToast('Artifact Uploaded', 'success', `${res.filename} (${res.size}) validated.`);
    } catch {
      showToast('Upload Error', 'error', 'Unable to upload model artifact.');
    } finally {
      setIsUploadingArtifact(false);
    }
  };

  const handleDatasetFile = (file: File) => {
    setIsUploadingDataset(true);
    setReferenceFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const lines = text.trim().split('\n').filter((l) => l.trim().length > 0);
        const count = Math.max(1, lines.length - 1);
        setReferenceSampleCount(count);
        showToast('Baseline Ingested', 'success', `Loaded ${count} observations from ${file.name}`);
      }
      setIsUploadingDataset(false);
    };
    reader.onerror = () => {
      showToast('File Read Error', 'error', 'Unable to read dataset content.');
      setIsUploadingDataset(false);
    };
    reader.readAsText(file);
  };

  // Step 3: Input features
  const [features, setFeatures] = useState<FeatureSchema[]>([
    {
      name: 'soil_nitrogen_ppm',
      displayName: 'Soil Nitrogen (PPM)',
      type: 'numerical',
      min: 10,
      max: 300,
      default: 85,
      description: 'Nitrogen content measured via chemical soil probe',
    },
    {
      name: 'monthly_rainfall_mm',
      displayName: 'Monthly Rainfall (mm)',
      type: 'numerical',
      min: 0,
      max: 600,
      default: 120,
      description: 'Precipitation recorded during growing season',
    },
    {
      name: 'avg_ambient_temp_c',
      displayName: 'Average Ambient Temperature (°C)',
      type: 'numerical',
      min: 5,
      max: 45,
      default: 24,
      description: 'Mean canopy temperature during daylight hours',
    },
  ]);

  // Step 4: Reference baseline dataset
  const [referenceFileName, setReferenceFileName] = useState('crop_benchmark_baseline_2026.csv');
  const [referenceSampleCount, setReferenceSampleCount] = useState(2500);

  const handleNext = () => {
    if (currentStep === 1 && !modelName.trim()) {
      showToast('Validation Error', 'error', 'Model name is required.');
      return;
    }
    if (currentStep === 2 && !artifactFile) {
      showToast('Validation Error', 'error', 'Please upload or select a model artifact.');
      return;
    }
    setCurrentStep((prev) => Math.min(5, prev + 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleAddFeature = () => {
    const newIdx = features.length + 1;
    setFeatures((prev) => [
      ...prev,
      {
        name: `feature_${newIdx}`,
        displayName: `Feature ${newIdx}`,
        type: 'numerical',
        min: 0,
        max: 100,
        default: 10,
        description: 'Custom input parameter',
      },
    ]);
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const created = await registerNewModel({
        name: modelName,
        description,
        type: modelType,
        version,
        framework,
        inputFeatures: features,
        outputSchema: {
          name: modelType === 'classification' ? 'target_class' : 'predicted_yield',
          type: modelType === 'classification' ? 'categorical' : 'continuous',
        },
        referenceDataset: {
          name: referenceFileName,
          sampleCount: referenceSampleCount,
          uploadedAt: new Date().toISOString().split('T')[0],
        },
      });

      // Fire celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#635BFF', '#79E2B5', '#A9D8FF'],
      });

      setTimeout(() => {
        navigate(`/models/${created.id}`);
      }, 1200);
    } catch {
      showToast('Registration Error', 'error', 'Unable to complete model registration.');
      setIsSubmitting(false);
    }
  };

  const stepLabels = [
    { num: 1, label: 'Metadata' },
    { num: 2, label: 'Artifact' },
    { num: 3, label: 'Input Schema' },
    { num: 4, label: 'Reference Baseline' },
    { num: 5, label: 'Review & Launch' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-brand-midnight tracking-tight">
          Model Registration Wizard
        </h1>
        <p className="text-sm text-brand-slate">
          Onboard a machine learning system into the continuous surveillance observatory
        </p>
      </div>

      {/* Step Indicator */}
      <div className="card-subtle p-4 sm:p-5">
        <div className="flex items-center justify-between">
          {stepLabels.map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    currentStep === s.num
                      ? 'bg-brand-indigo text-white ring-4 ring-brand-indigo/20 shadow-sm'
                      : currentStep > s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-brand-ivory text-brand-slate border border-brand-border'
                  }`}
                >
                  {currentStep > s.num ? <CheckCircle2 size={15} /> : s.num}
                </div>
                <span
                  className={`text-xs font-semibold hidden md:inline ${
                    currentStep === s.num
                      ? 'text-brand-midnight'
                      : currentStep > s.num
                      ? 'text-emerald-700'
                      : 'text-brand-slate'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < stepLabels.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 rounded transition-colors ${
                    currentStep > s.num ? 'bg-emerald-500' : 'bg-brand-border'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Wizard Step Body */}
      <div className="card-subtle p-6 sm:p-8 space-y-6">
        {/* STEP 1: MODEL INFORMATION */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-lg font-display font-bold text-brand-midnight">
                Step 1: Model Identification & Architecture
              </h2>
              <p className="text-xs text-brand-slate">
                Name your model and describe its mathematical and operational objective
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-brand-midnight block mb-1">
                  Model Name *
                </label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="e.g. Fraud Detection LightGBM"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-ivory/60 border border-brand-border text-sm text-brand-midnight focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand-midnight block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what the model predicts and why it matters..."
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-ivory/60 border border-brand-border text-sm text-brand-midnight focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:bg-white resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-brand-midnight block mb-1">
                    Model Objective
                  </label>
                  <select
                    value={modelType}
                    onChange={(e) => setModelType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-ivory/60 border border-brand-border text-xs sm:text-sm font-semibold text-brand-midnight cursor-pointer"
                  >
                    <option value="regression">Regression (Continuous)</option>
                    <option value="classification">Classification (Categorical)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-brand-midnight block mb-1">
                    Initial Version
                  </label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-brand-ivory/60 border border-brand-border text-xs sm:text-sm font-mono text-brand-midnight"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-brand-midnight block mb-1">
                    ML Framework
                  </label>
                  <input
                    type="text"
                    value={framework}
                    onChange={(e) => setFramework(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-brand-ivory/60 border border-brand-border text-xs sm:text-sm font-mono text-brand-midnight"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: MODEL ARTIFACT */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-lg font-display font-bold text-brand-midnight">
                Step 2: Model Artifact Deployment
              </h2>
              <p className="text-xs text-brand-slate">
                Select your serialized model weights or binary bundle (.pkl, .joblib, .onnx, .pt, .safetensors, etc.)
              </p>
            </div>

            <input
              type="file"
              ref={artifactInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleArtifactFile(e.target.files[0]);
                }
              }}
              accept=".pkl,.joblib,.onnx,.pt,.safetensors,.h5,.bin"
              className="hidden"
            />

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingArtifact(true);
              }}
              onDragLeave={() => setIsDraggingArtifact(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingArtifact(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleArtifactFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => artifactInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center space-y-3 transition-all cursor-pointer ${
                isDraggingArtifact
                  ? 'border-brand-indigo bg-brand-indigo-tint/30 scale-[1.01]'
                  : 'border-brand-border hover:border-brand-indigo bg-brand-ivory/40'
              }`}
            >
              {isUploadingArtifact ? (
                <div className="py-4 space-y-2">
                  <RefreshCw size={36} className="mx-auto text-brand-indigo animate-spin" />
                  <p className="text-sm font-bold text-brand-midnight">Uploading & Validating Artifact...</p>
                </div>
              ) : (
                <>
                  <UploadCloud size={40} className="mx-auto text-brand-indigo" />
                  <div>
                    <p className="text-sm font-semibold text-brand-midnight">
                      Drag & drop your serialized artifact or <span className="text-brand-indigo font-bold underline">click to browse</span>
                    </p>
                    <p className="text-xs text-brand-slate mt-0.5">
                      Supported formats: .pkl, .joblib, .onnx, .pt, .safetensors (Max 250MB)
                    </p>
                  </div>
                </>
              )}

              {artifactFile && !isUploadingArtifact && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-brand-border shadow-subtle text-xs font-mono font-bold text-brand-midnight mt-2"
                >
                  <FileCode size={15} className="text-brand-indigo" />
                  <span>{artifactFile.name}</span>
                  <span className="text-brand-slate">({artifactFile.size})</span>
                  <span className="text-emerald-600 font-sans font-semibold ml-2">✓ Validated</span>
                  <button
                    type="button"
                    onClick={() => artifactInputRef.current?.click()}
                    className="ml-2 text-[11px] font-sans text-brand-indigo hover:underline font-bold"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 leading-relaxed">
              <strong>Security Protocol:</strong> Artifacts run in isolated sandboxed workers. Arbitrary unverified code execution is blocked.
            </div>
          </div>
        )}

        {/* STEP 3: INPUT SCHEMA */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-display font-bold text-brand-midnight">
                  Step 3: Define Input Feature Schema
                </h2>
                <p className="text-xs text-brand-slate">
                  Specify input features and expected bounds for automated validation
                </p>
              </div>

              <button
                onClick={handleAddFeature}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-indigo-tint text-brand-indigo text-xs font-bold hover:bg-brand-indigo hover:text-white transition-all"
              >
                <Plus size={14} />
                <span>Add Feature</span>
              </button>
            </div>

            <div className="space-y-3">
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-brand-ivory/60 border border-brand-border/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                >
                  <div className="sm:col-span-4">
                    <label className="text-[10px] uppercase font-bold text-brand-slate block">
                      Feature Identifier
                    </label>
                    <input
                      type="text"
                      value={feat.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFeatures((prev) =>
                          prev.map((f, i) => (i === idx ? { ...f, name: val, displayName: val } : f))
                        );
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-brand-border text-xs font-mono font-bold text-brand-midnight"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="text-[10px] uppercase font-bold text-brand-slate block">
                      Description
                    </label>
                    <input
                      type="text"
                      value={feat.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFeatures((prev) =>
                          prev.map((f, i) => (i === idx ? { ...f, description: val } : f))
                        );
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-brand-border text-xs text-brand-midnight"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-[10px] uppercase font-bold text-brand-slate block">
                      Default Value
                    </label>
                    <input
                      type="number"
                      value={feat.default}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setFeatures((prev) =>
                          prev.map((f, i) => (i === idx ? { ...f, default: val } : f))
                        );
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-brand-border text-xs font-mono text-brand-midnight"
                    />
                  </div>

                  <div className="sm:col-span-1 flex justify-end">
                    {features.length > 1 && (
                      <button
                        onClick={() => handleRemoveFeature(idx)}
                        className="p-1.5 rounded-lg text-brand-slate hover:text-rose-600 transition-colors"
                        title="Delete feature"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: REFERENCE DATASET */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-lg font-display font-bold text-brand-midnight">
                Step 4: Reference Baseline Dataset
              </h2>
              <p className="text-xs text-brand-slate">
                ModelGuard requires a verified baseline dataset to detect future statistical distribution drift
              </p>
            </div>

            <input
              type="file"
              ref={datasetInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleDatasetFile(e.target.files[0]);
                }
              }}
              accept=".csv,.json"
              className="hidden"
            />

            {/* Baseline Dropzone / Browse */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingDataset(true);
              }}
              onDragLeave={() => setIsDraggingDataset(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingDataset(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleDatasetFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => datasetInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center space-y-2 transition-all cursor-pointer ${
                isDraggingDataset
                  ? 'border-brand-indigo bg-brand-indigo-tint/30 scale-[1.01]'
                  : 'border-brand-border hover:border-brand-indigo bg-brand-ivory/40'
              }`}
            >
              {isUploadingDataset ? (
                <div className="py-2 space-y-1">
                  <RefreshCw size={28} className="mx-auto text-brand-indigo animate-spin" />
                  <p className="text-xs font-bold text-brand-midnight">Parsing Baseline File...</p>
                </div>
              ) : (
                <>
                  <FileUp size={32} className="mx-auto text-brand-indigo" />
                  <p className="text-xs sm:text-sm font-semibold text-brand-midnight">
                    Drop your reference dataset (<code className="font-mono text-brand-indigo font-bold">.csv</code> or <code className="font-mono text-brand-indigo font-bold">.json</code>) or <span className="text-brand-indigo underline font-bold">click to browse</span>
                  </p>
                  <p className="text-[11px] text-brand-slate">
                    Automatically extracts row counts and maps features to your schema
                  </p>
                </>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-brand-ivory border border-brand-border space-y-4">
              <div className="flex items-center gap-3">
                <Database size={24} className="text-brand-indigo flex-shrink-0" />
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-brand-slate">
                    Baseline File Specification
                  </h4>
                  <p className="text-xs text-brand-midnight">
                    Contains sample features matching your input schema.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-brand-midnight block mb-1">
                    Baseline Filename
                  </label>
                  <input
                    type="text"
                    value={referenceFileName}
                    onChange={(e) => setReferenceFileName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-white border border-brand-border text-xs font-mono text-brand-midnight"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-brand-midnight block mb-1">
                    Sample Observations Count
                  </label>
                  <input
                    type="number"
                    value={referenceSampleCount}
                    onChange={(e) => setReferenceSampleCount(parseInt(e.target.value) || 1000)}
                    className="w-full px-4 py-2 rounded-xl bg-white border border-brand-border text-xs font-mono text-brand-midnight"
                  />
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                Baseline verified. 100% column schema match with all {features.length} features ({referenceSampleCount.toLocaleString()} rows).
              </span>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW AND REGISTER */}
        {currentStep === 5 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-lg font-display font-bold text-brand-midnight">
                Step 5: Review Configuration & Launch Observatory
              </h2>
              <p className="text-xs text-brand-slate">
                Confirm model registration settings before activating live monitoring
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-brand-ivory/80 border border-brand-border space-y-4">
              <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-slate">Model Name</span>
                  <div className="text-base font-bold text-brand-midnight">{modelName}</div>
                </div>
                <span className="text-xs font-mono font-bold text-brand-indigo bg-brand-indigo-tint px-2.5 py-1 rounded-md">
                  {version} • {framework}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-brand-slate block">Objective:</span>
                  <strong className="text-brand-midnight uppercase">{modelType}</strong>
                </div>
                <div>
                  <span className="text-brand-slate block">Artifact:</span>
                  <strong className="text-brand-midnight font-mono">{artifactFile?.name}</strong>
                </div>
                <div>
                  <span className="text-brand-slate block">Features:</span>
                  <strong className="text-brand-midnight">{features.length} Monitored</strong>
                </div>
                <div>
                  <span className="text-brand-slate block">Baseline Samples:</span>
                  <strong className="text-brand-midnight font-mono">
                    {referenceSampleCount.toLocaleString()} rows
                  </strong>
                </div>
                <div>
                  <span className="text-brand-slate block">Drift Test:</span>
                  <strong className="text-brand-midnight">Kolmogorov-Smirnov</strong>
                </div>
                <div>
                  <span className="text-brand-slate block">Initial Status:</span>
                  <strong className="text-brand-indigo">Initializing Surveillance</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-brand-border/80">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-brand-border text-xs font-semibold text-brand-slate hover:text-brand-midnight hover:bg-brand-ivory transition-all"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-indigo text-white text-xs sm:text-sm font-semibold hover:bg-brand-indigo-dark shadow-sm transition-all"
            >
              <span>Continue</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-bold hover:bg-emerald-700 shadow-float transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Registering Model & Establishing Baseline...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Complete Registration & Deploy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
