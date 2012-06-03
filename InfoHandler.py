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

		email = ''
		phone = ''
		direction = ''

		if 'email' in self.request.arguments:
			email = self.request.arguments['email'][0]

		if 'phone' in self.request.arguments:
			phone = self.request.arguments['phone'][0]

		if 'direction' in self.request.arguments:
			direction = self.request.arguments['direction'][0]

		print email
		email_results = {}
		phone_results = {}

		if not phone=='':
			phone_results = QueryHandler.get_sms(phone, direction)

		if not email=='':
			email_results = QueryHandler.get_email(email, direction)


		output = {
			'email': email_results,
			'phone': phone_results
		}
		
		self.write(output)
		self.flush()
		self.finish()