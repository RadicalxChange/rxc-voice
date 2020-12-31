export $(grep -v '^#' .env | xargs -d '\n')
python3 ./backend/QVtoolapi/manage.py makemigrations
python3 ./backend/QVtoolapi/manage.py migrate
python3 ./backend/QVtoolapi/manage.py shell < ./backend/QVtoolapi/makeadmindelegate.py
python3 ./backend/QVtoolapi/manage.py runserver 0.0.0.0:8000

