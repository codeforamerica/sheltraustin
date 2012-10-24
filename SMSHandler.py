from twilio.rest import TwilioRestClient
from twilio.rest import *
from twilio import TwilioRestException
import sys
import os



class SMSHandler():

	__acc_sid = (os.environ.get("TWILIO_ID"))
	__auth_token = (os.environ.get("TWILIO_KEY"))
	__from_number = (os.environ.get("TWILIO_NUMBER"))


	### recipient phone number is a string with the country code in front. e.g. +12345678900 for America
	def sendSMS(self, recipient, msgbody):
		if (len(msgbody) >= 160):
			return {"error":"Message must be less that 160 characters!"}
		try:
			client = TwilioRestClient(self.__acc_sid, self.__auth_token)
			message = client.sms.messages.create(to=recipient, from_=self.__from_number, body=msgbody)
			return {}
		except TwilioRestException:
			cla, exc, trbk = sys.exc_info()
			try:
				excArgs = exc.__dict__["args"]
			except KeyError:
				excArgs = "Unable to send SMS. Please check your phone number and try again"
			return {"error" : excArgs}