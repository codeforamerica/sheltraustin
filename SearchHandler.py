import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import simplejson
from QueryHandler import QueryHandler

class SearchHandler(tornado.web.RequestHandler):
	@tornado.web.asynchronous
	def get(self):
		if not self.request.arguments:
			self.render('index.html')

		address = self.request.arguments['address'][0]
		bed = self.request.arguments['bed'][0]
		food = self.request.arguments['food'][0]
		medical = self.request.arguments['medical'][0]
		mental_health = {
			'option1': self.request.arguments['mental-health[option1]'][0],
			'option2': self.request.arguments['mental-health[option2]'][0]
		}
		transportation = self.request.arguments['transportation'][0]
		data = {
			'address': address,
			'bed': bed,
			'food': food,
			'medical': medical,
			'mental-health': mental_health,
			'transportation': transportation
		}


		output = QueryHandler.get_map(data)

		self.write(output)
		self.flush()
		self.finish()
