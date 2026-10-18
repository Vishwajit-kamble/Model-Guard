# ModelGuard AI — The Living Intelligence Observatory 🔭

> **"Your models deserve a second pair of eyes."**  
> *Continuous machine learning observability, data drift detection, and incident intelligence in plain English.*

---

## 🌟 Overview

**ModelGuard AI** is a production-grade machine learning model monitoring platform. Unlike generic corporate analytics templates, ModelGuard AI is architected around **The Living Intelligence Observatory** metaphor—a calm, scientific command center that continuously tracks model health, measures real-time inference latency, detects statistical distribution shifts, and explains reliability findings without requiring an advanced degree in statistics.

### Key Questions Answered in Seconds
1. **Is my model working?** → Real-time visual status, orbital pulse, and operational state.
2. **How many predictions has it made?** → Session throughput, latency profiling, and error rates.
3. **Is anything unusual happening?** → Automated Kolmogorov-Smirnov (KS) data drift detection.
4. **What does the warning mean?** → Plain-language explanations of distribution divergence.
5. **What should I do next?** → Actionable diagnostic recommendations.

---

## 🎨 Visual Identity & Design System

- **Background:** Warm ivory (`#F7F7F2`)
- **Main Surface:** Pure white (`#FFFFFF`) with natural elevation
- **Primary Text:** Deep midnight (`#17212B`)
- **Secondary Text:** Slate gray (`#64748B`)
- **Primary Accent:** Electric indigo (`#635BFF`)
- **Secondary Accent:** Fresh mint (`#79E2B5`)
- **Alert Tones:** Warm amber (`#F4B942`) & Coral red (`#F16C68`)
- **Typography:** `Manrope` (Display headings), `Inter` (UI elements), `JetBrains Mono` (Telemetry & Code)

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** v18+ (tested on v22.19)
- **npm** v9+

### 2. Frontend Launch
```bash
# Install dependencies (already installed)
npm install

# Start development server
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 3. Optional: FastAPI Backend Launch
ModelGuard AI includes an optional standalone **FastAPI** backend supporting live prediction serving and drift evaluation:

```bash
# Install backend dependencies
pip install -r backend/requirements.txt

# Start FastAPI server on port 8000
python backend/main.py
# or
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
You can toggle between **Demo Mode** and **Live API** at any time using the mode pill in the top header or via the Settings page.

---

## 🧩 Architectural Pages

| Page | Route | Description |
| :--- | :--- | :--- |
| **Command Center** | `/` | Signature **Model Observatory** visualization, primary throughput metrics, independent health trend charts (volume, latency, errors, drift), and activity timeline. |
| **Model Library** | `/models` | Card grid and table views, search, type and status filters, and empty state handling. |
| **Model Details** | `/models/:id` | 4-tab inspection workspace: Overview & Schema, Prediction Activity, Reliability, and Version Lineage. |
| **Predictions Explorer** | `/predictions` | Interactive inference runner with sliders, presets (Setosa, Versicolor, Virginica, Drift), softmax confidence bars, and JSON inspector. |
| **Monitoring & Drift** | `/monitoring` | Signature data drift observatory: 4-step statistical surveillance flow, KS test score cards, and distribution comparison histogram. |
| **Incident Alerts** | `/alerts` | 5-pillar diagnostic investigation workspace with severity filters and resolution workflow. |
| **Register Model** | `/models/register` | 5-step guided onboarding wizard: Metadata, Artifact dropzone, Input schema, Reference baseline, and Review with confetti launch. |
| **Settings** | `/settings` | FastAPI endpoint configuration, connectivity test ping, Demo mode toggle, and statistical significance (α) defaults. |

---

## 🛡️ Security & Integrity
- **Client-Side Hygiene:** No service-role keys or private cloud credentials are ever exposed in client-side code.
- **Scientific Integrity:** Accuracy metrics are never fabricated without verified ground truth labels.
- **Accessible Design:** Full keyboard accessibility, semantic HTML, visible focus states, and reduced-motion preferences honored.

---

© 2026 ModelGuard AI. All rights reserved.
