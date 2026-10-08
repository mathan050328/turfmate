"""
Data preprocessing pipeline.
Handles schema validation, deterministic imputation, feature scaling, one-hot encoding,
train/test split with leakage prevention, and preprocessor persistence.
"""

import json
from pathlib import Path
from typing import Dict, List, Tuple
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from src import config
from src.data.download import download_dataset, validate_raw_dataset
from src.utils.serialization import save_artifact


def create_preprocessor(
    numeric_features: List[str] = config.NUMERIC_FEATURES,
    categorical_features: List[str] = config.CATEGORICAL_FEATURES,
) -> ColumnTransformer:
    """Create a ColumnTransformer pipeline for deterministic preprocessing."""
    numeric_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )

    categorical_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, numeric_features),
            ("cat", categorical_transformer, categorical_features),
        ],
        remainder="drop",
    )
    return preprocessor


def run_preprocessing(
    raw_path: Path = config.RAW_DATA_PATH,
    output_dir: Path = config.PROCESSED_DATA_DIR,
    model_dir: Path = config.MODELS_DIR,
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, ColumnTransformer]:
    """
    Execute full preprocessing pipeline:
    1. Load and validate raw dataset
    2. Split features and target
    3. Stratified train/test split
    4. Fit preprocessor ONLY on training set (prevent data leakage)
    5. Transform train and test sets
    6. Persist transformed arrays and preprocessor artifact
    """
    if not raw_path.exists():
        download_dataset(raw_path)

    df = pd.read_csv(raw_path)
    df = validate_raw_dataset(df)

    X = df.drop(columns=[config.TARGET_COLUMN])
    y = df[config.TARGET_COLUMN].values

    # Stratified train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=config.TEST_SIZE,
        random_state=config.SEED,
        stratify=y,
    )

    preprocessor = create_preprocessor()

    # Fit preprocessor on X_train ONLY
    X_train_proc = preprocessor.fit_transform(X_train)
    X_test_proc = preprocessor.transform(X_test)

    # Save transformed arrays
    output_dir.mkdir(parents=True, exist_ok=True)
    np.save(output_dir / "X_train.npy", X_train_proc)
    np.save(output_dir / "y_train.npy", y_train)
    np.save(output_dir / "X_test.npy", X_test_proc)
    np.save(output_dir / "y_test.npy", y_test)

    # Also save tabular train/test CSVs with raw-scale features for readability & client partitioning
    train_df = X_train.copy()
    train_df[config.TARGET_COLUMN] = y_train
    train_df.to_csv(output_dir / "train.csv", index=False)

    test_df = X_test.copy()
    test_df[config.TARGET_COLUMN] = y_test
    test_df.to_csv(output_dir / "test.csv", index=False)

    # Save feature names after transformation
    feature_names = []
    if hasattr(preprocessor, "get_feature_names_out"):
        feature_names = list(preprocessor.get_feature_names_out())
    with open(output_dir / "feature_names.json", "w", encoding="utf-8") as f:
        json.dump(feature_names, f, indent=2)

    # Save preprocessor artifact
    preprocessor_path = model_dir / "preprocessor.joblib"
    save_artifact(preprocessor, preprocessor_path)

    print(f"Preprocessing completed:")
    print(f"  Training samples: {X_train_proc.shape[0]} (features: {X_train_proc.shape[1]})")
    print(f"  Test samples:     {X_test_proc.shape[0]}")
    print(f"  Preprocessor saved to: {preprocessor_path}")

    return X_train_proc, y_train, X_test_proc, y_test, preprocessor


if __name__ == "__main__":
    run_preprocessing()
