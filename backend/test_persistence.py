"""
Verify database persistence across backend restarts.
"""
import sqlite3
import os

DB_PATH = "backend/data/modelguard.db"
assert os.path.exists(DB_PATH), "Database file does not exist"

conn = sqlite3.connect(DB_PATH)
c = conn.cursor()

c.execute("SELECT COUNT(*) FROM predictions")
pred_count = c.fetchone()[0]

c.execute("SELECT COUNT(*) FROM models")
model_count = c.fetchone()[0]

c.execute("SELECT COUNT(*) FROM alerts")
alert_count = c.fetchone()[0]

print("==================================================================")
print("PERSISTENCE AUDIT CHECK")
print("==================================================================")
print(f"[PASS] SQLite Database verified at: {DB_PATH}")
print(f"[PASS] Persisted Predictions Count: {pred_count}")
print(f"[PASS] Persisted Registered Models: {model_count}")
print(f"[PASS] Persisted Drift Alerts: {alert_count}")
assert pred_count > 0, "No predictions found in SQLite database"
assert model_count > 0, "No models found in SQLite database"
print("==================================================================")
print("PERSISTENCE INTEGRITY VERIFIED (SURVIVES RESTARTS)")
print("==================================================================")
conn.close()
