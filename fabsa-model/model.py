import pandas as pd
from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer
from sklearn.model_selection import train_test_split

df = pd.read_csv('SEntFiN.csv')
sentiment_map = {"negative": 0, "neutral": 1, "positive": 2}
def preprocess_data(row):
    decisions = eval(row['Decisions']) 
    examples = []

    for entity, sentiment in decisions.items():
        # Replace entity mentions with [TGT]
        text = row['Title'].replace(entity, "[TGT]")
        examples.append({
            "text": text,
            "label": sentiment_map[sentiment]
        })

    return examples

processed_data = df.apply(preprocess_data, axis=1).explode().dropna()
train_data = pd.DataFrame(processed_data.tolist())

train_texts, val_texts, train_labels, val_labels = train_test_split(
    train_data["text"], train_data["label"], test_size=0.2, random_state=42
)

MODEL_NAME = "microsoft/deberta-v3-base"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=3)

train_encodings = tokenizer(list(train_texts), truncation=True, padding=True, max_length=256)
val_encodings = tokenizer(list(val_texts), truncation=True, padding=True, max_length=256)

import torch

class SentimentDataset(torch.utils.data.Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item['labels'] = torch.tensor(self.labels[idx])
        return item

train_dataset = SentimentDataset(train_encodings, train_labels.tolist())
val_dataset = SentimentDataset(val_encodings, val_labels.tolist())

training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    save_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=5,
    weight_decay=0.01,
    logging_dir="./logs",
    logging_steps=10,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    tokenizer=tokenizer,
)

trainer.train()

from sklearn.metrics import accuracy_score, precision_recall_fscore_support, classification_report

# Predictions (example)
train_preds = trainer.predict(train_dataset).predictions.argmax(axis=1)
val_preds = trainer.predict(val_dataset).predictions.argmax(axis=1)

# Accuracy
train_accuracy = accuracy_score(train_labels, train_preds)
val_accuracy = accuracy_score(val_labels, val_preds)
print(f"Train Accuracy: {train_accuracy:.4f}")
print(f"Val Accuracy: {val_accuracy:.4f}")

# Precision, Recall, F1-Score
train_precision, train_recall, train_f1, _ = precision_recall_fscore_support(
    train_labels, train_preds, average='weighted'
)
val_precision, val_recall, val_f1, _ = precision_recall_fscore_support(
    val_labels, val_preds, average='weighted'
)
print(f"Train Precision: {train_precision:.4f}")
print(f"Val Precision: {val_precision:.4f}")
print(f"Train Recall: {train_recall:.4f}")
print(f"Val Recall: {val_recall:.4f}")
print(f"Train F1 Score: {train_f1:.4f}")
print(f"Val F1 Score: {val_f1:.4f}")

# Classification Report
print(classification_report(val_labels, val_preds, target_names=["negative", "neutral", "positive"]))