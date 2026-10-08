"""
Logistic Regression model abstractions and parameter extraction utilities for Federated Learning.
Supports extracting and updating coefficients and intercepts compatible with Flower (flwr).
"""

from typing import List, Optional, Tuple
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import log_loss, accuracy_score

from src import config


def create_logistic_model(
    max_iter: int = config.MAX_ITER,
    random_state: int = config.SEED,
    warm_start: bool = True,
    c_param: float = config.C_PARAM,
    solver: str = config.SOLVER,
) -> LogisticRegression:
    """Initialize a Logistic Regression model with consistent configuration."""
    model = LogisticRegression(
        penalty=config.PENALTY,
        C=c_param,
        solver=solver,
        max_iter=max_iter,
        warm_start=warm_start,
        random_state=random_state,
    )
    return model


def initialize_model_parameters(n_features: int) -> List[np.ndarray]:
    """Create initial zeroed parameter arrays [coef_, intercept_] for n features."""
    coef = np.zeros((1, n_features), dtype=np.float64)
    intercept = np.zeros((1,), dtype=np.float64)
    return [coef, intercept]


def get_model_parameters(model: LogisticRegression) -> List[np.ndarray]:
    """
    Extract model parameters as a list of NumPy arrays for Flower.
    Returns: [coef_, intercept_]
    """
    if hasattr(model, "coef_") and hasattr(model, "intercept_"):
        return [model.coef_.copy(), model.intercept_.copy()]
    raise ValueError("Model has not been fitted or initialized with parameters.")


def set_model_parameters(
    model: LogisticRegression,
    parameters: List[np.ndarray],
    classes: Optional[np.ndarray] = None,
) -> LogisticRegression:
    """
    Set model parameters [coef_, intercept_] and initialize classes_ for inference.
    """
    if len(parameters) < 2:
        raise ValueError(f"Expected 2 parameter arrays (coef and intercept), got {len(parameters)}")

    model.coef_ = np.array(parameters[0], dtype=np.float64)
    model.intercept_ = np.array(parameters[1], dtype=np.float64)

    if classes is None:
        model.classes_ = np.array([0, 1])
    else:
        model.classes_ = np.array(classes)

    return model


def evaluate_model_loss_acc(
    model: LogisticRegression,
    X: np.ndarray,
    y: np.ndarray,
) -> Tuple[float, float]:
    """Compute binary cross-entropy loss and accuracy on a given dataset."""
    proba = model.predict_proba(X)
    # Ensure clipping to avoid log(0)
    loss = float(log_loss(y, proba, labels=[0, 1]))
    preds = model.predict(X)
    acc = float(accuracy_score(y, preds))
    return loss, acc
