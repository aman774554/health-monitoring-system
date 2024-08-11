from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from transformers import pipeline
from bson.json_util import ObjectId

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client.health_monitoring
users_collection = db.users

nlp = pipeline('question-answering', model='deepset/roberta-base-squad2')

@app.route('/api/analyze_query', methods=['POST'])
def analyze_query():
    data = request.json
    question = data['question']
    context = data['context']
    
    result = nlp(question=question, context=context)
    return jsonify(result)


@app.route('/api/personalized_plan', methods=['POST'])
def personalized_plan():
    data = request.json
    name = data['name']
    age = int(data['age'])
    goals = data['goals']
    
    user = {
        "name": name,
        "age": age,
        "goals": goals
    }
    user_id = users_collection.insert_one(user).inserted_id
    
    health_plans = generate_health_plan(user)
    users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": {"health_plans": health_plans}})
    
    return jsonify(health_plans)

def generate_health_plan(user):
    age = user['age']
    goals = user['goals']
    
    if age < 18:
        context = (
            "The user is under 18 years old. Their health plan should focus on physical activities such as playing sports, "
            "eating a variety of healthy foods, and getting enough sleep. Additional recommendations include engaging in outdoor activities, "
            "avoiding sugary drinks, and maintaining a regular sleep schedule. Encourage the user to participate in team sports or group physical activities to enhance social skills. "
            "Additionally, advise on the importance of hydration and reducing screen time."
        )
    elif 18 <= age < 65:
        if goals == 'weight loss':
            context = (
                "The user is an adult with a goal of weight loss. Their health plan should incorporate cardio exercises like running or cycling, "
                "following a low-carb diet, and avoiding processed foods. Additional recommendations include strength training, monitoring caloric intake, "
                "and staying hydrated throughout the day. Emphasize the importance of portion control, regular meal timings, and incorporating high-fiber foods. "
                "Encourage the user to keep a food diary and to plan meals ahead. Stress the benefits of reducing sugar intake and managing stress through relaxation techniques."
            )
        elif goals == 'muscle gain':
            context = (
                "The user is an adult with a goal of muscle gain. Their health plan should focus on strength training, consuming high-protein foods, "
                "and ensuring adequate rest between workouts. Additional recommendations include maintaining a calorie surplus, incorporating compound exercises, "
                "and staying consistent with training. Suggest specific protein sources such as lean meats, dairy, legumes, and nuts. Advise on the importance of post-workout nutrition "
                "and staying hydrated. Highlight the benefits of sleep and recovery, and encourage tracking progress through measurements and photos."
            )
        else:
            context = (
                "The user is an adult with a general health goal. Their health plan should include regular exercise with a mix of cardio and strength training, "
                "eating a balanced diet rich in fruits and vegetables. Additional recommendations include practicing mindfulness or yoga, avoiding excessive alcohol, "
                "and ensuring regular health check-ups. Emphasize the importance of mental health and recommend activities such as meditation or hobbies. "
                "Advise on staying hydrated and the benefits of regular social interactions. Encourage the user to set achievable health goals and track their progress."
            )
    else:
        context = (
            "The user is 65 years old or older. Their health plan should engage in low-impact activities like walking or swimming, "
            "eating nutrient-dense foods, and ensuring adequate calcium and vitamin D intake. Additional recommendations include staying socially active, "
            "performing balance and flexibility exercises, and following up regularly with healthcare providers. Suggest specific exercises that enhance balance and prevent falls. "
            "Highlight the importance of mental stimulation through puzzles, reading, or learning new skills. Encourage regular health screenings and vaccinations. "
            "Advise on the benefits of a varied diet and staying connected with family and friends to combat loneliness."
        )
    questions = ["What should be the first health plan  that would be hard for the user?", "What would you recommend as a plan for a person that would be easy for him to do in your own language?"]
    result1 = nlp(question=questions[0], context=context)
    result2 = nlp(question=questions[1], context=context)
    
    plan1 = result1['answer']
    plan2 = result2['answer']
    
    return {"plan1": plan1, "plan2": plan2}

@app.route('/api/user_names', methods=['GET'])
def get_user_names():
    user_names = [user['name'] for user in users_collection.find()]
    return jsonify(user_names)

@app.route('/api/user_data', methods=['POST'])
def get_user_data():
    data = request.json
    user_name = data['user_name']
    user = users_collection.find_one({"name": user_name})
    if user:
        user['_id'] = str(user['_id'])
        return jsonify(user)
    else:
        return jsonify({"error": "User not found"}), 404
    
if __name__ == '__main__':
    app.run(debug=True)
