import os

import sendgrid

from sendgrid.helpers.mail import *


sendgrid_key = os.getenv('SENDGRID_API_KEY', 'NO API FOUND')
sg = sendgrid.SendGridAPIClient(sendgrid_key)
from_email = Email("acrandaccio@gmail.com", 'Alex via Sendgrid')

def send_mail(_to_mail, subject, body):
    to_email = To(_to_mail)
    content = Content("text/html", body)
    mail = Mail(from_email, to_email, subject, content)
    response = sg.client.mail.send.post(request_body=mail.get())
