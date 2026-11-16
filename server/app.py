from flask import Flask, jsonify, send_from_directory, request, Response, session, redirect, url_for, abort
from flask_session import Session
from flask_socketio import SocketIO
from cachelib.file import FileSystemCache
import os
import random
from os import path as pth
from datetime import timedelta

SERVER_DIR = pth.dirname(pth.realpath(__file__))
INDEX_DIR = pth.join(pth.dirname(pth.dirname(pth.realpath(__file__))), "client/")
MENUPAGE_DIR = pth.join(INDEX_DIR, "menupage/")

app = Flask(__name__)
app.config['SECRET_KEY'] = 'asdsdgbxsgb'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=15)
app.config['SESSION_PERMANENT'] = True
app.config['SESSION_TYPE'] = 'cachelib'
app.config['SESSION_CACHELIB'] = FileSystemCache(cache_dir=f'{SERVER_DIR}/flask_session', threshold=500)

Session(app)

def show_password():
    try:
        with open(f'{SERVER_DIR}/words.txt', 'r') as file:
            words = file.read().split()
    except FileNotFoundError:
        return None

    if not words:
        return None
    return random.choice(words)

@app.route('/', defaults = {'path': 'index.html'}, methods = ['GET'])
@app.route('/<path:path>', methods = ['GET'])
def mainPage(path):
    print(path)
    if '/' in path:
        abort(403)
    if path == 'index.html':
        password = show_password()

        if password is None:
            print("Couldn't generate a password")
            password = "aaaaa"


        session.modified = True
        session['password'] = password 
        if 'validated' not in session:
            session['validated'] = False
        print(f'Current password is: {password}')

        session['letter_guesses'] = {}
        for i, letter in enumerate(session['password']):
            if letter not in session['letter_guesses']:
                session['letter_guesses'][letter] = []
            session['letter_guesses'][letter].append(i)

        session['current_field'] = 0

    return send_from_directory(INDEX_DIR, path)

@app.route('/data', methods = ['POST'])
def wordSubmission():
    if not request.is_json:
        return Response(status=400)

    json = request.get_json()
    
    if 'word' not in json or 'try' not in json:
        return Response(status=400)

    if json['try'] != session['current_field']:
        return Response(status=400)

    if session['current_field'] > 5:
        return Response(status=400)

    session.modified = True
    session['current_field'] += 1

    guess = json['word'].lower() 
   
    correct_word = session.get('password', 'aaaaa') 
    
    print(f"User guessed: {guess} | Correct word: {correct_word}")

    colors = []
    
    if(correct_word == guess):
        session['validated'] = True
        return redirect(url_for('mainpage'), 301)
    letter_counts = {}
    for letter in correct_word:
        if letter not in letter_counts:
            letter_counts[letter] = 1
        else:
            letter_counts[letter] += 1

    for i in range(len(correct_word)):
        if guess[i] == correct_word[i]:
            colors.append("green")
            session['letter_guesses'][guess[i]] = [x for x in session['letter_guesses'][guess[i]] if x != i]
        elif guess[i] in correct_word and len(session['letter_guesses'][guess[i]]) > 0 and letter_counts[guess[i]] > 0:
            colors.append("yellow")
            letter_counts[guess[i]] -= 1;
        else:
            colors.append("gray")

    return jsonify(colors), 200

@app.route('/mainpage/', defaults = {'path': 'menupage.html'}, methods = ['GET'])
@app.route('/mainpage/<path:path>', methods = ['GET'])
def mainpage(path):
    if 'validated' not in session or not session['validated']:
        abort(403)
    return send_from_directory(MENUPAGE_DIR, path)

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=int(os.getenv('FLASK_RUN_PORT', '5000')))
