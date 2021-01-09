from django.core.mail import send_mail
from django.conf import settings

def mailcredits(amount, sender, recipient):
    send_mail(
        "You have recieved voting credits",
        f"You have recieved {amount} voting credits from {sender}!",
        settings.RXC_EMAIL,
        [recipient])

    send_mail(
        "You have sent voting credits",
        f"You have successfully sent {amount} voting credits to {recipient}!",
        settings.RXC_EMAIL,
        [sender])
