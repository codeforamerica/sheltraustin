from twilio.rest import TwilioRestClient
from twilio.rest import *
from twilio import TwilioRestException
import sys

class SMSHandler():

	__acc_sid = "ACdb07be7ec055480abc23a729c943a344"
	__auth_token = "8183fe8d7683f9954d3a24fa656be44d"
	__from_number = "+14155992671"


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