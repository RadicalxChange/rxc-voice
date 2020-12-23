## Deploy Instructions

1. Install Docker

2. Install docker-compose

3. Clone project -
```
git clone https://github.com/alexrandaccio/QVtool.git
git checkout master
```

4. Create .env file and fill up suitable environment variables

```
touch .env
```

5. Build images and stand up containers (make sure docker is running first)

```
docker-compose up --build
```

Note - If images are already present ```docker-compose up```

The project is now up and running -

Backend API - http://127.0.0.1:8000

Polis app frontend - http://localhost:3000

6. Create a superuser to access the admin site

```
docker exec -it QVtool_api_1 QVtoolapi/manage.py createsuperuser
```

7. Log in to the admin site at http://127.0.0.1:8000/admin

8. Click "Conversations", to add conversations


## known bugs

create-election page:
deleting one ballot fires onClick twice, deletes top element every time.
same thing for deleting voter email addresses.

## TODOS for later

moment.js:
datetime functions need testing for different timezones.
also, moment.js should probably be phased out eventually.

api:
its extremely unlikely, but possible, that two anonymous users may be assigned
the same uuid. in the long run, consider handling uuid assignments on backend
with a check/try-again for uniqueness.

react state:
convert all state to reducers.
