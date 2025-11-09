import uuid
import hashlib
from datetime import datetime
from utils.storage import read_json, write_json

USERS_FILE = "users.json"
active_sessions = {}

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def register_user(name: str, email: str, password: str):
    users = read_json(USERS_FILE)
    if any(u["email"] == email for u in users):
        return {"error": "Email already registered"}, 400
    
    user = {
        "id": str(uuid.uuid4()),
        "name": name,
        "email": email,
        "password": hash_password(password),
        "created_at": datetime.utcnow().isoformat()
    }
    users.append(user)
    write_json(USERS_FILE, users)

    token = str(uuid.uuid4())
    active_sessions[token] = user["id"]
    return {"message": "Registered successfully", "token": token, "user": user}, 201

def login_user(email: str, password: str):
    users = read_json(USERS_FILE)
    user = next((u for u in users if u["email"] == email), None)
    if not user or not verify_password(password, user["password"]):
        return {"error": "Invalid credentials"}, 401
    
    token = str(uuid.uuid4())
    active_sessions[token] = user["id"]
    return {"message": "Login successful", "token": token, "user": user}, 200

def get_user_from_token(token: str):
    user_id = active_sessions.get(token)
    if not user_id:
        return None
    users = read_json(USERS_FILE)
    return next((u for u in users if u["id"] == user_id), None)
