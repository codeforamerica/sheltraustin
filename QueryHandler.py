import simplejson, urllib
from MapHandler import MapHandler
from SMSHandler import SMSHandler
from EmailHandler import EmailHandler

class QueryHandler(object):

	PLACES_API_KEY = 'AIzaSyBJkj3-NuYVzkQ1b3rhSAfLflcF96R8EFQ'


	@classmethod
	def get_map(self, json):
		"""Return the Google Maps API JSON Object."""
		mp = MapHandler()
		map_json = mp.getAllServiceProviders(json)
		return map_json

	@classmethod
	def get_addresses(self, json):
		"""Return the potential autocomplete addresses."""
		address = json['address']
		url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=%s&types=geocode&components=country:us&language=en&sensor=true&key=%s' % (address, self.PLACES_API_KEY)
		google_results = simplejson.load(urllib.urlopen(url))
		output = {
			'addresses': []
		}
		for location in google_results['predictions']:
			description = location['description']
			output['addresses'].append(description)
		# endfor location
		return output

	@classmethod
	def get_sms(self, recipient, msgbody):
		sh = SMSHandler()
		return sh.sendSMS(recipient,msgbody)

	@classmethod
	def get_email(self, recipient, msgbody):
		eh = EmailHandler()
		return eh.sendEmail(recipient, msgbody)