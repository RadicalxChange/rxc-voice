python /backend/QVtoolapi/manage.py makemigrations
python /backend/QVtoolapi/manage.py migrate
python /backend/QVtoolapi/manage.py collectstatic --noinput
gunicorn --workers=3 QVtoolapi.wsgi:application --bind 0.0.0.0:8000
