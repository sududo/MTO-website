from flask import Flask, jsonify, send_from_directory
from os import path as pth

pages_dir = pth.join(pth.dirname(__file__), "../client/")

app = Flask(__name__)

@app.route('/', defaults = {'path': 'index.html'})
@app.route('/<path:path>')
def mainPage(path):
    return send_from_directory(pages_dir, path)

@app.route('/data')
def getListData():
    return jsonify({"key1": "value1"})

if __name__ == "__main__":
    app.run(debug=False)

