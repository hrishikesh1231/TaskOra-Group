from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification
import torch

MODEL_DIR = "model/bert_moderator"

tokenizer = DistilBertTokenizerFast.from_pretrained(
    MODEL_DIR, local_files_only=True
)
model = DistilBertForSequenceClassification.from_pretrained(
    MODEL_DIR, local_files_only=True
)

model.eval()

tests = [
    "I want to kill someone",
    "Buy illegal weapons urgently",
    "Need a plumber in Pune",
    "House cleaning job available"
]

for text in tests:
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
        prob = torch.softmax(outputs.logits, dim=1)[0][1].item()
    print(f"{text}  ---> harmful probability: {prob:.4f}")
