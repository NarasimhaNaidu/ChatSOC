from ast import parse
from email import message
import json
from bson import ObjectId, json_util
from flask import Flask, request
from flask_socketio import SocketIO, join_room, send
from pymongo import MongoClient

app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*", async_mode=None)

# MongoDb config
client = MongoClient('localhost', 27017)
db = client.arawinz


def parse_json(data):
    return json.loads(json_util.dumps(data))

# Socket Routes


@socketio.on('create_room')
def on_join(data):
    room = "room_" + data['room_id']
    join_room(room)
    return parse_json({"msg": "You has joined the " + room, "room_id": data['room_id'], "status": True})


@socketio.on('getMessages')
def handle_message():
    print('getMessages')


@socketio.on('message')
def handle_message(data):
    db.messages.insert_one(
        {"user_id": ObjectId(data['user_id']), "room_id": "room_"+data['room_id'], "message": data['message']})
    socketio.emit("new_message", parse_json(
        data), room="room_"+data['room_id'])

# App routes


@app.route("/user-login", methods=["POST"])
def user_login():
    user = parse_json(db.users.find_one({"user": request.json['user']}))
    if(user == None):
        insert_data = db.users.insert_one(
            {"user": request.json['user']}).inserted_id
        user = parse_json(
            {"user": request.json['user'], "_id": {"$oid": insert_data}})

    return user


@app.route("/getallrecentmessages", methods=["GET"])
def getallrecentmessages():
    return parse_json({"messages": db.messages.aggregate([{
        '$lookup': {
            'from': 'users',
            'localField': 'user_id',
            'foreignField': '_id',
            'as': 'user',
        }

    }, {
        '$unwind': '$user'
    }])})


if __name__ == '__main__':
    socketio.run(app)
