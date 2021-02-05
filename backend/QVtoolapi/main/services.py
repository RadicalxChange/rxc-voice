import os
import math

import sendgrid

from sendgrid.helpers.mail import *
from .models import Transfer, Delegate


sendgrid_key = os.getenv('SENDGRID_API_KEY', 'NO API FOUND')
sg = sendgrid.SendGridAPIClient(sendgrid_key)
from_email = Email("acrandaccio@gmail.com", 'Alex via Sendgrid')

def send_mail(_to_mail, subject, body):
    to_email = To(_to_mail)
    content = Content("text/html", body)
    mail = Mail(from_email, to_email, subject, content)
    response = sg.client.mail.send.post(request_body=mail.get())


def match_transfers(process, matching_pool):
    transfers = Transfer.objects.all().filter(process=process)

    # {recipient: {sender: amount}} => each recipient has a dict where the keys
    # are senders and the values are amounts
    distinct_contributions = {}

    # {recipient: amount} => the total amount contributed to each recipient
    pledged_totals = {}

    # {recipient: amount} => the sum of the roots of all distinct contributions to each recipient
    sum_of_roots = {}
    for transfer in transfers:
        if transfer.status == 'P':
            transfer.status = 'C'
            transfer.sender.credit_balance += transfer.amount
        elif transfer.status == 'A':
            if transfer.recipient in distinct_contributions and transfer.recipient in pledged_totals and transfer.recipient in sum_of_roots:
                if transfer.sender in distinct_contributions[transfer.recipient]:
                    sum_of_roots[transfer.recipient] -= math.sqrt(distinct_contributions[transfer.recipient][transfer.sender])
                    distinct_contributions[transfer.recipient][transfer.sender] += transfer.amount
                else:
                    distinct_contributions[transfer.recipient][transfer.sender] = transfer.amount
                pledged_totals[transfer.recipient] += transfer.amount
                sum_of_roots[transfer.recipient] += math.sqrt(distinct_contributions[transfer.recipient][transfer.sender])
            else:
                distinct_contributions[transfer.recipient] = {transfer.sender: transfer.amount}
                pledged_totals[transfer.recipient] = transfer.amount
                sum_of_roots[transfer.recipient] = math.sqrt(transfer.amount)
    raw_matches = {}
    raw_match_total = 0
    for recipient, sum in sum_of_roots.items():
        raw_match = (sum * sum) - float(pledged_totals[recipient])
        raw_matches[recipient] = raw_match
        raw_match_total += raw_match
    for recipient, raw_match in raw_matches.items():
        final_match = raw_match
        if raw_match_total > process.matching_pool:
            final_match = (raw_match / raw_match_total) * process.matching_pool
        recipient_delegate = Delegate.objects.get(public_username=recipient)
        recipient_delegate.credit_balance += int(final_match)
        recipient_delegate.save()
    process.matching_pool = 0
    process.save()
