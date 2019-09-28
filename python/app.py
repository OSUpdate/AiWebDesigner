from flask import Flask, request, jsonify
from flaskext.mysql import MySQL
import selector
import os
import json
from database import Database
import random

# 서버의 동작에 사용되는 객체들
app = Flask(__name__)
mysql = MySQL()
sel = selector.Selector()
print('-- object create complete --')

# 템플릿의 이름들이 저장될 리스트
templates = []
# 템플릿 스크린샷의 이름들이 저장될 리스트
images = []

# 서버와 DB 연결
mysql.init_app(app)

# 토큰으로 DB를 조회해 UID 얻기
def getUid(token):
    db = Database()
    sql = "select uid from logged where token = %s"
    row = db.executeOne(sql, token)
    return row

# 템플릿과 스크린샷을 찾아서 리스트에 넣기
def search(dirname):
    filenames = os.listdir(dirname)
    for filename in filenames:
        if filename == ".DS_Store":
            continue
        templates.append(filename)
        images.append("png/"+filename+".png")

# 사용자의 작업했던 파일 리스트 반환
def userDir(user):
    fileList = os.listdir("../nodejs/user/"+user)
    return list(filter(lambda x: x if x.isdigit() else False, fileList))

# 제공되는 선택 기록에 따라 추천 템플릿의 이름 리스트 반환
def getRecommend(pre_list=None):
    # 추천 템플릿의 숫자 이름들 반환
    recommend = []
    data = sel.get_dict(pre_list=pre_list, num=50)
    print(data)
    
    return data

# 인자로 받은 템플릿들에 대한 스크린샷 이름 리스트 반환
def getPngs(names):
    pngs=[]

    for name in names:
        pngs.append("png/"+name+".png")

    return pngs

# 사용자가 로그인시 처음으로 추천하는 템플릿 리스트 만들어주는 부분
@app.route("/api/get/<token>", methods=['POST'])
def recommend(token):
    # 사용자의 UID 얻기
    uid = getUid(token)
    if not uid['uid']:
        data = {
            "Response": {
                "response": {
                    "result": False
                }
            }
        }
        json_data = json.dumps(data)
        return json_data

    # 사용자의 작업하던 템플릿 리스트 가져오기
    userList = userDir(request.get_json(silent=True)['request']['user'])
    print()
    print('---<first_recommend>---')
    # 사용자의 작업하던 템플릿 리스트 정보를 통해 추천할 템플릿 리스트 만들기
    data = {
        "Response": {
            "response": {
                "result": True,
                "data": getRecommend(userList)
            }
        }
    }
    print('-----------------------')
    print()
    json_data = json.dumps(data)
    return json_data

# 여러 디자인 선택한 정보로 추천 템플릿 리스트 만들기
@app.route("/api/templates/<token>", methods=['POST'])
def get(token):
    # 사용자의 UID 얻기
    uid = getUid(token)
    if not uid['uid']:
        data = {
            "Response": {
                "response": {
                    "result": False
                }
            }
        }
        json_data = json.dumps(data)
        return json_data

    print()
    print('-<selected_recommend>--')
    # 사용자가 선택한 여러개의 템플릿 이름 리스트 얻기
    select = (request.get_json(silent=True))['request']['name']
    print('selected templates: ', select)
    # 사용자의 선택 정보를 통해 추천 템플릿 리스트 만들기
    recommend = getRecommend(select)
    # 추천 템플릿 리스트에 따른 스크린샷 리스트 만들기
    pngs = getPngs(recommend['recommend'])
    # 추천 템플릿 리스트와 스크린샷 리스트를 JSON 형식으로 만들기
    data = {
        "Response":{
            "response":{
                "result":True,
                "data":recommend,
                "images":pngs
            }
        }
    }
    print('-----------------------')
    json_data = json.dumps(data)
    return json_data

@app.route("/api/save/<token>", methods=['POST'])
def set(token):
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
    #search("/Users/cbnm9/Downloads/nodejs/routes/api/Templates")
    search("../nodejs/routes/api/Templates")
    print('-- search complete --')

    app.run(host="0.0.0.0",port=4000, debug=True)
