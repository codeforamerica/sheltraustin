import simplejson, urllib

class QueryHandler(object):

	PLACES_API_KEY = 'AIzaSyCRpvPaJ4jxbZOlAY_PJeneYdHuC_cR-yk'


	@classmethod
	def get_map(self, json):
		"""Return the Google Maps API JSON Object."""
		print json
		map_json = {
			'awesome': 'sauce'
		}
		return map_json

	@classmethod
	def get_addresses(self, json):
		"""Return the potential autocomplete addresses."""
		address = json['address']
		url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=%s&types=geocode&language=en&sensor=true&key=%s' % (address, self.PLACES_API_KEY)
		google_results = simplejson.load(urllib.urlopen(url))
		output = {
			'addresses': []
		}
		for location in google_results['predictions']:
			description = location['description']
			output['addresses'].append(description)
		# endfor location
		return output