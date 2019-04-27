from url import Url

class FreeCss(Url):

    def __init__(self):
        super().__init__("https://www.free-css.com/")
        self.templateSelect = '#showcase > ul > li > figure > a'
        self.pageSelect = '#content > div.pagination.toppag > ul > li.next.last > a'
        self.downSelect = '#prevdetails > div.buttons > ul > li.dld > a'

    def __init__(self, path):
        super().__init__("https://www.free-css.com",path)
        self.templateSelect = '#showcase > ul > li > figure > a'
        self.pageSelect = '#content > div.pagination.toppag > ul > li.next.last > a'
        self.downSelect = '#prevdetails > div.buttons > ul > li.dld > a'

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
