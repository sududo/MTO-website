from flask import Flask, jsonify, send_from_directory, request, Response, session
from flask_session import Session
from cachelib.file import FileSystemCache
import os
import random
from os import path as pth

SERVER_DIR = pth.dirname(pth.realpath(__file__))
PAGES_DIR = pth.join(pth.dirname(pth.dirname(pth.realpath(__file__))), "client/")
print(PAGES_DIR)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'asdsdgbxsgb'
app.config['SESSION_TYPE'] = 'cachelib'
app.config['SESSION_CACHELIB'] = FileSystemCache(cache_dir=f'{SERVER_DIR}/flask_session', threshold=500)

Session(app)

def show_password():
    try:
        with open(f'{SERVER_DIR}/words.txt', 'r') as file:
            words = file.read().split()
    except FileNotFoundError:
        return None

    if words:
        return random.choice(words)
    return None

@app.route('/', defaults = {'path': 'index.html'}, methods = ['GET'])
@app.route('/<path:path>', methods = ['GET'])
def mainPage(path):
    if path == 'index.html':
        password = show_password()

        if password is None:
            print("Couldn't generate a password")
            password = "aaaaa"

        session['password'] = password
        print(f'Current password is: {password}')

    return send_from_directory(PAGES_DIR, path)

@app.route('/data', methods = ['POST'])
def wordSubmission():
    if not request.is_json:
        return Response(status=400)

    json = request.get_json();

    guess = json['word'].lower()

    print(guess)
    response = jsonify(["green", "green", "gray", "yellow", "yellow"]) 
    return response, 200

if __name__ == "__main__":
    app.run(host='0.0.0.0',debug=False, port=int(os.getenv('FLASK_RUN_PORT', '5000')))

