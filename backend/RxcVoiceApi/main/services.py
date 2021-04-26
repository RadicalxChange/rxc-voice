import os
import math
from django.db.models.functions import Now

import sendgrid

from sendgrid.helpers.mail import *
from .models import Transfer, Delegate, MatchPayment, Process


sendgrid_key = os.getenv('SENDGRID_API_KEY', 'NO API FOUND')
sg = sendgrid.SendGridAPIClient(sendgrid_key)
from_email = Email("voice@radicalxchange.org", 'RxC Voice')

def send_mail(_to_mail, subject, body):
    to_email = To(_to_mail)
    content = Content("text/html", body)
    mail = Mail(from_email, to_email, subject, content)
    response = sg.client.mail.send.post(request_body=mail.get())

"""
this is called at the end of the delegation stage to pay out matches from the
matching fund.
"""
def match_transfers(process):
    transfers = Transfer.objects.all().filter(process=process)

    # {recipient_id: {sender_id: amount}} => each recipient has a dict where the keys
    # are senders and the values are amounts
    distinct_contributions = {}
    # {recipient_id: amount} => the total amount contributed to each recipient
    pledged_totals = {}
    # {recipient_id: amount} => the sum of the roots of all distinct contributions to each recipient
    sum_of_roots = {}
    for transfer in transfers:
        if transfer.recipient_object.is_verified:
            transfer.status = 'A'
            transfer.save()
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
        else:
            transfer.status = 'C'
            transfer.save()
            transfer.sender.credit_balance += transfer.amount
            transfer.sender.save()
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
        if int(final_match) != 0:
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


"""
this is called by the frontend to calculate an estimated match for a potential
transfer. Takes in a potential transfer, returns an estimated match.
"""
def estimate_match(new_transfer):
    process = new_transfer['process']
    transfers = Transfer.objects.all().filter(process=process)

    # {recipient_id: {sender_id: amount}} => each recipient has a dict where the keys
    # are senders and the values are amounts
    distinct_contributions = {}

    # {recipient_id: amount} => the total amount contributed to each recipient
    pledged_totals = {}

    # {recipient_id: amount} => the sum of the roots of all distinct contributions to each recipient
    sum_of_roots = {}
    for transfer in transfers:
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
    # calculate change the new transfer would cause
    sender = new_transfer['sender']
    recipient_object = Delegate.objects.filter(user__email=new_transfer['recipient']).first()
    if not recipient_object:
        recipient_object = Delegate.objects.filter(public_username=new_transfer['recipient']).first()
    adjusted_pledged_total = 0
    adjusted_sum_roots = 0
    if recipient_object:
        if recipient_object.id in distinct_contributions and recipient_object.id in pledged_totals and recipient_object.id in sum_of_roots:
            if sender.id in distinct_contributions[recipient_object.id]:
                adjusted_sum_roots = sum_of_roots[recipient_object.id] - math.sqrt(distinct_contributions[recipient_object.id][sender.id])
                distinct_contributions[recipient_object.id][sender.id] += new_transfer['amount']
            else:
                distinct_contributions[recipient_object.id][sender.id] = new_transfer['amount']
            adjusted_pledged_total = pledged_totals[recipient_object.id] + new_transfer['amount']
            adjusted_sum_roots = sum_of_roots[recipient_object.id] + math.sqrt(distinct_contributions[recipient_object.id][sender.id])
    else:
        adjusted_pledged_total = new_transfer['amount']
        adjusted_sum_roots = math.sqrt(new_transfer['amount'])
    # calculate current raw matches
    raw_matches = {}
    raw_match_total = 0
    for recipient_id, sum in sum_of_roots.items():
        raw_match = (sum * sum) - float(pledged_totals[recipient_id])
        raw_matches[recipient_id] = raw_match
        raw_match_total += raw_match
    # calculate the new match for given recipient
    adjusted_match = (adjusted_sum_roots * adjusted_sum_roots) - float(adjusted_pledged_total)
    # calculate the current match for given recipient
    curr_match = 0
    if recipient_object and recipient_object.id in raw_matches:
        curr_match = raw_matches[recipient_object.id]
    if raw_match_total > process.matching_pool:
        curr_match = (curr_match / raw_match_total) * float(process.matching_pool)
        adjusted_match = (adjusted_match / raw_match_total) * float(process.matching_pool)
    # return the difference caused by hypothetical transfer
    # print(str(int(adjusted_match)) + " - " + str(int(curr_match)) + " = " + str(int(adjusted_match) - int(curr_match)))
    return int(adjusted_match) - int(curr_match)
