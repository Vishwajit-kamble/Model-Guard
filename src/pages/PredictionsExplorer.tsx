import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  Sparkles,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
  Code,
  Check,
  ChevronRight,
  Info,
  Sliders,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { PredictionItem } from '../types';

export const PredictionsExplorer: React.FC = () => {
  const { models, currentModelId, setCurrentModelId, currentModel, predictions, addNewPrediction, showToast } = useApp();

  // Custom inputs for dynamic models
  const [customInputs, setCustomInputs] = useState<Record<string, number>>({});

  useEffect(() => {
    if (currentModel && currentModel.inputFeatures) {
      const initial: Record<string, number> = {};
      currentModel.inputFeatures.forEach((f) => {
        const val = typeof f.default === 'number' ? f.default : parseFloat(String(f.default));
        initial[f.name] = !isNaN(val) ? val : (f.min !== undefined ? f.min : 10);
      });
      setCustomInputs(initial);
    }
  }, [currentModel]);

  // Inputs for Iris classifier
  const [sepalLength, setSepalLength] = useState<number>(5.8);
  const [sepalWidth, setSepalWidth] = useState<number>(3.0);
  const [petalLength, setPetalLength] = useState<number>(4.3);
  const [petalWidth, setPetalWidth] = useState<number>(1.3);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [latestResult, setLatestResult] = useState<PredictionItem | null>(
    predictions.length > 0 ? predictions[0] : null
  );
  const [showJsonInspector, setShowJsonInspector] = useState<boolean>(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<PredictionItem | null>(null);

  // Quick specimen presets
  const presets = [
    {
      label: 'Setosa Specimen',
      values: { sepalLength: 5.0, sepalWidth: 3.5, petalLength: 1.4, petalWidth: 0.2 },
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      label: 'Versicolor Specimen',
      values: { sepalLength: 6.4, sepalWidth: 3.2, petalLength: 4.5, petalWidth: 1.5 },
      color: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      label: 'Virginica Specimen',
      values: { sepalLength: 7.2, sepalWidth: 3.2, petalLength: 6.0, petalWidth: 2.2 },
      color: 'bg-purple-50 text-purple-800 border-purple-200',
    },
    {
      label: 'Drift Specimen (High Width)',
      values: { sepalLength: 5.9, sepalWidth: 3.0, petalLength: 4.2, petalWidth: 2.4 },
      color: 'bg-amber-50 text-amber-800 border-amber-200',
    },
  ];

  const handleApplyPreset = (values: {
    sepalLength: number;
    sepalWidth: number;
    petalLength: number;
    petalWidth: number;
  }) => {
    setSepalLength(values.sepalLength);
    setSepalWidth(values.sepalWidth);
    setPetalLength(values.petalLength);
    setPetalWidth(values.petalWidth);
    showToast('Preset Applied', 'info', 'Form updated with selected botanical features.');
  };

  const handleReset = () => {
    if (currentModel?.id === 'model-iris-01') {
      setSepalLength(5.8);
      setSepalWidth(3.0);
      setPetalLength(4.3);
      setPetalWidth(1.3);
    } else if (currentModel?.inputFeatures) {
      const initial: Record<string, number> = {};
      currentModel.inputFeatures.forEach((f) => {
        const val = typeof f.default === 'number' ? f.default : parseFloat(String(f.default));
        initial[f.name] = !isNaN(val) ? val : (f.min !== undefined ? f.min : 10);
      });
      setCustomInputs(initial);
    }
  };

  const handleRunPrediction = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const inputs: Record<string, number> =
        currentModel?.id === 'model-iris-01'
          ? {
              sepal_length: sepalLength,
              sepal_width: sepalWidth,
              petal_length: petalLength,
              petal_width: petalWidth,
            }
          : { ...customInputs };

      const result = await api.predict(currentModel?.id || 'model-iris-01', inputs);
      setLatestResult(result);
      addNewPrediction(result);
      showToast(
        'Prediction Completed',
        'success',
        `Predicted: ${result.prediction} (${result.latencyMs}ms)`
      );
    } catch {
      showToast('Prediction Failed', 'error', 'Unable to complete inference request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-brand-midnight tracking-tight">
            Predictions Explorer
          </h1>
          <p className="text-sm text-brand-slate mt-0.5">
            Execute real-time interactive inferences against the active model artifact with telemetry profiling
          </p>
        </div>

        {/* Model Switcher Dropdown */}
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-brand-border shadow-subtle">
          <Layers size={16} className="text-brand-indigo flex-shrink-0" />
          <span className="text-xs font-bold text-brand-slate">Target Model:</span>
          <select
            value={currentModel?.id || currentModelId}
            onChange={(e) => setCurrentModelId(e.target.value)}
            className="text-xs font-bold text-brand-midnight bg-transparent focus:outline-none cursor-pointer"
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.version})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Runner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Section: Inputs & Controls (7 Cols) */}
        <div className="lg:col-span-7 card-subtle p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border/60 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-display font-bold text-brand-midnight">
                Input Feature Values
              </h2>
              <span className="text-xs text-brand-slate">
                Model: <strong className="text-brand-midnight">{currentModel?.name || 'Iris Species Classifier'}</strong>
              </span>
            </div>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-brand-slate hover:text-brand-midnight hover:bg-brand-ivory border border-transparent hover:border-brand-border transition-all self-start sm:self-auto"
            >
              <RotateCcw size={13} />
              <span>Reset Values</span>
            </button>
          </div>

          {/* Features Inputs: Iris botanical presets OR Dynamic Model Features */}
          {currentModel?.id === 'model-iris-01' ? (
            <>
              {/* Quick Presets */}
              <div className="space-y-2">
                <span className="text-[11px] uppercase font-bold tracking-wider text-brand-slate block">
                  Quick Benchmark Presets
                </span>
                <div className="flex flex-wrap gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => handleApplyPreset(preset.values)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:scale-105 active:scale-95 ${preset.color}`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders and Numerical Inputs */}
              <div className="space-y-5 pt-2">
                {/* Sepal Length */}
                <div className="p-4 rounded-2xl bg-brand-ivory/60 border border-brand-border/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-brand-midnight block">
                        Sepal Length (cm)
                      </label>
                      <span className="text-[10px] text-brand-slate">Range: 4.0 - 8.5 cm</span>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      min="4.0"
                      max="8.5"
                      value={sepalLength}
                      onChange={(e) => setSepalLength(parseFloat(e.target.value) || 4.0)}
                      className="w-20 px-2 py-1 text-right font-mono font-bold text-sm bg-white rounded-lg border border-brand-border text-brand-midnight"
                    />
                  </div>
                  <input
                    type="range"
                    min="4.0"
                    max="8.5"
                    step="0.1"
                    value={sepalLength}
                    onChange={(e) => setSepalLength(parseFloat(e.target.value))}
                    className="w-full accent-brand-indigo cursor-pointer"
                  />
                </div>

                {/* Sepal Width */}
                <div className="p-4 rounded-2xl bg-brand-ivory/60 border border-brand-border/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-brand-midnight block">
                        Sepal Width (cm)
                      </label>
                      <span className="text-[10px] text-brand-slate">Range: 2.0 - 5.0 cm</span>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      min="2.0"
                      max="5.0"
                      value={sepalWidth}
                      onChange={(e) => setSepalWidth(parseFloat(e.target.value) || 2.0)}
                      className="w-20 px-2 py-1 text-right font-mono font-bold text-sm bg-white rounded-lg border border-brand-border text-brand-midnight"
                    />
                  </div>
                  <input
                    type="range"
                    min="2.0"
                    max="5.0"
                    step="0.1"
                    value={sepalWidth}
                    onChange={(e) => setSepalWidth(parseFloat(e.target.value))}
                    className="w-full accent-brand-indigo cursor-pointer"
                  />
                </div>

                {/* Petal Length */}
                <div className="p-4 rounded-2xl bg-brand-ivory/60 border border-brand-border/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-brand-midnight block">
                        Petal Length (cm)
                      </label>
                      <span className="text-[10px] text-brand-slate">Range: 1.0 - 7.5 cm</span>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="7.5"
                      value={petalLength}
                      onChange={(e) => setPetalLength(parseFloat(e.target.value) || 1.0)}
                      className="w-20 px-2 py-1 text-right font-mono font-bold text-sm bg-white rounded-lg border border-brand-border text-brand-midnight"
                    />
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="7.5"
                    step="0.1"
                    value={petalLength}
                    onChange={(e) => setPetalLength(parseFloat(e.target.value))}
                    className="w-full accent-brand-indigo cursor-pointer"
                  />
                </div>

                {/* Petal Width */}
                <div className="p-4 rounded-2xl bg-brand-ivory/60 border border-brand-border/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-brand-midnight block">
                        Petal Width (cm)
                      </label>
                      <span className="text-[10px] text-brand-slate">Range: 0.1 - 3.0 cm</span>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="3.0"
                      value={petalWidth}
                      onChange={(e) => setPetalWidth(parseFloat(e.target.value) || 0.1)}
                      className="w-20 px-2 py-1 text-right font-mono font-bold text-sm bg-white rounded-lg border border-brand-border text-brand-midnight"
                    />
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={petalWidth}
                    onChange={(e) => setPetalWidth(parseFloat(e.target.value))}
                    className="w-full accent-brand-indigo cursor-pointer"
                  />
                </div>
              </div>
            </>
          ) : (
            /* Dynamic Inputs for Custom Models */
            <div className="space-y-4 pt-2">
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex items-center justify-between">
                <span>
                  <strong>Dynamic Schema Runner:</strong> Monitored features loaded for <strong>{currentModel?.name}</strong>.
                </span>
                <span className="font-mono text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {currentModel?.type}
                </span>
              </div>

              {(currentModel?.inputFeatures || []).map((feat) => {
                const minVal = feat.min !== undefined ? feat.min : 0;
                const maxVal = feat.max !== undefined ? feat.max : 100;
                const curVal = customInputs[feat.name] !== undefined ? customInputs[feat.name] : (feat.default || minVal);
                const step = maxVal - minVal <= 10 ? 0.1 : 1;

                return (
                  <div key={feat.name} className="p-4 rounded-2xl bg-brand-ivory/60 border border-brand-border/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-bold text-brand-midnight block">
                          {feat.displayName || feat.name} {feat.unit ? `(${feat.unit})` : ''}
                        </label>
                        <span className="text-[10px] text-brand-slate">
                          {feat.description || `Range: ${minVal} - ${maxVal}`}
                        </span>
                      </div>
                      <input
                        type="number"
                        step={step}
                        min={minVal}
                        max={maxVal}
                        value={curVal}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setCustomInputs((prev) => ({ ...prev, [feat.name]: isNaN(val) ? minVal : val }));
                        }}
                        className="w-24 px-2 py-1 text-right font-mono font-bold text-sm bg-white rounded-lg border border-brand-border text-brand-midnight"
                      />
                    </div>
                    <input
                      type="range"
                      min={minVal}
                      max={maxVal}
                      step={step}
                      value={curVal}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setCustomInputs((prev) => ({ ...prev, [feat.name]: val }));
                      }}
                      className="w-full accent-brand-indigo cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              onClick={handleRunPrediction}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-sm text-white shadow-float transition-all ${
                isLoading
                  ? 'bg-brand-indigo/60 cursor-not-allowed'
                  : 'bg-brand-indigo hover:bg-brand-indigo-dark active:scale-[0.99]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing botanical inference vectors...</span>
                </>
              ) : (
                <>
                  <Play size={16} className="fill-current" />
                  <span>Run Model Prediction</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Section: Prediction Result Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card-subtle p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-brand-indigo" />
                <h3 className="text-sm uppercase font-bold tracking-wider text-brand-slate">
                  Inference Result
                </h3>
              </div>

              {latestResult && (
                <button
                  onClick={() => setShowJsonInspector(!showJsonInspector)}
                  className="flex items-center gap-1 text-xs font-mono font-semibold text-brand-indigo hover:underline"
                >
                  <Code size={13} />
                  <span>{showJsonInspector ? 'Hide JSON' : 'Inspect JSON'}</span>
                </button>
              )}
            </div>

            {latestResult ? (
              <div className="space-y-6">
                {/* Result Hero Header */}
                <div className="p-5 rounded-2xl bg-brand-ivory/80 border border-brand-border text-center space-y-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-slate">
                    Predicted Classification Target
                  </span>
                  <div className="text-2xl sm:text-3xl font-display font-extrabold text-brand-indigo tracking-tight">
                    {latestResult.prediction}
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-1 text-xs text-brand-slate">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {latestResult.latencyMs} ms
                    </span>
                    <span>•</span>
                    <span className="font-mono">{latestResult.modelVersion}</span>
                  </div>
                </div>

                {/* Probabilities Breakdown */}
                {latestResult.probabilities && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-midnight">
                        Softmax Class Probabilities
                      </span>
                      <span className="text-[10px] text-brand-slate">
                        Relative confidence distribution
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {Object.entries(latestResult.probabilities).map(([className, prob]) => {
                        const percent = Math.round(prob * 100);
                        const isWinner = className === latestResult.prediction;

                        return (
                          <div key={className} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className={isWinner ? 'text-brand-indigo font-bold' : 'text-brand-midnight'}>
                                {className}
                              </span>
                              <span className="font-mono text-brand-slate">{percent}%</span>
                            </div>
                            <div className="h-2 w-full bg-brand-ivory rounded-full overflow-hidden border border-brand-border/60">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isWinner ? 'bg-brand-indigo' : 'bg-brand-slate-light/60'
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Plain-Language Note on Confidence */}
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex items-start gap-2 leading-relaxed">
                  <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Note: Softmax confidence indicates the model's certainty given this specific training parameterization, not the ground truth probability.
                  </span>
                </div>

                {/* Raw JSON Inspector */}
                {showJsonInspector && (
                  <div className="p-4 rounded-xl bg-brand-midnight text-white text-xs font-mono space-y-2 overflow-x-auto">
                    <span className="text-[10px] text-brand-slate uppercase block font-sans">
                      Request & Response Payload
                    </span>
                    <pre className="text-emerald-400">
                      {JSON.stringify(
                        {
                          request: {
                            model_id: latestResult.modelId,
                            inputs: latestResult.inputs,
                          },
                          response: {
                            prediction: latestResult.prediction,
                            probabilities: latestResult.probabilities,
                            confidence: latestResult.confidence,
                            latency_ms: latestResult.latencyMs,
                            status: latestResult.status,
                          },
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-brand-slate space-y-2">
                <Terminal size={32} className="mx-auto text-brand-slate/40 mb-2" />
                <p className="text-sm font-semibold text-brand-midnight">
                  Ready for Inference
                </p>
                <p className="text-xs">
                  Adjust values on the left or click a preset, then run prediction to view results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Predictions History Table */}
      <div className="card-subtle p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-display font-extrabold text-brand-midnight">
              Recent Prediction Activity
            </h3>
            <p className="text-xs text-brand-slate">
              Logged test inferences from the current session
            </p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 bg-brand-ivory border border-brand-border rounded text-brand-slate">
            {predictions.length} Logged Inferences
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-ivory uppercase font-mono text-[11px] text-brand-slate border-b border-brand-border">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Input Summary</th>
                <th className="px-4 py-3">Predicted Class</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Inference Latency</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {predictions.slice(0, 8).map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedHistoryItem(p)}
                  className="hover:bg-brand-ivory/50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 font-mono text-brand-slate">{p.timestamp}</td>
                  <td className="px-4 py-3 font-mono text-brand-midnight">
                    SL: {p.inputs.sepal_length || '—'}, SW: {p.inputs.sepal_width || '—'}, PL:{' '}
                    {p.inputs.petal_length || '—'}, PW: {p.inputs.petal_width || '—'}
                  </td>
                  <td className="px-4 py-3 font-bold text-brand-indigo">{p.prediction}</td>
                  <td className="px-4 py-3 font-mono">
                    {p.confidence ? `${Math.round(p.confidence * 100)}%` : '—'}
                  </td>
                  <td className="px-4 py-3 font-mono">{p.latencyMs} ms</td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <Check size={11} />
                      <span>{p.status.toUpperCase()}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
