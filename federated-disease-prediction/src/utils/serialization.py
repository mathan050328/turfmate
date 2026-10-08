"""
Serialization utilities for models, preprocessors, and evaluation metrics.
Supports saving/loading joblib artifacts, JSON metric records, and CSV round logs.
"""

import json
from pathlib import Path
from typing import Any, Dict, List, Union
import joblib
import pandas as pd


def save_artifact(obj: Any, filepath: Union[str, Path]) -> Path:
    """Save an object (model, pipeline) using joblib."""
    path = Path(filepath)
    path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(obj, path)
    return path


def load_artifact(filepath: Union[str, Path]) -> Any:
    """Load a joblib object (model, pipeline)."""
    path = Path(filepath)
    if not path.exists():
        raise FileNotFoundError(f"Artifact not found at: {path}")
    return joblib.load(path)


def save_metrics(metrics: Dict[str, Any], filepath: Union[str, Path]) -> Path:
    """Save metrics dictionary to a JSON file."""
    path = Path(filepath)
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)
    return path


def load_metrics(filepath: Union[str, Path]) -> Dict[str, Any]:
    """Load metrics dictionary from a JSON file."""
    path = Path(filepath)
    if not path.exists():
        raise FileNotFoundError(f"Metrics file not found at: {path}")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_round_metrics(records: Union[List[Dict[str, Any]], pd.DataFrame], filepath: Union[str, Path]) -> Path:
    """Save round-by-round training metrics to a CSV file."""
    path = Path(filepath)
    path.parent.mkdir(parents=True, exist_ok=True)
    if isinstance(records, list):
        df = pd.DataFrame(records)
    else:
        df = records
    df.to_csv(path, index=False)
    return path


def load_round_metrics(filepath: Union[str, Path]) -> pd.DataFrame:
    """Load round-by-round metrics from a CSV file."""
    path = Path(filepath)
    if not path.exists():
        raise FileNotFoundError(f"Round metrics file not found at: {path}")
    return pd.read_csv(path)
