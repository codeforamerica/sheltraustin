from googlemaps import *
from pymongo import Connection
import simplejson as json
import os

# have current address and needs
# use db to get all places serving those needs
# Use google maps api to get distance to all those places using
# the mode of transport requested
# return a sorted array of all those places,
# include in the return JSON the google maps "route to the place"

class MapHandler():
    connection = Connection()
    all_documents = connection.austindb.austindb.find()
    # all_data key holds value that is created by a list comprehension -> make an array out of every doc in all_documents
    all_data_mongo = { "all_data" : [doc for doc in all_documents] }

    def clean_place_document(self, doc):
        doc['_id'] = 'abc' # should be able to mask _id when doing find against mongo!
        # these (lat, lon) could potentially be fields in the documents in the collection, but this is ok, too
        doc['latitude'] = doc['loc'][1] 
        doc['longitude'] = doc['loc'][0] 
        return doc
    
    #### first use the service needs to find all places in Austin that provide those needs

    def getAllServiceProviders(self, needs):
        # 'needs' is a json query object
        query = needs
        
        all_places = self.all_data_mongo["all_data"]
        own_location = self.getOwnLocation(query["address"])
        if (own_location == {}):
        	raise Exception("Fail: Couldn't get own location!")
        
        to_return = [own_location]
        result = {"result":[]}
        
        for place in all_places:
            # XXX: this is a bit nuts, refactor!
            if ((query["food"] == "true" and (('Y') in place["food"][0:3])) or 
                (query["medical"] == "true" and (('Y') in place["med_facility"][0:3] or 
                ('Y') in place["med_service"][0:3])) or 
                (query["mental-health"] == "true" and (('Y') in place["mental_health"][0:3])) or
                (query["bed"] == "true" and (('Y') in place["shelter"][0:3])) or
                (query["substance-abuse"] == "true" and (('Y') in place["subst_abuse_service"][0:3]))):
                place["transportation"] = query["transportation"]
                to_return.append(self.clean_place_document(place))

        result["result"] = to_return
        return result

    #### for all the service providers, get distance and route using google maps API using the mode of transport
    #### sort the service providers and make a JSON
    #### get location of address entered

    def getOwnLocation(self, addr):
        gmaps = GoogleMaps(os.environ.get("GOOGLE_KEY"))
        
        try:
       	    lat, lng = gmaps.address_to_latlng(addr)
            actual_address = gmaps.latlng_to_address(lat, lng)
            return {"latitude" : lat, "longitude" : lng, "name" : "HOME", "address" : actual_address, "properties" : {}}
        except GoogleMapsError:
	    return {}
