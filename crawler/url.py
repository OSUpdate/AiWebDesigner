from abc import *

class Url(metaclass=ABCMeta):
    def __init__(self, host):
        self.host = host
        self.path = ""

    def __init__(self, host, path):
        self.host = host
        self.path = path
    def __str__(self):
        return "".format(self.host + self.path)

    @abstractmethod
    def getHost(self):
        pass

    @abstractmethod
    def getPath(self):
        pass

    @abstractmethod
    def getUrl(self):
        pass

    @abstractmethod
    def getPageSelect(self):
        pass

    @abstractmethod
    def getDownSelect(self):
        pass

    @abstractmethod
    def getTemplateSelect(self):
        pass
