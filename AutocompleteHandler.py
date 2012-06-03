

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import simplejson
from QueryHandler import QueryHandler

class AutocompleteHandler(tornado.web.RequestHandler):
	@tornado.web.asynchronous
	def get(self):
		if not self.request.arguments or self.request.arguments=={}:
			self.render('index.html')
			return
		if not 'address' in self.request.arguments.keys():
			self.render('index.html')
			return
		address = self.request.arguments['address'][0]
		data = {
			'address': address
		}
		output = QueryHandler.get_addresses(data)

		self.write(output)
		self.flush()
		self.finish()