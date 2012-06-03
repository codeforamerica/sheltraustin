# Import smtplib for the actual sending function
import smtplib
from smtplib import SMTPException

# Import the email modules we'll need
from email.mime.text import MIMEText

class EmailHandler():

	#usrnme = "sheltratx@gmail.com"
	#pswd = "rhok2012"

	def sendEmail(self, recipient, msgbody):
		usrnme = "sheltraustin@gmail.com"
		pswd = "rhok2012"

		msg = "Directions for you:   " + msgbody

		# Send the message via our own SMTP server, but don't include the
		# envelope header.
		try:
			server = smtplib.SMTP('smtp.gmail.com:587')
			server.ehlo()
			server.starttls()
			server.login(usrnme, pswd)
			server.sendmail(usrnme, recipient, msg)
			server.quit()
			return {}
		except SMTPException:
			print "error in sending email"
			return {"error" : "Error in sending email. Please check the receiver email and try again."}