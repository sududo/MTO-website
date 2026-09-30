from flask import Flask, jsonify, send_from_directory, request, Response, session
import os
import random
from os import path as pth

PAGES_DIR = pth.join(pth.dirname(pth.dirname(pth.realpath(__file__))), "client/")
print(PAGES_DIR)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'asdsdgbxsgb'

def show_password():
    password = " "
    
    try:
        with open('words.txt', 'r') as file:
            password = file.read()
    except FileNotFoundError:
        password = "Error: words.txt file not found."

    if password:
        password = random.choice(password)
    else:
        password = "The file is empty."    
    return password

@app.route('/', defaults = {'path': 'index.html'}, methods = ['GET'])
@app.route('/<path:path>', methods = ['GET'])
def mainPage(path):
    print(path)
    if path == 'index.html':
        session['password'] = show_password()

    print(session['password']);
    return send_from_directory(PAGES_DIR, path)

@app.route('/data', methods = ['POST'])
def wordSubmission():
    if not request.is_json:
        return Response(status=400)

    json = request.get_json();

    print(json)
    return Response(status=200)

if __name__ == "__main__":
    app.run(host='0.0.0.0',debug=False, port=int(os.getenv('FLASK_RUN_PORT', '5000')))

