import os

from flask import (
    Flask,
    session,
    render_template,
    redirect,
    request,
    url_for,
)

from sqlalchemy import create_engine
from sqlalchemy.orm import (
    scoped_session,
    sessionmaker
)

from flask_session import Session
from flask_socketio import (
    SocketIO,
    emit
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

 #Set up database & scope_session for each user
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))



@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == 'GET':
        if 'user' in session:
            #username = 'Kot_Mieczyslaw'#session['user']
            return redirect(url_for('communicator'))#username=username))
        else:
            return render_template('login-register.html', title="Log in")
    elif request.method == 'POST' and request.form == ['register']:
        return redirect(url_for('login'))
    else:
        return redirect(url_for('register'))

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username-login']
    password = request.form['password-login']

    user_data = Users.query.all()
    for user in user_data:
        if user.username == username and user.password:
            return redirect(url_for('communicator'))
            break
        else:
            return "user and password not match!"

@app.route('/register', methods=['POST'])
def register():
    username = request.form['username-register']
    password = request.form['password-register']
    password_ver = request.form['password-register-2']
    email = request.form['email-register']

    if password == password_ver:
        add_user = Users(username=username, password=password, email=email, date_of_register=datetime.utcnow())
        db.add(add_user)
        db.commit()
        return "succes!" #Working
    else:
        return "WORK ON POP up of javascript"



#################### WORK ON SESSION THURSDAY ######################

@app.route('/communicator', methods=["GET", "POST"])
def communicator():
    if request.method == "GET" or request.method == "POST":
        return render_template('communication_page.html')
