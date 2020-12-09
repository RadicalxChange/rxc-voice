## Deploy Instructions (untested)

1. Export .env file to enviroment and fill up suitable environment variables

```
cp .env.test .env
```

2. Build Images and Stand up containers

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
