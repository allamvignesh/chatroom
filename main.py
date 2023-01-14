from flask import Flask, request, render_template, session, redirect, url_for
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = "something!"
socket = SocketIO(app)

# @app.route('/')


@app.route('/login', methods=['POST', 'GET'])
def login():
    if 'user' in session:
        return redirect(url_for('chat'))
    if request.method == 'POST':
        if 'name' in request.form:
            session['user'] = request.form['name']
            return redirect(url_for('chat'))
    return render_template("login.html")

@app.route('/chat')
def chat():
    if 'user' in session:
        return render_template("index.html", username=session['user'])
    return redirect(url_for('login'))

@app.route('/logout')
def logout():
    if 'user' in session:
        session.pop('user')
    return redirect(url_for('login'))

@socket.on('connect')
def connect():
    print("[CLIENT CONNECTED]", request.sid)

@socket.on('notify')
def notify(user):
    print(user)
    emit('notify', user, broadcast=True, skip_sid=request.sid)

@socket.on('data')
def emitback(data):
    emit('returndata', data, broadcast=True)

socket.run(app, debug=True, host="0.0.0.0")
