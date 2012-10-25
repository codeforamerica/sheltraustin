Use Sheltr to locate nearby homeless shelters

Sheltr Austin
=============
At the Random Hacks of Kindness event in June 2012, we created a version of this app in Python that has the same basic functionality with some add-ons. It allows you to search for locations by distance, receive results of different types of services (food, shelter, etc.), then see those results on a map. By clicking one of the results, directions via the Google Maps API will appear. Also, clicking on a result shows a popup that allows you to enter an email or phone number to receive via email or text message (using Twilio) the location's name and address.

The original version of this app was created in Node.js and can be found <a href="https://github.com/sheltr/sheltr">here</a>. It is slightly different, compare <a href="http://www.sheltr.org">sheltr.org</a> with <a href="austin.sheltr.org">austin.sheltr.org</a>.

Table of Contents
-----------------
* [Getting started](#getting-started)
* [Team](#team)

Sheltr Austin is a <a href="http://www.rhok.org/problems/sheltr-project-austin"> RHoK Austin (2012) </a> project.

<a name="getting-started">Getting Started</a>
----
The project is built in Python using the Tornado server. You can see it in action at <a href="http://austin.sheltr.org/"> which is running on Heroku. 

Creating a Heroku account is free and easy. The only Heroku add-on is the MongoHQ add-on (free) in Heroku to store your data. You might wish to use these <a href="https://github.com/mikedory/Tornado-Heroku-Helpers">Tornado Heroku Helpers</a> to automate deployment initially.

The project uses a few external APIs, you'll want to set these up as <a href="https://devcenter.heroku.com/articles/config-vars">environment variables</a> locally for testing and on Heroku. In the app, these are located and named as follows:

EmailHandler.py:
usrnme = "youremail@email.com"
pswd = (os.environ.get("SHELTR_PASS"))

MapHandler.py:
connection = Connection(os.environ['MONGOHQ_URL'])
all_documents = connection[os.environ['DATABASE_NAME']].austindb.find({"loc": {"$within": 
gmaps = GoogleMaps(os.environ.get("GOOGLE_KEY"))

QueryHandler.py:
PLACES_API_KEY = (os.environ.get("GOOGLE_KEY"))

SMSHandler.py:
__acc_sid = (os.environ.get("TWILIO_ID"))
__auth_token = (os.environ.get("TWILIO_KEY"))
__from_number = (os.environ.get("TWILIO_NUMBER"))

Each requires creation of the appropriate credentials with each service - Google Places, Twilio. The MongoHQ_URL comes from Heroku, and the SHELTR_PASS is your email password (used to send a location's information to users).

<a name="team">Team</a>
----
1. Rishi Bajekal [rishi.bajekal@gmail.com] 
1. Efe Karakus [efekarakus@gmail.com]
1. Joe Merante [joe@codeforamerica.org]
1. Nikhil Tibrewal [1803.nikhil@gmail.com]
1. Susan Wang [susan101566@gmail.com]
