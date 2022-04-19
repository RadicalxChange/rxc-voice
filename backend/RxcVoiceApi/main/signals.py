from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

from .utils import get_mail_body, account_activation_token
from .services import send_mail
from .models import Delegate


@receiver(post_save, sender=Delegate)
def send_register_mail(sender, instance, **kwargs):
    if kwargs['created']:
        # current_site = 'https://voice.radicalxchange.org'
        uid = urlsafe_base64_encode(force_bytes(instance.pk))
        token = account_activation_token.make_token(instance.profile)
        params = {
            'delegate_name': instance.profile.user.first_name,
            'process_title': instance.process.title,
            'invitation_message': instance.process.invitation_message,
            'is_verified': instance.profile.is_verified,
            # 'domain': current_site,
            'uid': uid,
            'token': token,
            'delegate': instance,
        }
        subject = "Invitation to participate on RxC Voice"

        try:
            if instance.process.title == "RadicalxChange Agenda 2022-2023":
                mail_body = get_mail_body('community_poll_22', params)
            else:
                mail_body = get_mail_body('default_invite', params)
            send_mail(instance.profile.user.email, subject, mail_body)
        except Exception as e:
            print(e)
