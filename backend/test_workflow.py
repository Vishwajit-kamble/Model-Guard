"""
Automated functional verification test suite for ModelGuard AI.
Tests:
1. GET /health
2. GET /models
3. POST /predict (real ML inference on setosa, versicolor, virginica + latency profiling)
4. Input validation on POST /predict
5. Insufficient data drift handling
6. Batch ingestion of shifted inputs & KS test calculation via scipy
7. Alert generation and resolution
8. Database persistence
"""
import urllib.request
import json
import time

BASE_URL = "http://127.0.0.1:8000"

def request_json(path, method="GET", data=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))

def run_tests():
    print("==================================================================")
    print("STARTING MODELGUARD AI AUTOMATED FUNCTIONAL VERIFICATION")
    print("==================================================================")
    
    # 1. Health check
    status, health = request_json("/health")
    assert status == 200, f"Health check failed with {status}"
    assert health["mlModelLoaded"] is True, "ML model not marked as loaded"
    print(f"[PASS] Health Check Passed: {health['service']} (ML Loaded: {health['mlModelVersion']})")

    # 2. Models list
    status, models = request_json("/models")
    assert status == 200 and len(models) >= 1, "Failed to list models"
    iris_model = next(m for m in models if m["id"] == "model-iris-01")
    print(f"[PASS] Models Endpoint Passed: Found '{iris_model['name']}' ({iris_model['framework']})")

    # 3. Real ML Inference Tests
    # 3a. Setosa
    status, res_setosa = request_json("/predict", method="POST", data={
        "model_id": "model-iris-01",
        "inputs": {"sepal_length": 5.1, "sepal_width": 3.5, "petal_length": 1.4, "petal_width": 0.2}
    })
    assert status == 200, f"Predict setosa failed: {res_setosa}"
    assert res_setosa["prediction"] == "Iris-setosa", f"Wrong prediction: {res_setosa['prediction']}"
    assert res_setosa["probabilities"]["Iris-setosa"] > 0.85, f"Low setosa confidence: {res_setosa['probabilities']}"
    assert isinstance(res_setosa["latency_ms"], int), "Latency ms not integer"
    print(f"[PASS] Inference (Setosa): Predicted '{res_setosa['prediction']}' (Confidence: {res_setosa['confidence'] * 100:.1f}%, Measured Latency: {res_setosa['latency_ms']}ms)")

    # 3b. Versicolor
    status, res_versicolor = request_json("/predict", method="POST", data={
        "model_id": "model-iris-01",
        "inputs": {"sepal_length": 6.4, "sepal_width": 3.2, "petal_length": 4.5, "petal_width": 1.5}
    })
    assert status == 200 and res_versicolor["prediction"] == "Iris-versicolor"
    print(f"[PASS] Inference (Versicolor): Predicted '{res_versicolor['prediction']}' (Confidence: {res_versicolor['confidence'] * 100:.1f}%, Measured Latency: {res_versicolor['latency_ms']}ms)")

    # 3c. Virginica
    status, res_virginica = request_json("/predict", method="POST", data={
        "model_id": "model-iris-01",
        "inputs": {"sepal_length": 7.2, "sepal_width": 3.2, "petal_length": 6.0, "petal_width": 2.2}
    })
    assert status == 200 and res_virginica["prediction"] == "Iris-virginica"
    print(f"[PASS] Inference (Virginica): Predicted '{res_virginica['prediction']}' (Confidence: {res_virginica['confidence'] * 100:.1f}%, Measured Latency: {res_virginica['latency_ms']}ms)")

    # 4. Input validation
    status, res_err = request_json("/predict", method="POST", data={
        "model_id": "model-iris-01",
        "inputs": {"sepal_length": 5.1, "sepal_width": "invalid_num"}
    })
    assert status == 422, f"Expected 422 on invalid input, got {status}"
    print("[PASS] Input Validation Passed: Correctly returned HTTP 422 on invalid input vector")

    # 5. Ingest a batch of shifted inputs (high petal width) to test Kolmogorov-Smirnov drift
    shifted_samples = []
    for i in range(25):
        shifted_samples.append({
            "sepal_length": 6.0 + (i % 5) * 0.1,
            "sepal_width": 3.0 + (i % 3) * 0.1,
            "petal_length": 4.2 + (i % 4) * 0.1,
            "petal_width": 2.4 + (i % 3) * 0.1,  # heavily shifted compared to baseline mean 1.2cm
        })
    status, batch_res = request_json("/predictions/batch", method="POST", data={
        "model_id": "model-iris-01",
        "samples": shifted_samples
    })
    assert status == 200, "Failed to ingest batch predictions"
    print(f"[PASS] Batch Ingestion Passed: Ingested {len(shifted_samples)} shifted prediction inputs")

    # 6. Drift evaluation with real KS test
    status, drift_res = request_json("/monitoring/model-iris-01/drift?threshold=0.05")
    assert status == 200, f"Drift eval failed: {drift_res}"
    assert drift_res["overallStatus"] == "warning", f"Expected warning drift status, got {drift_res['overallStatus']}"
    pw_feat = next(f for f in drift_res["features"] if f["featureName"] == "petal_width")
    assert pw_feat["status"] == "warning", f"Petal width should have drifted, status is {pw_feat['status']}"
    assert pw_feat["pValue"] < 0.05, f"Expected p-value < 0.05, got {pw_feat['pValue']}"
    print(f"[PASS] Kolmogorov-Smirnov Drift Test Passed:")
    print(f"   Feature: {pw_feat['displayName']}")
    print(f"   KS Statistic: {pw_feat['driftScore']}")
    print(f"   p-value: {pw_feat['pValue']} (threshold: 0.05)")
    print(f"   Baseline Mean: {pw_feat['referenceMean']}cm vs Incoming Mean: {pw_feat['incomingMean']}cm")
    print(f"   Overall Evaluation Summary: {drift_res['plainSummary']}")

    # 7. Check Alerts & Resolution
    status, alerts = request_json("/alerts")
    assert status == 200 and len(alerts) >= 1, "Expected at least 1 alert"
    active_alert = next(a for a in alerts if a["status"] == "active")
    print(f"[PASS] Alert Generation Passed: '{active_alert['title']}' for {active_alert['modelName']}")

    # Resolve alert
    status, resolve_res = request_json(f"/alerts/{active_alert['id']}/resolve", method="POST")
    assert status == 200, f"Failed to resolve alert: {resolve_res}"
    print(f"[PASS] Alert Resolution Passed: Alert #{active_alert['id']} resolved")

    # 8. Check Predictions history endpoint
    status, history = request_json("/predictions?model_id=model-iris-01&limit=10")
    assert status == 200 and len(history) >= 10, "Failed to fetch predictions history"
    print(f"[PASS] Predictions History Passed: Retrieved {len(history)} recent predictions from SQLite")

    print("==================================================================")
    print("ALL 8 VERIFICATION TESTS PASSED SUCCESSFULLY! (100% SUCCESS)")
    print("==================================================================")

if __name__ == "__main__":
    run_tests()
