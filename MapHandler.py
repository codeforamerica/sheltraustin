from googlemaps import *
from pymongo import Connection
import simplejson as json
import os
import math

# have current address and needs
# use db to get all places serving those needs
# Use google maps api to get distance to all those places using
# the mode of transport requested
# return a sorted array of all those places,
# include in the return JSON the google maps "route to the place"

class MapHandler():

    earth_radius_in_miles = 3959.0
    radians_to_degrees = 180.0 / math.pi
    # XXX  always 1 mile for now need to add interface switch to support different values
    # replace 1 with a number based on what user selects on front page
    radius_1_mile = (1 / earth_radius_in_miles) * radians_to_degrees

    def clean_place_document(self, doc):
        # (ObjectId afldkjfa;ldkjf) causes json parser to barf later, we change it to 'abc' for now
        doc['_id'] = 'abc' # XXX should be able to mask _id when doing find against mongo!
        # XXX these (lat, lon) could potentially be fields in the documents in the collection, but this is ok, too
        doc['latitude'] = doc['loc'][1] 
        doc['longitude'] = doc['loc'][0] 
        return doc
    
    #### first use the service needs to find all places in Austin that provide those needs

    def getAllServiceProviders(self, needs):
        # 'needs' is a json query object
        query = needs
        
        own_location = self.getOwnLocation(query["address"])
        if (own_location == {}):
        	raise Exception("Fail: Couldn't get own location!")
        to_return = [own_location]
        result = {"result":[]}
       
        # XXX refactor!
        connection = Connection(os.environ['MONGOHQ_URL'])
        # XXX if client asks for geospatial limit of results, then we use find with a boundary filter
        lat = own_location['latitude']
        long = own_location['longitude']
        all_documents = connection[os.environ['DATABASE_NAME']].austindb.find({"loc": {"$within": {"$center": [[long, lat], self.radius_1_mile]}} })
        # all_data key holds value that is created by a list comprehension -> make an array out of every doc in all_documents
        all_data_mongo = { "all_data" : [doc for doc in all_documents] }
        all_places = all_data_mongo["all_data"] 
 
        for place in all_places:
            # XXX: this is a bit nuts, refactor!
            if ((query["food"] == "true" and (('Y') in place["food"][0:3])) or (query["medical"] == "true" and (('Y') in place["med_facility"][0:3] or ('Y') in place["med_service"][0:3])) or 
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
