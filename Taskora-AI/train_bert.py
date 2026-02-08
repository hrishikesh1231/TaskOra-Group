import os
import pandas as pd
import numpy as np
from datasets import Dataset
from transformers import (
    DistilBertTokenizerFast,
    DistilBertForSequenceClassification,
    Trainer,
    TrainingArguments
)
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_recall_fscore_support

# ================= CONFIG =================
CSV_PATH = "data/dataset.csv"
MODEL_DIR = "model/bert_moderator"

# ================= LOAD & CLEAN DATA =================
df = pd.read_csv(CSV_PATH)

df = df[['text', 'label']]

df['text'] = df['text'].astype(str).str.strip()

df['label'] = (
    df['label']
    .astype(str)
    .str.strip()
    .str.lower()
    .replace({
        'safe': '0',
        'harmful': '1',
        'yes': '1',
        'no': '0',
        'true': '1',
        'false': '0'
    })
)

df['label'] = pd.to_numeric(df['label'], errors='coerce')
df = df.dropna(subset=['label'])
df['label'] = df['label'].astype(int)
df = df[df['label'].isin([0, 1])]

print("✅ Label distribution:")
print(df['label'].value_counts())

# ================= SPLIT =================
train_df, val_df = train_test_split(
    df,
    test_size=0.15,
    stratify=df['label'],
    random_state=42
)

train_ds = Dataset.from_pandas(train_df.reset_index(drop=True))
val_ds = Dataset.from_pandas(val_df.reset_index(drop=True))

# ================= TOKENIZER =================
tokenizer = DistilBertTokenizerFast.from_pretrained(
    "distilbert-base-uncased"
)

def tokenize(batch):
    return tokenizer(
        batch["text"],
        padding="max_length",
        truncation=True,
        max_length=128
    )

train_ds = train_ds.map(tokenize, batched=True)
val_ds = val_ds.map(tokenize, batched=True)

train_ds = train_ds.remove_columns(["text"])
val_ds = val_ds.remove_columns(["text"])

train_ds.set_format("torch")
val_ds.set_format("torch")

# ================= MODEL =================
model = DistilBertForSequenceClassification.from_pretrained(
    "distilbert-base-uncased",
    num_labels=2
)

# ================= METRICS =================
def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = np.argmax(logits, axis=1)
    p, r, f, _ = precision_recall_fscore_support(labels, preds, average="binary")
    acc = accuracy_score(labels, preds)
    return {
        "accuracy": acc,
        "precision": p,
        "recall": r,
        "f1": f
    }

# ================= TRAINING ARGS (v5 SAFE) =================
args = TrainingArguments(
    output_dir=MODEL_DIR,
    eval_strategy="epoch",
    save_strategy="epoch",
    num_train_epochs=4,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    learning_rate=2e-5,
    load_best_model_at_end=True,
    metric_for_best_model="f1",
    logging_steps=50,
    report_to=[]
)

# ================= TRAINER =================
trainer = Trainer(
    model=model,
    args=args,
    train_dataset=train_ds,
    eval_dataset=val_ds,
    compute_metrics=compute_metrics
)

# ================= TRAIN =================
trainer.train()

# ================= SAVE =================
os.makedirs(MODEL_DIR, exist_ok=True)
model.save_pretrained(MODEL_DIR)
tokenizer.save_pretrained(MODEL_DIR)

print("✅ DistilBERT model successfully saved to:", MODEL_DIR)
