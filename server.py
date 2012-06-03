import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import os.path

from SearchHandler import SearchHandler
from AutocompleteHandler import AutocompleteHandler
from DetailsHandler import DetailsHandler
from tornado.options import define, options

define("port", default=8888, help="run on the given port", type=int)

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", DefaultHandler),
            (r"/find*",AutocompleteHandler),
            (r"/search*", SearchHandler)
        ]
        settings = dict(
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            handler_path=os.path.join(os.path.dirname(__file__), "handlers"),
            xsrf_cookies=True,
            autoescape="xhtml_escape",
        )
        tornado.web.Application.__init__(self, handlers, **settings)


class DefaultHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def get(self):
        self.render('index.html')

def main():
    tornado.options.parse_command_line()
    app = Application()
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()