"""
Partition training dataset among simulated hospital clients.
Ensures simulated data silos: each client only possesses its local training partition.
"""

from pathlib import Path
from typing import List, Tuple
import numpy as np
import pandas as pd

from src import config
from src.data.preprocess import run_preprocessing


def partition_data_for_clients(
    num_clients: int = config.NUM_CLIENTS,
    seed: int = config.SEED,
) -> List[Tuple[Path, int]]:
    """
    Partition the training data across simulated hospital clients.
    Saves:
      - Raw-scale CSV (data.csv) in each client's isolated folder.
      - Transformed features (X.npy, y.npy) in each client's folder.
    Returns list of (client_dir, sample_count).
    """
    train_csv_path = config.PROCESSED_DATA_DIR / "train.csv"
    X_train_path = config.PROCESSED_DATA_DIR / "X_train.npy"
    y_train_path = config.PROCESSED_DATA_DIR / "y_train.npy"

    if not (train_csv_path.exists() and X_train_path.exists() and y_train_path.exists()):
        run_preprocessing()

    train_df = pd.read_csv(train_csv_path)
    X_train = np.load(X_train_path)
    y_train = np.load(y_train_path)

    n_samples = len(y_train)
    indices = np.arange(n_samples)

    # Stratified split to ensure every client has both classes
    rng = np.random.RandomState(seed)
    class_0_idx = indices[y_train == 0]
    class_1_idx = indices[y_train == 1]

    rng.shuffle(class_0_idx)
    rng.shuffle(class_1_idx)

    # Split indices into num_clients chunks
    splits_0 = np.array_split(class_0_idx, num_clients)
    splits_1 = np.array_split(class_1_idx, num_clients)

    client_info = []

    for i in range(num_clients):
        client_id = f"client_{i + 1}"
        client_dir = config.CLIENTS_DIR / client_id
        client_dir.mkdir(parents=True, exist_ok=True)

        # Combine class 0 and class 1 for this client
        client_idx = np.concatenate([splits_0[i], splits_1[i]])
        rng.shuffle(client_idx)

        client_df = train_df.iloc[client_idx].copy()
        client_X = X_train[client_idx]
        client_y = y_train[client_idx]

        # Save local client files
        client_df.to_csv(client_dir / "data.csv", index=False)
        np.save(client_dir / "X.npy", client_X)
        np.save(client_dir / "y.npy", client_y)

        count = len(client_y)
        pos_count = int(np.sum(client_y == 1))
        client_info.append((client_dir, count))

        print(
            f"  {client_id}: {count} samples (Positive: {pos_count}, Negative: {count - pos_count}) -> {client_dir}"
        )

    return client_info


if __name__ == "__main__":
    print(f"Partitioning training data across {config.NUM_CLIENTS} simulated hospital clients...")
    partition_data_for_clients()
