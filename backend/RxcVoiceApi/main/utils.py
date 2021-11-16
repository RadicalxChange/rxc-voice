import premailer

from django.template.loader import render_to_string
from django.contrib.auth.tokens import PasswordResetTokenGenerator
import six
from main.models import Delegate, Profile, Process


def is_verified(user_id):
    try:
        profile = Profile.objects.filter(user__id=user_id).first()
    except(Profile.DoesNotExist):
        profile = None
    if profile is not None:
        return profile.is_verified
    else:
        return False


def is_group_admin(user_id, process_groups):
    try:
        profile = Profile.objects.filter(user__id=user_id).first()
    except(Profile.DoesNotExist):
        profile = None
    if profile is not None:
        return not set(process_groups).isdisjoint(profile.groups_managed)
    else:
        return False


def premailer_transform(html):
    p = premailer.Premailer(html)
    return p.transform()


def get_mail_body(mail_name, mail_params):
    response_html = premailer_transform(render_to_string("emails/" + mail_name + ".html", mail_params))
    return response_html


class TokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, profile, timestamp):
        return (
            six.text_type(profile.user.pk) + six.text_type(timestamp) +
            six.text_type(profile.user.is_active)
        )

account_activation_token = TokenGenerator()
