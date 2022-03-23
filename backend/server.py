import flask
from flask import make_response, jsonify
from flask_cors import CORS


app = flask.Flask(__name__)
CORS(app)

@app.route('/test', methods=['GET', 'POST'])
def show_index():
    if flask.request.method == "POST":
        request = flask.request.get_json(force=True)

    output = {'test': 2}

    return make_response(jsonify(**output))

@app.route("/members")
def members():
    return {"members": ["Member1", "Member2", "Member3"]}

if __name__ == "__main__":
    app.run(debug=True)

# @app.route("/get_init_state")
# def get_init_state():
#     data = {}
#     # how to return to "/"?
#     # or do we make all different rquest types in "/"
#     return redirect(url_for('success',name = user))