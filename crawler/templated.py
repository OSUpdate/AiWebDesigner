from url import Url

class Templated(Url):
    def __init__(self):
        super().__init__("https://templated.co")
        self.templateSelect = '#main > div > div > article > footer > div > ul > li:last-child > a'
        self.pageSelect = '#main > ul > li:last-child > a'
        self.downSelect = '# demo-header > ul > li:nth-child(1) > a'

    def __init__(self, path):
        super().__init__("https://templated.co",path)
        self.templateSelect = '#main > div > div > article > footer > div > ul > li:last-child > a'
        self.pageSelect = '#main > ul > li:last-child > a'
        self.downSelect = '#demo-header > ul > li:nth-child(1) > a'

    def __str__(self):
        return "{}".format(self.host + self.path)
    def getUrl(self):
        return self.host+self.path
    def getHost(self):
        return self.host
    def getPath(self):
        return self.path
    def getPageSelect(self):
        return self.pageSelect
    def getDownSelect(self):
        return self.downSelect
    def getTemplateSelect(self):
        return self.templateSelect
