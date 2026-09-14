from flask import Flask, jsonify, send_from_directory
from os import path as pth

pages_dir = pth.join(pth.dirname(pth.dirname(pth.realpath(__file__))), "client/")
print(pages_dir)

app = Flask(__name__)

@app.route('/', defaults = {'path': 'index.html'})
@app.route('/<path:path>')
def mainPage(path):
    print(path)
    return send_from_directory(pages_dir, path)

if __name__ == "__main__":
    app.run(debug=False)

