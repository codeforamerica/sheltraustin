import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import simplejson
from QueryHandler import QueryHandler

class InfoHandler(tornado.web.RequestHandler):
	@tornado.web.asynchronous
	def get(self):
		if not self.request.arguments:
			self.render('index.html')
			return

		email = self.request.arguments['email'][0]
		phone = self.request.arguments['phone'][0]
		direction = self.request.arguments['direction'][0]

		email_results = {}
		phone_results = {}

		if not phone=='':
			phone_results = QueryHandler.get_sms(phone, direction)


		output = {
			'email': email_results,
			'phone': phone_results
		}
		
		self.write(output)
		self.flush()
		self.finish()