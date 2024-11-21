from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import check_password_hash, generate_password_hash
import jwt
import datetime

app = Flask(__name__)
CORS(app)

# Configure MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['login_db']
users = db['users']

# Secret key
SECRET_KEY = 'Ancutbokho01'


@app.route('/api/register', methods=['POST'])
def register():
    data = request.json

    if users.find_one({'email': data['email']}):
        return jsonify({'message': 'Email đã tồn tại'}), 400

    user = {
        'email': data['email'],
        'password': generate_password_hash(data['password'])
    }

    users.insert_one(user)
    return jsonify({'message': 'Đăng ký thành công'}), 201


@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = users.find_one({'email': data['email']})

    if user and check_password_hash(user['password'], data['password']):
        token = jwt.encode({
            'user': data['email'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY)

        return jsonify({
            'message': 'Đăng nhập thành công',
            'token': token
        })

    return jsonify({'message': 'Email hoặc mật khẩu không đúng'}), 401


if __name__ == '__main__':
    app.run(debug=True)