"""
Train a real Random Forest classifier on Fisher's Iris dataset using scikit-learn.
Saves:
  - Trained model artifact: backend/models/iris_rf.joblib
  - Reference baseline dataset: backend/data/iris_reference.json
"""
import os
import json
import joblib
import numpy as np
from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

os.makedirs("backend/models", exist_ok=True)
os.makedirs("backend/data", exist_ok=True)

# 1. Load Iris data
iris = load_iris()
feature_names = ["sepal_length", "sepal_width", "petal_length", "petal_width"]
X = iris.data
y = iris.target
target_names = list(iris.target_names)  # ['setosa', 'versicolor', 'virginica']
target_names_formatted = [f"Iris-{name}" for name in target_names]

# 2. Train Random Forest Classifier
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

clf = RandomForestClassifier(n_estimators=100, max_depth=4, random_state=42)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"Random Forest model trained. Test Accuracy: {acc * 100:.2f}%")

# 3. Save artifact with metadata
model_bundle = {
    "model": clf,
    "feature_names": feature_names,
    "target_names": target_names_formatted,
    "model_version": "v1.4.2",
    "framework": "scikit-learn 1.7.2",
    "test_accuracy": float(acc),
}

joblib.dump(model_bundle, "backend/models/iris_rf.joblib")
print("Saved model artifact to backend/models/iris_rf.joblib")

# 4. Save Reference Baseline Dataset (150 botanical measurements)
reference_records = []
for i in range(len(X)):
    record = {
        "sepal_length": float(X[i][0]),
        "sepal_width": float(X[i][1]),
        "petal_length": float(X[i][2]),
        "petal_width": float(X[i][3]),
        "species": target_names_formatted[y[i]],
    }
    reference_records.append(record)

with open("backend/data/iris_reference.json", "w", encoding="utf-8") as f:
    json.dump(reference_records, f, indent=2)

print(f"Saved reference baseline dataset ({len(reference_records)} records) to backend/data/iris_reference.json")
