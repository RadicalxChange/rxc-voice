import premailer
from django.template.loader import render_to_string
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils import timezone
import six
from .models import Profile, Stage
from .services import match_transfers


def advance_stage(process, curr_stage):
    if curr_stage.type == Stage.DELEGATION:
        match_transfers(process, curr_stage)
    stages_sorted = sorted(process.stages.all(), key=lambda stage: stage.position)
    for stage in stages_sorted[int(curr_stage.position)+1:]:
        if timezone.now() < stage.end_date:
            process.curr_stage = stage.position
            process.save()
            return
    process.curr_stage = stages_sorted[-1].position
    process.save()


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
    def _make_hash_value(self, delegate, timestamp):
        return (
            six.text_type(delegate.profile.user.pk) + six.text_type(timestamp) +
            six.text_type(delegate.profile.user.is_active)
        )

account_activation_token = TokenGenerator()
