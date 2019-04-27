import requests
import os
from bs4 import BeautifulSoup
from url import Url
from FreeCss import FreeCss
from templated import Templated
import sys
def getLink(url):
	s = requests.Session()
	downList = []
	while True:
		req = s.get(url.getUrl())
		html = req.text
		soup = BeautifulSoup(html, 'html.parser')
		link = soup.select(url.getPageSelect())
		templateList = soup.select(url.getTemplateSelect())
		for _,item in enumerate(templateList):
			downList.append(templateLink(objectSelect(item.get('href'))))
		if link:
			url = objectSelect(link[0].get('href'))
		else:
			break
		downListWrite(downList)
def downListWrite(downList):
    file = open('download.txt', 'w', encoding='utf8')
    for _,item in enumerate(downList):
        file.write(item.getUrl())
    file.close()

def templateLink(url):
	s = requests.Session()
	req = s.get(url.getUrl())
	html = req.text

	soup = BeautifulSoup(html, 'html.parser')
	downLink = soup.select(url.getDownSelect())
	link = objectSelect(downLink[0].get('href'))
	print(link)
	if "Free-Css" in type(url).__name__:
		download(link,downLink[0].get('download'))
	elif "Templated" in type(url).__name__:
		download(link, downLink[0].get('href').replace("/download","")+".zip")
	return link

def objectSelect(href):
	if "free-css-templates" in href:
		return FreeCss(href)
	else:
		return Templated(href)

def download(url, name):
	if os.path.exists('./zip/'+name):
		return
	with open('./zip/'+name, "wb") as file:  # open in binary mode
		res = requests.get(url.getUrl())  # get request
		file.write(res.content)
if __name__ == "__main__":
	href = None
	print("1.Free-Css")
	print("2.Templated")
	for line in sys.stdin:
		if int(line) == 1:
			href = '/free-css-templates/'
		elif int(line) == 2:
			href = ''
		else:
			break
		getLink(objectSelect(href))

'''
# HTTP GET Request
s = requests.Session()
req = s.get('https://www.free-css.com/free-css-templates/')
html = req.text
# BeautifulSoup으로 html소스를 python객체로 변환하기
# 첫 인자는 html소스코드, 두 번째 인자는 어떤 parser를 이용할지 명시.
# 이 글에서는 Python 내장 html.parser를 이용했다.
soup = BeautifulSoup(html, 'html.parser')
templateList = soup.select('#showcase > ul > li > figure > a')

for item in enumerate(templateList):
	templateLink(item.get('href'))
'''
