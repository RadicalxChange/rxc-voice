python /backend/RxcVoiceApi/manage.py makemigrations
python /backend/RxcVoiceApi/manage.py migrate
python /backend/RxcVoiceApi/manage.py collectstatic --noinput
gunicorn --workers=3 RxcVoiceApi.wsgi:application --bind 0.0.0.0:8000
