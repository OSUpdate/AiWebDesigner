from flask import Flask, request, jsonify
from flaskext.mysql import MySQL
import selector
import os
import json
import random

# 서버의 동작에 사용되는 객체들
app = Flask(__name__)
mysql = MySQL()
sel = selector.Selector()
print('-- object create complete --')

# 디비 연결 아이디
app.config['MYSQL_DATABASE_USER'] = ""
# 디비 연결 비밀번호
app.config['MYSQL_DATABASE_PASSWORD'] = ""
# 연결할 디비
app.config['MYSQL_DATABASE_DB'] = ""
    
templates = []
images = []

mysql.init_app(app)

def search(dirname):
    filenames = os.listdir(dirname)
    for filename in filenames:
        if filename == ".DS_Store":
            continue
        templates.append(filename)
        images.append("png/"+filename+".png")
def userDir(user):
    fileList = os.listdir("/Users/cbnm9/Downloads/nodejs/user"+user)
    #fileList = os.listdir("/Users/HSJMac/Documents/nodejs/user/"+user)
    return list(filter(lambda x: x if x.isdigit() else False, fileList))
def getRecommend(pre_list=None): #============================================ 여기가 추천 템플릿 만들어주는 곳
    #인공지능 추천 템플릿을 가져옴
    # 추천 템플릿의 이름 리스트를 줌
    '''
    recommend = []
    for i in range(0,9):
        recommend.append(templates[random.randint(1,342)])
    '''
    # 추천 템플릿의 숫자 이름들 반환
    recommend = []
    recommend = sel.get_list(pre_list=pre_list, num=50)
    
    '''
    for i in range(0,9):
        names.append(random.randint(1,342))
    '''
    
    # 추천 템플릿 리스트 만들기
    '''
    recommend = []
    for name in names:
        recommend.append(templates[name])
    '''
    
    print('recommend: ', recommend)

    return recommend

def getPngs(names):
    pngs=[]

    for name in names:
        pngs.append("png/"+name+".png")

    return pngs

@app.route("/api/get/<token>", methods=['POST'])
def recommend(token):
    userList = userDir(request.get_json(silent=True)['request']['user']) #사용자가 작업한 템플릿 이름 리스트
    print()
    print('---<first_recommend>---')
    data = {
        "Response": {
            "response": {
                "result": True,
                "recommend": getRecommend()
            }
        }
    }
    print('-----------------------')
    print()
    json_data = json.dumps(data)
    return json_data

@app.route("/api/templates/<token>", methods=['POST'])
def get(token):
    #request.get_json() #요청온 json 꺼냄
    #request.get_json(silent=True)
    #conn = mysql.connect()
    #cursor = conn.cursor()
    #cursor.execute() # select 문으로 조회

    #cursor.callproc("함수명", 인자) 데이터베이스에 저장된 프로시저(함수) 이용할 경우

    #data = cursor.fetchall() #결과값을 받아옴
    '''
    #성공시 실행
    if len(data) > 0:
        templates = [1, 2, 3, 4]
        images = [1, 2, 3, 4]
        data = {
            "Response": {
                "response": {
                    "result": True,
                    "templates": templates,
                    "image": images
                }
            }
        }
        json_data = json.dumps(data)
        return json_data

    #동일한 토큰값이 없을 경우 실행
    data = {
        "Response": {
            "response": {
                "result": False,
            }
        }
    }
    json_data = json.dumps(data)
    return json_data
    '''
    '''
    try:
        if not request.is_json:
            raise DataValidationError('Invalid payment: Content Type is not json')
        data = request.get_json()
    except DataValidationError as e:
        fail = {
            "Response": {
                "response": {
                    "result": False
                }
            }
        }
        json_data = json.dumps(fail)
        return json_data

    '''
    print()
    print('-<selected_recommend>--')
    
    select = (request.get_json(silent=True))['request']['name']
    userList = userDir(request.get_json(silent=True)['request']['user']) #사용자가 작업한 템플릿 이름 리스트
    data = list(set(userList + select)) # 사용자 작업한 템플릿과 사용자가 선택한 배열에서 중복요소 
    print('selected templates: ', select)
    
    recommend = getRecommend(select)
    pngs = getPngs(recommend)

    #템플릿 관련 정보 파일이름형태로 전송
    #templates = ["1.html","2.html","3.html","4.html","5.html","6.html","7.html","8.html","9.html","10.html"]
    #images = ["img/src/1.jpg","img/src/2.jpg","img/src/3.jpg","img/src/4.jpg","img/src/5.jpg","img/src/6.jpg","img/src/7.jpg","img/src/8.jpg","img/src/9.jpg","img/src/10.jpg"]
    
    data = {
        "Response":{
            "response":{
                "result":True,
                "templates":recommend,
                "images":pngs
            }
        }
    }
    print('-----------------------')
    json_data = json.dumps(data)
    return json_data

@app.route("/api/save/<token>", methods=['POST'])
def set(token):
    #conn = mysql.connect()
    #cursor = conn.cursor()
    #cursor.execute() # select 문으로 조회

    #cursor.callproc("함수명", 인자) 데이터베이스에 저장된 프로시저(함수) 이용할 경우

    #data = cursor.fetchall() #결과값을 받아옴
    '''
    #성공시 실행
    if len(data) > 0:
        templates = [1, 2, 3, 4]
        images = [1, 2, 3, 4]
        data = {
            "Response": {
                "response": {
                    "result": True,
                    "templates": templates,
                    "image": images
                }
            }
        }
        json_data = json.dumps(data)
        return json_data

    #동일한 토큰값이 없을 경우 실행
    data = {
        "Response": {
            "response": {
                "result": False,
            }
        }
    }
    json_data = json.dumps(data)
    return json_data
    '''
    print(request.json)

    #템플릿 관련 정보 파일이름형태로 전송
    data = {
        "Response":{
            "response":{
                "result":True,
            }
        }
    }
    json_data = json.dumps(data)
    return json_data

if __name__ == "__main__":
    #search("/Users/HSJMac/Documents/nodejs/routes/api/Templates")
    search("/Users/cbnm9/Downloads/nodejs/routes/api/Templates")
    print('-- search complete --')

    app.run(host="0.0.0.0",port=4000, debug=True)
