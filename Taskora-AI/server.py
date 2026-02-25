# # # import os
# # # import re
# # # import csv
# # # import joblib
# # # import datetime
# # # from pathlib import Path
# # # from fastapi import FastAPI
# # # from fastapi.responses import JSONResponse
# # # from pydantic import BaseModel
# # # import typing as t

# # # # ----------------- CONFIG -----------------
# # # MODEL_PATH = os.environ.get("HARMFUL_MODEL_PATH", "model/harmful_detector.pkl")
# # # THRESHOLD = float(os.environ.get("HARMFUL_THRESHOLD", 0.45))
# # # GIBBERISH_LOG = Path(os.environ.get("GIBBERISH_LOG", "data/gibberish_log.csv"))
# # # GIBBERISH_LOG.parent.mkdir(parents=True, exist_ok=True)

# # # # ----------------- LOAD MODEL -----------------
# # # try:
# # #     model = joblib.load(MODEL_PATH)
# # #     print("✅ Model loaded from", MODEL_PATH)
# # # except Exception as e:
# # #     model = None
# # #     print("❌ ERROR loading model:", e)

# # # # ----------------- APP -----------------
# # # app = FastAPI(title="Taskora AI Moderation API (with gibberish rules)")

# # # # ----------------- SCHEMAS -----------------
# # # class GigData(BaseModel):
# # #     title: str
# # #     description: str
# # #     location: str
# # #     category: str
# # #     date: datetime.date
# # #     contact: str

# # # class ServiceData(BaseModel):
# # #     title: str
# # #     description: str
# # #     salary: str
# # #     location: str
# # #     contact: str
# # #     date: datetime.date

# # # class TextPayload(BaseModel):
# # #     text: str

# # # # ----------------- NORMALIZATION -----------------
# # # def normalize_text(s: str) -> str:
# # #     if not isinstance(s, str):
# # #         s = str(s)
# # #     t = s.strip().lower()
# # #     t = re.sub(r'https?://\S+|www\.\S+|\S+@\S+', ' ', t)
# # #     t = re.sub(
# # #         r'(?<=\b)([a-z])(?:[^\w\s]+|\s)+([a-z])(?:[^\w\s]+|\s)+([a-z])(?=\b)',
# # #         lambda m: m.group(1) + m.group(2) + m.group(3),
# # #         t
# # #     )
# # #     t = re.sub(r'[\r\n]+', ' ', t)
# # #     t = re.sub(r'\s+', ' ', t)
# # #     t = re.sub(r'([^\w\s]){2,}', r'\1', t)
# # #     t = t.replace('0','o').replace('1','i').replace('4','a').replace('3','e').replace('5','s')
# # #     return t.strip()

# # # # ----------------- GIBBERISH HELPERS -----------------
# # # def vowel_ratio(s: str) -> float:
# # #     s_alpha = ''.join([c for c in s.lower() if c.isalpha()])
# # #     if not s_alpha: return 0.0
# # #     return sum(ch in 'aeiou' for ch in s_alpha) / len(s_alpha)

# # # def non_alpha_ratio(s: str) -> float:
# # #     if not s: return 0.0
# # #     return sum(not c.isalpha() for c in s) / max(1, len(s))

# # # def repetitive_char_ratio(s: str) -> float:
# # #     if not s: return 0.0
# # #     longest = 1
# # #     cur = 1
# # #     for i in range(1, len(s)):
# # #         if s[i] == s[i-1]:
# # #             cur += 1
# # #             longest = max(longest, cur)
# # #         else:
# # #             cur = 1
# # #     return longest / max(1, len(s))

# # # # --- NEW: detect salary/price/number-like values ---
# # # def is_number_like(s: str) -> bool:
# # #     if not s or not isinstance(s, str):
# # #         return False
# # #     s = s.strip()
# # #     patterns = [
# # #         r'^\d{1,9}$',                                 # plain number e.g. 6000
# # #         r'^[\d,]{1,10}\s*(/|per|/month|/mo|month)?$', # 6000, 6,000/month, 6000/mo
# # #         r'^[₹$€]\s?[\d,]+(?:\.\d+)?$',                # currency like ₹6000, $6000.00
# # #         r'^\d{1,6}\s*-\s*\d{1,6}$',                   # range e.g. 6000-8000
# # #         r'^\d{1,6}\s*(per|/)\s*(month|mo|year|yr)$',  # e.g. 6000 per month
# # #     ]
# # #     for p in patterns:
# # #         if re.search(p, s, flags=re.IGNORECASE):
# # #             return True
# # #     return False

# # # # fields exempt from gibberish check
# # # NUMERIC_FIELD_EXCEPTIONS = {"salary", "contact", "amount", "price", "budget"}

# # # def is_maybe_gibberish(s: str, field_name: str = "") -> bool:
# # #     s = (s or "").strip()
# # #     if not s:
# # #         return False

# # #     # ✅ Skip gibberish check for numeric fields like salary/contact
# # #     if field_name and field_name.lower() in NUMERIC_FIELD_EXCEPTIONS:
# # #         return False

# # #     # ✅ Skip gibberish if looks like salary/number/currency
# # #     if is_number_like(s):
# # #         return False

# # #     return (
# # #         (vowel_ratio(s) < 0.22)
# # #         or (non_alpha_ratio(s) > 0.45)
# # #         or (repetitive_char_ratio(s) > 0.4)
# # #         or (len(s) < 3)
# # #     )

# # # def log_gibberish(text: str, field: str = "", extra: dict = None):
# # #     try:
# # #         row = {
# # #             "timestamp": datetime.datetime.utcnow().isoformat(),
# # #             "field": field,
# # #             "text": text,
# # #         }
# # #         if extra:
# # #             row.update(extra)
# # #         file_exists = GIBBERISH_LOG.exists()
# # #         with open(GIBBERISH_LOG, "a", newline="", encoding="utf-8") as fh:
# # #             writer = csv.DictWriter(fh, fieldnames=list(row.keys()))
# # #             if not file_exists:
# # #                 writer.writeheader()
# # #             writer.writerow(row)
# # #     except Exception as e:
# # #         print("Failed to log gibberish:", e)

# # # # ----------------- UTIL -----------------
# # # def is_valid_contact(contact: str) -> bool:
# # #     pattern = r"^\+?\d{7,15}$"
# # #     return re.match(pattern, (contact or "")) is not None

# # # # ----------------- MODERATION LOGIC -----------------
# # # def analyze_fields_with_model(payload: dict, fields_to_check: t.List[str]):
# # #     if model is None:
# # #         return False, "Moderation model not loaded ❌"

# # #     if not is_valid_contact(payload.get("contact", "")):
# # #         return False, "Invalid contact number format ❌"

# # #     for f in fields_to_check:
# # #         val = str(payload.get(f, "")).strip()
# # #         if not val:
# # #             continue

# # #         # gibberish check
# # #         if is_maybe_gibberish(val, field_name=f):
# # #             log_gibberish(val, field=f, extra={"reason": "rule_based_gibberish"})
# # #             return False, f"Gibberish content detected in {f} 🚫"

# # #         # harmful check
# # #         try:
# # #             norm = normalize_text(val)
# # #             if hasattr(model, "predict_proba"):
# # #                 prob = float(model.predict_proba([norm])[0, 1])
# # #             else:
# # #                 prob = 1.0 if int(model.predict([norm])[0]) == 1 else 0.0
# # #             pred = int(prob >= THRESHOLD)
# # #             print(f"[ML] field={f} prob={prob:.3f} pred={pred} text='{val}'")
# # #             if pred == 1:
# # #                 return False, f"Harmful content detected in {f} 🚫"
# # #         except Exception as e:
# # #             return False, f"Model prediction failed on {f}: {str(e)}"

# # #     combined_text = " ".join([str(payload.get(f, "")) for f in fields_to_check]).strip()
# # #     if combined_text:
# # #         if is_maybe_gibberish(combined_text, field_name="combined"):
# # #             log_gibberish(combined_text, field="combined", extra={"reason": "rule_based_gibberish"})
# # #             return False, "Gibberish content detected 🚫"
# # #         try:
# # #             norm = normalize_text(combined_text)
# # #             if hasattr(model, "predict_proba"):
# # #                 prob = float(model.predict_proba([norm])[0, 1])
# # #             else:
# # #                 prob = 1.0 if int(model.predict([norm])[0]) == 1 else 0.0
# # #             pred = int(prob >= THRESHOLD)
# # #             print(f"[ML] combined prob={prob:.3f} pred={pred}")
# # #             if pred == 1:
# # #                 return False, "Harmful content detected 🚫"
# # #         except Exception as e:
# # #             return False, f"Model prediction failed: {str(e)}"

# # #     return True, "Content is safe ✅"

# # # # ----------------- ENDPOINTS -----------------
# # # # @app.post("/analyze")
# # # # def analyze_gig(gig: GigData):
# # # #     # ✅ Removed "category" from ML/gibberish check
# # # #     fields = ["title", "description", "location"]
# # # #     ok, msg = analyze_fields_with_model(gig.dict(), fields)
# # # #     if not ok:
# # # #         return JSONResponse(status_code=400, content={"status": "error", "message": msg})
# # # #     return {"status": "ok", "message": msg}

# # # @app.post("/analyze")
# # # def analyze_gig(gig: GigData):
# # #     # ✅ ONLY free text fields
# # #     fields = ["title", "description"]

# # #     ok, msg = analyze_fields_with_model(gig.dict(), fields)
# # #     if not ok:
# # #         return JSONResponse(
# # #             status_code=400,
# # #             content={"status": "error", "message": msg}
# # #         )

# # #     return {"status": "ok", "message": msg}


# # # @app.post("/analyze_service")
# # # def analyze_service(service: ServiceData):
# # #     # ✅ Removed "salary" from ML/gibberish check
# # #     fields = ["title", "description", "location"]
# # #     ok, msg = analyze_fields_with_model(service.dict(), fields)
# # #     if not ok:
# # #         return JSONResponse(status_code=400, content={"status": "error", "message": msg})
# # #     return {"status": "ok", "message": msg}

# # # @app.post("/predict_text")
# # # def predict_text(payload: TextPayload):
# # #     text = (payload.text or "").strip()
# # #     if text == "":
# # #         return JSONResponse(status_code=400, content={"status": "error", "message": "Empty text"})
# # #     if is_maybe_gibberish(text, field_name="predict_text"):
# # #         log_gibberish(text, field="predict_text", extra={"reason": "rule_based_gibberish"})
# # #         return JSONResponse(status_code=400, content={"status": "error", "message": "Gibberish content detected 🚫"})
# # #     if model is None:
# # #         return JSONResponse(status_code=500, content={"status": "error", "message": "Model not loaded"})
# # #     try:
# # #         norm = normalize_text(text)
# # #         prob = float(model.predict_proba([norm])[0, 1]) if hasattr(model, "predict_proba") else (1.0 if int(model.predict([norm])[0]) == 1 else 0.0)
# # #         pred = int(prob >= THRESHOLD)
# # #         if pred == 1:
# # #             return JSONResponse(status_code=400, content={"status": "error", "message": "Harmful content detected 🚫", "probability": prob})
# # #         return {"status": "ok", "message": "Content is safe ✅", "probability": prob}
# # #     except Exception as e:
# # #         return JSONResponse(status_code=500, content={"status": "error", "message": f"Prediction failed: {e}"})

# # # @app.get("/health")
# # # def health():
# # #     return {"status": "ok", "model_loaded": model is not None, "threshold": THRESHOLD}



# # import os
# # import re
# # import csv
# # import joblib
# # import datetime
# # from pathlib import Path
# # from fastapi import FastAPI
# # from fastapi.responses import JSONResponse
# # from pydantic import BaseModel
# # import typing as t

# # # ----------------- CONFIG -----------------
# # MODEL_PATH = os.environ.get("HARMFUL_MODEL_PATH", "model/harmful_detector.pkl")
# # THRESHOLD = float(os.environ.get("HARMFUL_THRESHOLD", 0.45))
# # GIBBERISH_LOG = Path(os.environ.get("GIBBERISH_LOG", "data/gibberish_log.csv"))
# # GIBBERISH_LOG.parent.mkdir(parents=True, exist_ok=True)

# # # ----------------- LOAD MODEL -----------------
# # try:
# #     model = joblib.load(MODEL_PATH)
# #     print("✅ Model loaded from", MODEL_PATH)
# # except Exception as e:
# #     model = None
# #     print("❌ ERROR loading model:", e)

# # # ----------------- APP -----------------
# # app = FastAPI(title="Taskora AI Moderation API")

# # # ----------------- SCHEMAS -----------------
# # class GigData(BaseModel):
# #     title: str
# #     description: str
# #     location: str          # required by frontend, NOT checked by AI
# #     category: str          # required by frontend, NOT checked by AI
# #     date: datetime.date
# #     contact: str

# # class ServiceData(BaseModel):
# #     title: str
# #     description: str
# #     salary: str
# #     location: str
# #     contact: str
# #     date: datetime.date

# # class TextPayload(BaseModel):
# #     text: str

# # # ----------------- NORMALIZATION -----------------
# # def normalize_text(s: str) -> str:
# #     s = s.lower().strip()
# #     s = re.sub(r'https?://\S+|www\.\S+|\S+@\S+', ' ', s)
# #     s = re.sub(r'[^\w\s]', ' ', s)
# #     s = re.sub(r'\s+', ' ', s)
# #     return s.strip()

# # # ----------------- CONTACT CHECK -----------------
# # def is_valid_contact(contact: str) -> bool:
# #     return re.match(r"^\+?\d{7,15}$", (contact or "")) is not None

# # # ----------------- MODERATION LOGIC -----------------
# # def analyze_fields_with_model(payload: dict, fields_to_check: t.List[str]):
# #     if model is None:
# #         return False, "Moderation model not loaded ❌"

# #     # ✅ Contact validation (non-ML)
# #     if not is_valid_contact(payload.get("contact", "")):
# #         return False, "Invalid contact number format ❌"

# #     # ✅ ML validation ONLY on allowed fields
# #     for field in fields_to_check:
# #         text = payload.get(field, "").strip()
# #         if not text:
# #             continue

# #         try:
# #             norm = normalize_text(text)
# #             prob = (
# #                 float(model.predict_proba([norm])[0][1])
# #                 if hasattr(model, "predict_proba")
# #                 else float(model.predict([norm])[0])
# #             )

# #             print(f"[ML] field={field} prob={prob:.3f} text='{text}'")

# #             if prob >= THRESHOLD:
# #                 return False, f"Harmful content detected in {field} 🚫"

# #         except Exception as e:
# #             return False, f"Model prediction failed: {str(e)}"

# #     return True, "Content is safe ✅"

# # # ----------------- ENDPOINTS -----------------
# # @app.post("/analyze")
# # def analyze_gig(gig: GigData):
# #     """
# #     ✅ ONLY title & description are checked by AI
# #     ❌ location, category, date, contact are NOT ML-checked
# #     """
# #     fields = ["title", "description"]

# #     ok, msg = analyze_fields_with_model(gig.dict(), fields)
# #     if not ok:
# #         return JSONResponse(
# #             status_code=400,
# #             content={"status": "error", "message": msg}
# #         )

# #     return {"status": "ok", "message": msg}


# # @app.post("/analyze_service")
# # def analyze_service(service: ServiceData):
# #     """
# #     ✅ ONLY title & description are checked by AI
# #     """
# #     fields = ["title", "description"]

# #     ok, msg = analyze_fields_with_model(service.dict(), fields)
# #     if not ok:
# #         return JSONResponse(
# #             status_code=400,
# #             content={"status": "error", "message": msg}
# #         )

# #     return {"status": "ok", "message": msg}


# # @app.post("/predict_text")
# # def predict_text(payload: TextPayload):
# #     text = (payload.text or "").strip()

# #     if not text:
# #         return JSONResponse(
# #             status_code=400,
# #             content={"status": "error", "message": "Empty text"}
# #         )

# #     if model is None:
# #         return JSONResponse(
# #             status_code=500,
# #             content={"status": "error", "message": "Model not loaded"}
# #         )

# #     try:
# #         norm = normalize_text(text)
# #         prob = (
# #             float(model.predict_proba([norm])[0][1])
# #             if hasattr(model, "predict_proba")
# #             else float(model.predict([norm])[0])
# #         )

# #         if prob >= THRESHOLD:
# #             return JSONResponse(
# #                 status_code=400,
# #                 content={
# #                     "status": "error",
# #                     "message": "Harmful content detected 🚫",
# #                     "probability": prob
# #                 }
# #             )

# #         return {
# #             "status": "ok",
# #             "message": "Content is safe ✅",
# #             "probability": prob
# #         }

# #     except Exception as e:
# #         return JSONResponse(
# #             status_code=500,
# #             content={"status": "error", "message": f"Prediction failed: {e}"}
# #         )


# # @app.get("/health")
# # def health():
# #     return {
# #         "status": "ok",
# #         "model_loaded": model is not None,
# #         "threshold": THRESHOLD
# #     }

# ################################################################################################
# import os
# import re
# import datetime
# import typing as t
# import torch
# from fastapi import FastAPI
# from fastapi.responses import JSONResponse
# from pydantic import BaseModel
# from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification

# # ================= CONFIG =================
# MODEL_DIR = os.path.abspath("model/bert_moderator")

# BLOCK_THRESHOLD = 0.60
# REVIEW_THRESHOLD = 0.35

# device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# # ================= LOAD MODEL =================
# tokenizer = DistilBertTokenizerFast.from_pretrained(
#     MODEL_DIR, local_files_only=True
# )
# model = DistilBertForSequenceClassification.from_pretrained(
#     MODEL_DIR, local_files_only=True
# )
# model.to(device)
# model.eval()

# # ================= APP =================
# app = FastAPI(title="Taskora AI Moderation API (Final Safe Version)")

# # ================= SCHEMAS =================
# class GigData(BaseModel):
#     title: str
#     description: str
#     location: str
#     category: str
#     date: datetime.date
#     contact: str

# class TextPayload(BaseModel):
#     text: str

# # ================= BENIGN WHITELIST (CRITICAL) =================
# BENIGN_PHRASES = [
#     "kill time",
#     "kill boredom",
#     "killing time",
#     "killer performance",
#     "killer deal",
#     "killer design",
#     "toy gun",
#     "water gun",
#     "photo shoot",
#     "shoot me a message",
#     "gun salute",
#     "gun museum",
#     "bombed at the box office",
#     "the bomb",
#     "party was the bomb",
#     "shooting stars",
#     "attack the problem",
#     "cute attack",
#     "laughter attack"
# ]

# def is_benign_context(text: str) -> bool:
#     text = text.lower()
#     return any(p in text for p in BENIGN_PHRASES)

# # ================= HARD BLOCK RULES =================

# # 🔴 REAL VIOLENCE (INTENT BASED)
# VIOLENCE_PATTERNS = [
#     r"kill\s+(someone|him|her|them|people)",
#     r"i\s*want\s*to\s*kill",
#     r"going\s*to\s*kill",
#     r"plan\s*to\s*kill",
#     r"murder",
#     r"shoot\s+(someone|him|her|them)",
#     r"stab\s+(someone|him|her|them)"
# ]

# # 🔴 WEAPON BUYING / SELLING
# WEAPON_PATTERNS = [
#     r"(buy|sell|need|purchase).*(gun|pistol|rifle|weapon)",
#     r"(illegal\s*gun|country\s*made\s*gun)",
#     r"(buy\s*ak47|buy\s*pistol)"
# ]

# # 🔴 SEXUAL SERVICES
# SEXUAL_PATTERNS = [
#     r"(escort|call\s*girl|paid\s*girl|sex\s*service)",
#     r"(i\s*want\s*girl\s*for\s*sex)",
#     r"(prostitution|porn|xxx)"
# ]

# # 🔴 THEFT / FRAUD
# THEFT_PATTERNS = [
#     r"(steal|rob|loot|scam)",
#     r"(credit\s*card\s*details|bank\s*otp)",
#     r"(fake\s*id|counterfeit\s*money)"
# ]

# def matches_any(patterns, text):
#     return any(re.search(p, text) for p in patterns)

# # ================= HELPERS =================
# def normalize(text: str) -> str:
#     text = text.lower()
#     text = re.sub(r'https?://\S+|www\.\S+|\S+@\S+', ' ', text)
#     text = re.sub(r'\s+', ' ', text)
#     return text.strip()

# def deobfuscate(text: str) -> str:
#     return re.sub(r'[\W_]+', '', text.lower())

# def bert_probability(text: str) -> float:
#     inputs = tokenizer(
#         text,
#         return_tensors="pt",
#         truncation=True,
#         padding=True,
#         max_length=128
#     ).to(device)
#     with torch.no_grad():
#         probs = torch.softmax(model(**inputs).logits, dim=1)
#         return probs[0][1].item()

# # ================= CORE MODERATION =================
# def moderate_text(text: str):
#     text = normalize(text)
#     clean = deobfuscate(text)

#     # 1️⃣ BENIGN CONTEXT FIRST (FIX FOR "kill time")
#     if is_benign_context(text):
#         return True, "Safe idiomatic usage ✅"

#     # 2️⃣ HARD RULE BLOCKS (REAL HARM ONLY)
#     if (
#         matches_any(VIOLENCE_PATTERNS, text) or
#         matches_any(WEAPON_PATTERNS, text) or
#         matches_any(SEXUAL_PATTERNS, text) or
#         matches_any(THEFT_PATTERNS, text) or
#         matches_any(VIOLENCE_PATTERNS, clean)
#     ):
#         return False, "Harmful content is not allowed 🚫"

#     # 3️⃣ BERT (CONTEXTUAL VIOLENCE)
#     prob = bert_probability(text)
#     print(f"[BERT] probability={prob:.4f}")

#     if prob >= BLOCK_THRESHOLD:
#         return False, "Violence or threat detected 🚫"

#     if prob >= REVIEW_THRESHOLD:
#         return False, "Content requires manual review ⚠️"

#     return True, "Content is safe ✅"

# # ================= ENDPOINTS =================
# @app.post("/analyze")
# def analyze(payload: GigData):
#     combined = f"{payload.title} {payload.description}"
#     ok, msg = moderate_text(combined)
#     if not ok:
#         return JSONResponse(status_code=400, content={"status": "error", "message": msg})
#     return {"status": "ok", "message": msg}

# @app.post("/predict_text")
# def predict(payload: TextPayload):
#     ok, msg = moderate_text(payload.text)
#     if not ok:
#         return JSONResponse(status_code=400, content={"status": "error", "message": msg})
#     return {"status": "ok", "message": msg}

# @app.get("/health")
# def health():
#     return {"status": "ok", "model_loaded": True}





import os
import re
import datetime
import typing as t
import torch
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification

# ================= CONFIG =================
MODEL_DIR = os.path.abspath("model/bert_moderator")

BLOCK_THRESHOLD = 0.60
REVIEW_THRESHOLD = 0.35

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ================= LOAD MODEL =================
tokenizer = DistilBertTokenizerFast.from_pretrained(
    MODEL_DIR, local_files_only=True
)
model = DistilBertForSequenceClassification.from_pretrained(
    MODEL_DIR, local_files_only=True
)
model.to(device)
model.eval()

# ================= APP =================
app = FastAPI(title="Taskora AI Moderation API (Final Safe Version)")

# ================= SCHEMAS =================
class GigData(BaseModel):
    title: str
    description: str
    location: str
    category: str
    date: datetime.date
    contact: str

# ✅ ADDED SERVICE SCHEMA (ONLY NEW PART)
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
        probs = torch.softmax(model(**inputs).logits, dim=1)
        return probs[0][1].item()

# ================= CORE MODERATION (UNCHANGED) =================
def moderate_text(text: str):
    text = normalize(text)
    clean = deobfuscate(text)

    if is_benign_context(text):
        return True, "Safe idiomatic usage ✅"

    if (
        matches_any(VIOLENCE_PATTERNS, text) or
        matches_any(WEAPON_PATTERNS, text) or
        matches_any(SEXUAL_PATTERNS, text) or
        matches_any(THEFT_PATTERNS, text) or
        matches_any(VIOLENCE_PATTERNS, clean)
    ):
        return False, "Harmful content is not allowed 🚫"

    prob = bert_probability(text)
    print(f"[BERT] probability={prob:.4f}")

    if prob >= BLOCK_THRESHOLD:
        return False, "Violence or threat detected 🚫"

    if prob >= REVIEW_THRESHOLD:
        return False, "Content requires manual review ⚠️"

    return True, "Content is safe ✅"

# ================= ENDPOINTS =================

# ✅ Gig endpoint (UNCHANGED)
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


# ✅ ADDED SERVICE ENDPOINT (NEW ONLY)
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