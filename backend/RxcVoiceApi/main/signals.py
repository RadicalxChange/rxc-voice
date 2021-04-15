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
        token = account_activation_token.make_token(instance)
        params = {
            'delegate_email': instance.user.email,
            # 'domain': current_site,
            'uid': uid,
            'token': token,
            'delegate': instance,
        }
        subject = "Invitation to participate on RxC Voice"

        try:
            mail_body = get_mail_body('create_account', params)
            send_mail(instance.user.email, subject, mail_body)
        except Exception as e:
            print(e)
