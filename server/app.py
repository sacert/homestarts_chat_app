from flask import Flask, jsonify, request
from flask_socketio import SocketIO, send
from flask_redis import FlaskRedis
from flask_cors import CORS, cross_origin
from datetime import datetime

REDIS_URL = "redis://localhost:6379/0"
CHAT_CHANNELS = ['general', 'testing', 'code']

app = Flask(__name__)
app.config['SECRET_KEY'] = 'supersecret'
CORS(app, support_credentials=True)

redis_client = FlaskRedis(app, decode_responses=True)

socketIo = SocketIO(app, cors_allowed_origins="*")

app.debug = True

app.host = 'localhost'

# initially set up the redis db with channels
if redis_client.get('channels') == None:
    redis_client.set('channels', ','.join(CHAT_CHANNELS))

@app.route('/channels', methods=['GET'])
def channels():
    data = {'channels': ','.join(CHAT_CHANNELS)}
    return jsonify(data)

@app.route('/messages', methods=['GET'])
def messages():
    request_dict = request.args.to_dict()

    if 'channel' not in request_dict:
        return "Channel not set", 404

    channel = request_dict['channel']

    data = redis_client.hgetall(channel)
    return jsonify(data)

@socketIo.on('message')
def handleMessage(msg):
    redis_client.hset(msg['channel'], str(datetime.now()), f"{msg['username']}:{msg['message']}")
    send(f"{msg['username']}:{msg['message']}", broadcast=True)
    return None

if __name__ == '__main__':
    socketIo.run(app)
