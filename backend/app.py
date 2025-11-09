from flask import Flask, jsonify, request, session
from flask_cors import CORS
import json, hashlib
from pathlib import Path
import os

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY")
CORS(app, supports_credentials=True)


DATA_PATH = Path(__file__).parent / 'data' / 'products.json'
USERS_PATH = Path(__file__).parent / 'users.json'

# Load products once (in memory)
with open(DATA_PATH, 'r', encoding='utf-8') as f:
    PRODUCTS = json.load(f)

# in-memory users list loaded from users.json
if USERS_PATH.exists():
    with open(USERS_PATH, 'r', encoding='utf-8') as f:
        USERS = json.load(f)
else:
    USERS = []
    
@app.route('/api/products')
def get_products():
    return jsonify(PRODUCTS)

@app.route('/api/register', methods=['POST'])
def register():
    payload = request.json
    email = (payload.get('email') or '').lower().strip()
    password = payload.get('password')
    name = payload.get('name', '').strip()

    if not email or not password:
        return jsonify({'error': 'email and password required'}), 400

    if any(u['email'] == email for u in USERS):
        return jsonify({'error': 'user already exists'}), 400

    hashed_pw = hashlib.sha256(password.encode()).hexdigest()
    user = {'id': len(USERS) + 1, 'email': email, 'name': name}
    USERS.append({**user, 'password': hashed_pw})

    with open(USERS_PATH, 'w', encoding='utf-8') as f:
        json.dump(USERS, f, indent=2)

    session['user'] = user
    return jsonify({'user': user}), 201


@app.route('/api/login', methods=['POST'])
def login():
    payload = request.json
    print(payload)
    email = (payload.get('email') or '').lower().strip()
    password = payload.get('password')

    if not email or not password:
        return jsonify({'error': 'email and password required'}), 400

    hashed_pw = hashlib.sha256(password.encode()).hexdigest()
    user = next((u for u in USERS if u['email'] == email and u['password'] == hashed_pw), None)

    if not user:
        return jsonify({'error': 'invalid credentials'}), 401

    session['user'] = {'id': user['id'], 'email': user['email'], 'name': user.get('name', '')}
    return jsonify({'user': session['user']}), 200

@app.route('/api/user/profile', methods=['GET'])
def get_profile():
    user = session.get('user')
    if not user:
        return jsonify({'error': 'not logged in'}), 401
    return jsonify({'user': user}), 200

@app.route('/api/checkout', methods=['POST'])
def checkout():
    if 'user' not in session:
        return jsonify({'error': 'authentication required'}), 401
    data = request.json
    # cart validation
    if not data or not data.get('cart'):
        return jsonify({'error': 'empty cart'}), 400
    return jsonify({'order_id': 1000 + len(data.get('cart')) , 'status': 'success'})

@app.route('/api/health')
def health_check():
    return jsonify({'status': 'ok', 'message': 'Backend is healthy'}), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)