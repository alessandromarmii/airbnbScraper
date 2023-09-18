from flask import Flask, jsonify, request
from flask_cors import CORS
import scraper

app = Flask(__name__)

@app.route('/run-scraper', methods=['POST'])
def run_scraper():
    # Extract data from request
    data = request.get_json()
    links = data.get('links', [])
    startDate = data.get('startDate')
    endDate = data.get('endDate')
    guestCount = data.get('guestCount')
    # You can now use these variables in your function
    result = scraper.getPrices(links, startDate, endDate, guestCount)
    return jsonify({"result": result})


if __name__ == '__main__':
    app.run(port=5000)

CORS(app)
