import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

class SearchHandler(tornado.web.RequestHandler):
  @tornado.web.asynchronous
    def get(self):
        self.render('index.html')
