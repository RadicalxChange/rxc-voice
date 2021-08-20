import premailer

from django.template.loader import render_to_string
from django.contrib.auth.tokens import PasswordResetTokenGenerator
import six
from main.models import Delegate, Process

def delegate_is_verified(user_id):
    try:
        delegate = Delegate.objects.filter(user__id=user_id).first()
    except(Delegate.DoesNotExist):
        delegate = None
    if delegate is not None:
        return delegate.is_verified
    else:
        return False

def add_to_delegation(delegate):
    delegate_groups = map(lambda x: x.name, delegate.user.groups.all())
    processes = Process.objects.filter(groups__name__in=delegate_groups)
    for process in processes:
        process.delegates.add(delegate)


def premailer_transform(html):
    p = premailer.Premailer(html)
    return p.transform()


def get_mail_body(mail_name, mail_params):
    response_html = premailer_transform(render_to_string("emails/" + mail_name + ".html", mail_params))
    return response_html


class TokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, delegate, timestamp):
        return (
            six.text_type(delegate.user.pk) + six.text_type(timestamp) +
            six.text_type(delegate.user.is_active)
        )

account_activation_token = TokenGenerator()
