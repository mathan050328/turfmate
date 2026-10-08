"""
Configuration module for Federated Learning Disease Prediction System.
Defines reproducibility seeds, hyperparameter defaults, and directory paths.
"""

from pathlib import Path

# Base Paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent

DATA_DIR = PROJECT_ROOT / "data"
RAW_DATA_PATH = DATA_DIR / "raw" / "heart.csv"
PROCESSED_DATA_DIR = DATA_DIR / "processed"
CLIENTS_DIR = DATA_DIR / "clients"

ARTIFACTS_DIR = PROJECT_ROOT / "artifacts"
MODELS_DIR = ARTIFACTS_DIR / "models"
METRICS_DIR = ARTIFACTS_DIR / "metrics"
FIGURES_DIR = ARTIFACTS_DIR / "figures"

# Ensure all critical directories exist
for path in [
    DATA_DIR / "raw",
    PROCESSED_DATA_DIR,
    CLIENTS_DIR / "client_1",
    CLIENTS_DIR / "client_2",
    CLIENTS_DIR / "client_3",
    MODELS_DIR,
    METRICS_DIR,
    FIGURES_DIR,
]:
    path.mkdir(parents=True, exist_ok=True)

# Experiment Parameters
SEED = 42
NUM_CLIENTS = 3
TEST_SIZE = 0.20

# Federated Learning Hyperparameters
NUM_ROUNDS = 5
LOCAL_EPOCHS = 3
BATCH_SIZE = 16
LEARNING_RATE = 0.05
MAX_ITER = 2000

# Model Hyperparameters
SOLVER = "saga"
PENALTY = "l2"
C_PARAM = 1.0

# Server Network Configuration
SERVER_ADDRESS = "127.0.0.1:8085"

# Dataset schema mapping
TARGET_COLUMN = "target"
NUMERIC_FEATURES = [
    "age",
    "trestbps",
    "chol",
    "thalach",
    "oldpeak",
]
CATEGORICAL_FEATURES = [
    "sex",
    "cp",
    "fbs",
    "restecg",
    "exang",
    "slope",
    "ca",
    "thal",
]
