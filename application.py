from datetime import datetime
import os

from flask import (
    Flask,
    session,
    render_template,
    redirect,
    request,
    url_for,
    jsonify
)

from sqlalchemy import create_engine
from sqlalchemy.orm import (
    scoped_session,
    sessionmaker
)

from flask_session import Session
from flask_socketio import (
    SocketIO,
    emit,
    send
)

from models import *

if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Config engine SQLAlchemy with env and init
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

#Configure session
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

 #Set up database & scope_session for each user
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))

usersOnline = []

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == 'GET':
        if 'user' in session:
            username = session['user']
            return redirect(url_for('communicator', username=username))
        else:
            return render_template('login-register.html', title="Log in")
    elif request.method == 'POST' and request.form == ['register']:
        return redirect(url_for('login'))
    else:
        return redirect(url_for('register'))

#################### MAIN PAGE LOGIN-login ######################

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username-login']
    password = request.form['password-login']

    user_data = Users.query.all()
    last_element = db.query(Users).order_by(Users.id.desc()).first() # GETTING LAST ID OF TABLE
    last_id = last_element.id

    for user in user_data:
        if user.username == username and user.password == password:
            session["user"] = username
            usersOnline.append(username)
            return redirect(url_for('communicator', username=username))
            break
        elif user.id != None and int(user.id) < int(last_id):
            continue
        else:
            if user.id == last_id and (user.username == username and user.password == password):
                session["user"] = username
                usersOnline.append(username)
                return redirect(url_for('communicator', username=username))
            else:
                popup_string = f"Username - {username} not exist in database or password not match.\\n Please swtich to Sign up and create accont or check your logs again."
                return render_template('login-register.html', popup_string=popup_string)

@app.route('/register', methods=['POST'])
def register():
    username = request.form['username-register']
    password = request.form['password-register']
    password_ver = request.form['password-register-2']
    email = request.form['email-register']

    userExists = False
    veryficationPass = True
    popup_string = ''

    user_data = Users.query.all()
    for user in user_data:
        if (username == user.username or email == user.email) and (password != password_ver):
            userExists = True
            veryficationPass = False
            break
        elif username == user.username or email == user.email:
            userExists = True
            break
        elif password != password_ver:
            veryficationPass = False
            break
        else:
             continue

    if userExists == False and veryficationPass == True:
        add_user = Users(username=username, password=password, email=email, date_of_register=datetime.utcnow())
        db.add(add_user)
        db.commit()
        session["user"] = username
        return redirect(url_for('communicator', username=username))
    elif userExists == True and veryficationPass == True:
        popup_string = "Username already exist in database or email is in use."
        return render_template('login-register.html', popup_string=popup_string)
    elif veryficationPass == False:
        popup_string = "Veryfication password error. Make sure you\ 've reapeted it correctly"
        return render_template('login-register.html', popup_string=popup_string)
    else:
        popup_string = "Are you trying to crash my app ?"
        return render_template('login-register.html', popup_string=popup_string)

#################### MAIN PAGE OF COMMUNICATION ######################
@app.route('/communicator/<username>', methods=["GET", "POST"])
def communicator(username):
    if request.method == "GET" or request.method == "POST":
        session_user = session["user"]
        return render_template('communication_page.html', session_user=session_user)

#################### Socket.io for FLASK micro-framework ##############
@socketio.on('hello user')
def hello_for_user(json):
    print ('Recived username: ' + str(json))
    socketio.emit('hello response', json)

@socketio.on('submit message')
def mess(data):
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    user_message = data["user_message"]
    username = session["user"]
    emit("post message", {"user_message": user_message, "current_time": current_time, "username": username}, broadcast=True)

if __name__ == "__main__":
    socketio.run(app)