import os

from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask.cli import load_dotenv
from flask_login import LoginManager, login_user, logout_user, login_required, UserMixin, current_user
import pymysql
import bcrypt
from contextlib import contextmanager
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY')

# MySQL configurations
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')
app.config['MYSQL_PORT'] = 3306

@contextmanager
def get_db_connection():
    connection = pymysql.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        db=app.config['MYSQL_DB'],
        cursorclass=pymysql.cursors.DictCursor
    )
    try:
        yield connection
    finally:
        connection.close()


login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


class User(UserMixin):
    def __init__(self, id, username):
        self.id = id
        self.username = username


@login_manager.user_loader
def load_user(user_id):
    with get_db_connection() as connection:
        with connection.cursor() as cur:
            cur.execute("SELECT id, username FROM users WHERE id = %s", (user_id,))
            user = cur.fetchone()
    return User(user['id'], user['username']) if user else None


@app.route('/', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('todo'))

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        with get_db_connection() as connection:
            with connection.cursor() as cur:
                cur.execute("SELECT id, password FROM users WHERE username = %s", (username,))
                user = cur.fetchone()

        if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            login_user(User(user['id'], username))
            flash('Logged in successfully.', 'success')
            return redirect(url_for('todo'))
        else:
            flash('Invalid username or password', 'danger')

    return render_template('index.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        with get_db_connection() as connection:
            with connection.cursor() as cur:
                cur.execute("SELECT * FROM users WHERE username = %s", (username,))
                if cur.fetchone():
                    flash('Username already exists. Please choose a different one.', 'danger')
                    return render_template('register.html')

                hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
                cur.execute("INSERT INTO users (username, password) VALUES (%s, %s)",
                            (username, hashed_password.decode('utf-8')))
                connection.commit()

        flash('Registration successful. Please log in.', 'success')
        return redirect(url_for('login'))

    return render_template('register.html')


@app.route('/todo', methods=['GET', 'POST'])
@login_required
def todo():
    if request.method == 'POST':
        todo_text = request.form['todo']
        with get_db_connection() as connection:
            with connection.cursor() as cur:
                cur.execute("INSERT INTO todos (user_id, todo_text) VALUES (%s, %s)", (current_user.id, todo_text))
                connection.commit()
        flash('Todo added successfully!', 'success')
        return redirect(url_for('todo'))  # Redirect after POST

    with get_db_connection() as connection:
        with connection.cursor() as cur:
            cur.execute("SELECT id, todo_text, is_done FROM todos WHERE user_id = %s ORDER BY id DESC",
                        (current_user.id,))
            todos = cur.fetchall()

    return render_template('todo.html', todos=todos)

@app.route('/toggle_todo/<int:todo_id>')
@login_required
def toggle_todo(todo_id):
    with get_db_connection() as connection:
        with connection.cursor() as cur:
            cur.execute("UPDATE todos SET is_done = NOT is_done WHERE id = %s AND user_id = %s",
                        (todo_id, current_user.id))
            connection.commit()
    return jsonify(success=True)

@app.route('/delete_todo/<int:todo_id>')
@login_required
def delete_todo(todo_id):
    with get_db_connection() as connection:
        with connection.cursor() as cur:
            cur.execute("DELETE FROM todos WHERE id = %s AND user_id = %s", (todo_id, current_user.id))
            connection.commit()
    return jsonify(success=True)

@app.route('/update_todo/<int:todo_id>', methods=['POST'])
@login_required
def update_todo(todo_id):
    new_text = request.json.get('text')
    with get_db_connection() as connection:
        with connection.cursor() as cur:
            cur.execute("UPDATE todos SET todo_text = %s WHERE id = %s AND user_id = %s",
                        (new_text, todo_id, current_user.id))
            connection.commit()
    return jsonify(success=True)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Logged out successfully.', 'success')
    return redirect(url_for('login'))

@app.route('/add_todo', methods=['POST'])
@login_required
def add_todo():
    todo_text = request.json['todo']
    with get_db_connection() as connection:
        with connection.cursor() as cur:
            cur.execute("INSERT INTO todos (user_id, todo_text) VALUES (%s, %s)", (current_user.id, todo_text))
            connection.commit()
            todo_id = cur.lastrowid
    return jsonify(success=True, todo_id=todo_id)

if __name__ == '__main__':
    app.run(debug=True)
