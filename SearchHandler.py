import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import simplejson
from QueryHandler import QueryHandler

class SearchHandler(tornado.web.RequestHandler):
	@tornado.web.asynchronous
	def get(self, data):
		print data
		if not data:
			self.render('index.html')

		output = QueryHandler.get_map(data)

		self.write(output)
		self.flush()
		self.finish()
