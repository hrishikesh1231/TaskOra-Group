import os
import re
import datetime
import torch
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification

# ================= CONFIG =================

# 🔥 FIX: Convert Windows backslashes to forward slashes
MODEL_DIR = os.path.abspath("model/bert_moderator").replace("\\", "/")

BLOCK_THRESHOLD = 0.60
REVIEW_THRESHOLD = 0.35

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ================= LOAD MODEL =================

if not os.path.exists(MODEL_DIR):
    raise RuntimeError(f"Model folder not found at {MODEL_DIR}")

tokenizer = DistilBertTokenizerFast.from_pretrained(
    MODEL_DIR,
    local_files_only=True
)

model = DistilBertForSequenceClassification.from_pretrained(
    MODEL_DIR,
    local_files_only=True
)

model.to(device)
model.eval()

# ================= APP =================

app = FastAPI(title="Taskora AI Moderation API")

# ================= SCHEMAS =================

class GigData(BaseModel):
    title: str
    description: str
    location: str
    category: str
    date: datetime.date
    contact: str


class ServiceData(BaseModel):
    title: str
    description: str
    salary: str
    location: str
    date: datetime.date
    contact: str


class TextPayload(BaseModel):
    text: str

# ================= BENIGN WHITELIST =================

BENIGN_PHRASES = [
    "kill time",
    "kill boredom",
    "killing time",
    "killer performance",
    "killer deal",
    "killer design",
    "toy gun",
    "water gun",
    "photo shoot",
    "shoot me a message",
    "gun salute",
    "gun museum",
    "bombed at the box office",
    "the bomb",
    "party was the bomb",
    "shooting stars",
    "attack the problem",
    "cute attack",
    "laughter attack"
]

def is_benign_context(text: str) -> bool:
    text = text.lower()
    return any(p in text for p in BENIGN_PHRASES)

# ================= HARD BLOCK RULES =================

VIOLENCE_PATTERNS = [
    r"kill\s+(someone|him|her|them|people)",
    r"i\s*want\s*to\s*kill",
    r"going\s*to\s*kill",
    r"plan\s*to\s*kill",
    r"murder",
    r"shoot\s+(someone|him|her|them)",
    r"stab\s+(someone|him|her|them)"
]

WEAPON_PATTERNS = [
    r"(buy|sell|need|purchase).*(gun|pistol|rifle|weapon)",
    r"(illegal\s*gun|country\s*made\s*gun)",
    r"(buy\s*ak47|buy\s*pistol)"
]

SEXUAL_PATTERNS = [
    r"(escort|call\s*girl|paid\s*girl|sex\s*service)",
    r"(i\s*want\s*girl\s*for\s*sex)",
    r"(prostitution|porn|xxx)"
]

THEFT_PATTERNS = [
    r"(steal|rob|loot|scam)",
    r"(credit\s*card\s*details|bank\s*otp)",
    r"(fake\s*id|counterfeit\s*money)"
]

def matches_any(patterns, text):
    return any(re.search(p, text) for p in patterns)

# ================= HELPERS =================

def normalize(text: str) -> str:
    text = text.lower()
    text = re.sub(r'https?://\S+|www\.\S+|\S+@\S+', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def deobfuscate(text: str) -> str:
    return re.sub(r'[\W_]+', '', text.lower())

def bert_probability(text: str) -> float:
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    ).to(device)

    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.softmax(outputs.logits, dim=1)

    return probs[0][1].item()

# ================= CORE MODERATION =================

def moderate_text(text: str):
    text = normalize(text)
    clean = deobfuscate(text)

    # Whitelist
    if is_benign_context(text):
        return True, "Safe idiomatic usage ✅"

    # Hard block rules
    if (
        matches_any(VIOLENCE_PATTERNS, text) or
        matches_any(WEAPON_PATTERNS, text) or
        matches_any(SEXUAL_PATTERNS, text) or
        matches_any(THEFT_PATTERNS, text) or
        matches_any(VIOLENCE_PATTERNS, clean)
    ):
        return False, "Harmful content is not allowed 🚫"

    # BERT probability
    prob = bert_probability(text)
    print(f"[BERT] probability = {prob:.4f}")

    if prob >= BLOCK_THRESHOLD:
        return False, "Violence or threat detected 🚫"

    if prob >= REVIEW_THRESHOLD:
        return False, "Content requires manual review ⚠️"

    return True, "Content is safe ✅"

# ================= ENDPOINTS =================

@app.post("/analyze")
def analyze(payload: GigData):
    combined = f"{payload.title} {payload.description}"
    ok, msg = moderate_text(combined)

    if not ok:
        return JSONResponse(
            status_code=400,
            content={"status": "error", "message": msg}
        )

    return {"status": "ok", "message": msg}


@app.post("/analyze_service")
def analyze_service(payload: ServiceData):
    combined = f"{payload.title} {payload.description}"
    ok, msg = moderate_text(combined)

    if not ok:
        return JSONResponse(
            status_code=400,
            content={"status": "error", "message": msg}
        )

    return {"status": "ok", "message": msg}


@app.post("/predict_text")
def predict(payload: TextPayload):
    ok, msg = moderate_text(payload.text)

    if not ok:
        return JSONResponse(
            status_code=400,
            content={"status": "error", "message": msg}
        )

    return {"status": "ok", "message": msg}


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": True}