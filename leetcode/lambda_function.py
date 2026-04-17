import json
import requests

def getLeetCode(username):
    url = f"https://leetcode-stats-api.herokuapp.com/{username}"

    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        total_problems_solved = data['totalSolved']
        total_problems_count = data['totalQuestions']
    
        return data


def lambda_handler(event, context):

    if 'queryStringParameters' in event and event['queryStringParameters']:
        username = event['queryStringParameters'].get('username')
    else:
        username = "NA"
    
    if username == "NA":
        response = {
            "statusCode": 200,
            "body": json.dumps({
                    "totalSolved": 0,
                    "totalQuestions": 0,
                    "badge_data": f"N/A"
            }),
            "headers": {
                "Content-Type": "application/json"
            }
        }
    else:
        data = getLeetCode(username)
        
        response = {
            "statusCode": 200,
            "body": json.dumps({
                    "totalSolved": data['totalSolved'],
                    "totalQuestions": data['totalQuestions'],
                    "badge_data": f"{data['totalSolved']}/{data['totalQuestions']}"
            }),
            "headers": {
                "Content-Type": "application/json"
            }
        }
        
    

    return response
