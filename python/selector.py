import numpy as np
import pickle
import random

# 군집화 데이터(pickle 파일의 경로)
#pk_path = 'C:/Users/cbnm9/Downloads/python/data/clusters.pickle'
pk_path = './data/clusters.pickle'
# Selector 클래스 - 군집화 데이터에 대한 선택 작업하는 객체
class Selector:

    # Selector 객체 생성
    def __init__(self):
        self.clusters  = self.load_clusters(path=pk_path)
        self.all_files = self.set_all_files()
        self.noc       = len(self.clusters)

    # 저장된 군집화 데이터 가져오기(사전구조)
    def load_clusters(self, path):
        with open(path, 'rb') as f:
            data = pickle.load(f)
        return data

    # all_files 변수
    def set_all_files(self):
        # self.all_files 는 사전 자료구조
        d={}

        # clusters 의 각 클래스 별 모든 항목에 대해 수행
        for k, v in self.clusters.items():
            for n in v:
                d[n] = k

        return d

    # 불러온 군집화 데이터 출력해보기
    def print_clusters(self):
        if not self.clusters: return None
        # clusters 는 list 를 요소로 가지는 사전 구조
        # 먼저 clusters의 모든 키 값을 정렬하기
        keys=[]
        for key in self.clusters.keys():
            keys.append(key)
        keys.sort()

        # 클러스터의 결과 모든 아이템에 대해 반복 출력
        for i in keys:
            print('{}: {}'.format(i, self.clusters[i]))

    def make_numbs(self, pre_list, num):
        numbs = []

        # pre_list가 안주어졌을 때 아래 4줄만 동작하고 반환
        if not pre_list:
            # pre_list 안 주어짐: 추천할 파일 갯수 = 추천할 갯수 / 클래스 수(균일)
            print('Not selected recommend')
            need = num // self.noc
            for _ in range(self.noc): numbs.append(need)
            return numbs
        
        # 이곳이 실행된다면 pre_list가 주어진 것
        print('Selected recommend')
        # pre_list에 대해 각 클래스가 몇개씩 선택됬는지 확인
        sel = [0]*self.noc
        lol = len(pre_list)
        for name in pre_list:
            name=int(name)
            sel[self.all_files[name]] += 1
        
        print('sel count: ', sel)

        # sel 중 0의 값을 가진것이 있는지 확인
        cnt = 0
        for n in sel:
            if n == 0: cnt += 1

        print('empty sum: ', cnt)

        # 추천할 갯수 조정
        # 선택되지 않은 클래스에서도 2개씩은 추천으로 보여주는 것이 좋다
        num -= cnt*2

        # 각 클래스 별 추천할 갯수 지정 + 가장 많이 선택된 클래스 찾기
        max_sel = 0
        max_i = 0
        for i in range(len(sel)):
            # 가장 많이 선택된 클래스 찾기
            if sel[i] > max_sel:
                max_sel = sel[i]
                max_i = i
            # 각 클래스 별 추천할 갯수 지정
            sel[i] = (sel[i]*num)//lol

        # 만약 위 계산으로 각 클래스 별 추천 총 합이 num이 안된다면
        # 부족한 만큼 가장 많이 선택한 클래스에 몰아주기
        if sum(sel) < num:
            a = num - sum(sel)
            sel[max_i] += a

        # numbs 만들기
        for i in range(len(sel)):
            n = sel[i]
            if n == 0: numbs.append(2)
            else     : numbs.append(n)

        return numbs

    def make_names(self, numbs):
        names=[]

        for i in range(self.noc):
            print(str(i) + 'class: ' + str(numbs[i]))
            sample = random.sample(self.clusters[i], numbs[i])
            names += sample

        return list(map(str, names))

    # 입력받은 리스트에 대해 파일 이름 리스트를 만들어 반환하는 함수
    def get_list(self, pre_list=None, num=50):
        numbs=[]
        names=[]

        print('------<get_list>-------')
        # pre_list 여부에 따라 각 클래스 별 추천할 파일 갯수 지정
        numbs = self.make_numbs(pre_list = pre_list, num = num)
        print('-  -  -  -  -  -  -  - ')
        # 위에서 지정한 파일 갯수를 사용해 추천할 파일목록 만들기
        names = self.make_names(numbs = numbs)
        print('-  -  -  -  -  -  -  - ')
        
        # 추천할 파일 이름 리스트 반환
        return names
    def get_dict(self, pre_list=None, num=50):
        numbs=[]
        names=[]

        print('------<get_list>-------')
        # pre_list 여부에 따라 각 클래스 별 추천할 파일 갯수 지정
        numbs = self.make_numbs(pre_list = pre_list, num = num)
        print('-  -  -  -  -  -  -  - ')
        # 위에서 지정한 파일 갯수를 사용해 추천할 파일목록 만들기
        names = self.make_names(numbs = numbs)
        print('-  -  -  -  -  -  -  - ')
        data = {
            "recommend": names,
            "numb":numbs
        }
        # 추천할 파일 이름 리스트 반환
        return data

# 저장된 군집화 데이터 가져오고, 화면에 출력해보기
if __name__ == '__main__':
    obj=Selector()
    obj.print_clusters()
