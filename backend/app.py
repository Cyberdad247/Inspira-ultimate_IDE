from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def health_check():
    return jsonify({
        "status": "running",
        "message": "HiveIDE Backend API",
        "version": "1.0.0"
    })

@app.route('/api/projects', methods=['GET'])
def get_projects():
    return jsonify({
        "projects": [],
        "message": "Project list endpoint"
    })

@app.route('/api/health', methods=['GET'])
def health_status():
    return jsonify({
        "status": "healthy",
        "components": {
            "database": "connected",
            "memory": "ok",
            "storage": "ok"
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)