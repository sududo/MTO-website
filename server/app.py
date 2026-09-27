from flask import Flask, jsonify, send_from_directory, request, Response
import os
from os import path as pth

pages_dir = pth.join(pth.dirname(pth.dirname(pth.realpath(__file__))), "client/")
print(pages_dir)

app = Flask(__name__)

srvport = int(os.getenv('FLASK_RUN_PORT', '5000'))

@app.route('/', defaults = {'path': 'index.html'}, methods = ['GET'])
@app.route('/<path:path>', methods = ['GET'])
def mainPage(path):
    print(path)
    return send_from_directory(pages_dir, path)

@app.route('/data', methods = ['POST'])
def wordSubmission():
    if not request.is_json:
        return Response(status=400)

    json = request.get_json();

    print(json)
    return Response(status=200)

if __name__ == "__main__":
    app.run(host='0.0.0.0',debug=False, port=srvport)

