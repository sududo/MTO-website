from flask import Flask, jsonify, send_from_directory, request, Response, session, redirect, url_for, abort
from flask_session import Session
from cachelib.file import FileSystemCache
import os
import random
from os import path as pth

SERVER_DIR = pth.dirname(pth.realpath(__file__))
PAGES_DIR = pth.join(pth.dirname(pth.dirname(pth.realpath(__file__))), "client/")
print(PAGES_DIR)

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', os.urandom(24).hex())


app.config['SESSION_TYPE'] = 'cachelib'
app.config['SESSION_CACHELIB'] = FileSystemCache(
    cache_dir=f'{SERVER_DIR}/flask_session', 
    threshold=500
)
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
        session['validated'] = False
        print(f'Current password is: {password}')

        session['letter_guesses'] = {}
        for i, letter in enumerate(session['password']):
            if letter not in session['letter_guesses']:
                session['letter_guesses'][letter] = []
            session['letter_guesses'][letter].append(i)

        session['current_field'] = 0

    return send_from_directory(PAGES_DIR, path)

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

    session['current_field'] += 1

    guess = json['word'].lower() 
   
    correct_word = session.get('password', 'aaaaa') 
    
    print(f"User guessed: {guess} | Correct word: {correct_word}")

    colors = []
    
    if(correct_word == guess):
        session['validated'] = True
        return redirect(url_for('mainpage'), 301)

    for i in range(len(correct_word)):
        if guess[i] == correct_word[i]:
            colors.append("green")
            session['letter_guesses'][guess[i]] = [x for x in session['letter_guesses'][guess[i]] if x != i]
        elif guess[i] in correct_word and len(session['letter_guesses'][guess[i]]) > 0:
            colors.append("yellow")
        else:
            colors.append("gray")

    return jsonify(colors), 200

@app.route('/mainpage/', defaults = {'path': 'menupage.html'}, methods = ['GET'])
@app.route('/mainpage/<path:path>', methods = ['GET'])
def mainpage(path):
    if not session['validated']:
        abort(403)
    return send_from_directory(PAGES_DIR, path)

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=False, port=int(os.getenv('FLASK_RUN_PORT', '5000')))
