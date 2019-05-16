import pymysql


class Database():
    def __init__(self):
        # DB 연결 설정
        self.db = pymysql.connect(host='localhost',
                                  user='root',
                                  password='',
                                  db='aws',
                                  charset='utf8')
        self.cursor = self.db.cursor(pymysql.cursors.DictCursor)

    def execute(self, query, args={}):
        try:
            self.cursor.execute(query, args)
        finally:
            self.db.close()

    def executeOne(self, query, args={}):
        try:
            self.cursor.execute(query, args)
            row = self.cursor.fetchone()
        finally:
            self.db.close()
        return row

    def executeAll(self, query, args={}):
        try:
            self.cursor.execute(query, args)
            row = self.cursor.fetchall()
        finally:
            self.db.close()
        return row
    def commit(self):
        self.db.commit()