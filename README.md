## Deploy Instructions (untested)

1. Install Docker

2. Install docker-compose (Version > 1.25.5) `docker-compose --version`

3. Clone Project -
```
git clone https://github.com/alexrandaccio/QVtool.git
git checkout production
```

4. Create .env file and fill up suitable environment variables

```
touch .env
```

5. Build Images and Stand up containers

```
docker-compose up --build
```

Note - If images are already present ```docker-compose up```

The Project is now up and running -

Backend API - http://127.0.0.1:8000

QV App Frontend - http://localhost:3000


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
