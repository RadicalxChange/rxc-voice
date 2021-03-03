import os
import math
from django.db.models.functions import Now

import sendgrid

from sendgrid.helpers.mail import *
from .models import Transfer, Delegate, MatchPayment


sendgrid_key = os.getenv('SENDGRID_API_KEY', 'NO API FOUND')
sg = sendgrid.SendGridAPIClient(sendgrid_key)
from_email = Email("voice@radicalxchange.org", 'RxC Voice')

def send_mail(_to_mail, subject, body):
    to_email = To(_to_mail)
    content = Content("text/html", body)
    mail = Mail(from_email, to_email, subject, content)
    response = sg.client.mail.send.post(request_body=mail.get())


def match_transfers(process, matching_pool):
    transfers = Transfer.objects.all().filter(process=process)

    # {recipient_id: {sender_id: amount}} => each recipient has a dict where the keys
    # are senders and the values are amounts
    distinct_contributions = {}

    # {recipient_id: amount} => the total amount contributed to each recipient
    pledged_totals = {}

    # {recipient_id: amount} => the sum of the roots of all distinct contributions to each recipient
    sum_of_roots = {}
    for transfer in transfers:
        if transfer.status == 'P':
            transfer.status = 'C'
            transfer.sender.credit_balance += transfer.amount
        elif transfer.status == 'A':
            transfer.recipient_object.credit_balance += transfer.amount
            transfer.recipient_object.save()
            if transfer.recipient_object.id in distinct_contributions and transfer.recipient_object.id in pledged_totals and transfer.recipient_object.id in sum_of_roots:
                if transfer.sender.id in distinct_contributions[transfer.recipient_object.id]:
                    sum_of_roots[transfer.recipient_object.id] -= math.sqrt(distinct_contributions[transfer.recipient_object.id][transfer.sender.id])
                    distinct_contributions[transfer.recipient_object.id][transfer.sender.id] += transfer.amount
                else:
                    distinct_contributions[transfer.recipient_object.id][transfer.sender.id] = transfer.amount
                pledged_totals[transfer.recipient_object.id] += transfer.amount
                sum_of_roots[transfer.recipient_object.id] += math.sqrt(distinct_contributions[transfer.recipient_object.id][transfer.sender.id])
            else:
                distinct_contributions[transfer.recipient_object.id] = {transfer.sender.id: transfer.amount}
                pledged_totals[transfer.recipient_object.id] = transfer.amount
                sum_of_roots[transfer.recipient_object.id] = math.sqrt(transfer.amount)
    raw_matches = {}
    raw_match_total = 0
    for recipient_id, sum in sum_of_roots.items():
        raw_match = (sum * sum) - float(pledged_totals[recipient_id])
        raw_matches[recipient_id] = raw_match
        raw_match_total += raw_match
    for recipient_id, raw_match in raw_matches.items():
        final_match = raw_match
        if raw_match_total > process.matching_pool:
            final_match = (raw_match / raw_match_total) * float(process.matching_pool)
        recipient_object = Delegate.objects.get(id=recipient_id)
        recipient_object.credit_balance += int(final_match)
        recipient_object.save()
        # create a record of this match payment.
        match_payment = MatchPayment(
            recipient=recipient_object,
            amount=int(final_match),
            date=Now(),
            process=process,
            )
        match_payment.save()
    process.matching_pool = 0
    process.save()
