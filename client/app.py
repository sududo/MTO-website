import random 
from flask import Flask, jsonify, send_from_directory
from os import path as pth

pages_dir = pth.join(pth.dirname(pth.dirname(pth.realpath(__file__))), "client/")
print(pages_dir)

app = Flask(__name__)




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
    
    
    return f"<h1>The password is: {show_password()}</h1>"
    print(path)
    return send_from_directory(pages_dir, path)
    

@app.route('/data', methods = ['POST'])
def wordSubmission():
    if not request.is_json:
        return Response(status=400)

    json = request.get_json()

    print(json)
    return Response(status=200)

if __name__ == "__main__":
    app.run(debug=False)
