# RadicalxChange Voice

RxC Voice is an app for decentralized democratic governance. It is developed by RadicalxChange to model and experiment with a new democratic process for decentralized democracy that leverages Quadratic Funding, pol.is, and Quadratic Voting.

This repo also hosts RxC Conversations, a wrapper for Pol.is conversations held in the RadicalxChange community.

## Local Setup

- Install Docker

- Install docker-compose

- Clone project -
```
git clone https://github.com/RadicalxChange/rxc-voice.git
cd rxc-voice
git checkout master
```

- Create .env file and fill up suitable environment variables.

```
cp .env-example .env
```

For best results, fill in at least the following:

```
DJANGO_SECRET_KEY=
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_DB=rxcvoiceapi_db
POSTGRES_USER=
POSTGRES_PASSWORD=
```

- Configure urls in `rxc-voice/src/utils/urls.ts` -- comment out the production urls and uncomment the local urls.

- Build images and stand up containers (make sure docker is running first). Choose a docker-compose yaml file. Use `docker-compose-polis.yml` to run RxC Conversations, `docker-compose-voice.yml` to run RxC Voice, and `docker-compose-prod.yml` to run both apps at once in a production environment (not recommended for dev / testing).

```
# build and stand up containers
docker-compose -f docker-compose-<polis / voice / prod>.yml up --build
```

OR

```
# build containers
docker-compose -f docker-compose-<polis / voice / prod>.yml build
# then stand up containers
docker-compose -f docker-compose-<polis / voice / prod>.yml up
```

**Example**
If I want to test RxC Conversations only:
```
docker-compose -f docker-compose-polis.yml up --build
```
OR
```
docker-compose -f docker-compose-polis.yml build
docker-compose -f docker-compose-polis.yml up
```

The project is now up and running -

Backend API - http://127.0.0.1:8000

RxC Conversations - http://localhost:4000

RxC Voice - http://localhost:3000

## Creating users and accessing the site for testing

- Run migrations

```
docker exec -it rxc-voice_api_1 python manage.py migrate
```

- Create a superuser to access the admin site

```
docker exec -it rxc-voice_api_1 ./manage.py createsuperuser
```

- Log in to the admin site at http://127.0.0.1:8000/admin

- Create a Group named "RxC Voice" -- any objects you create for RxC Voice must be added to this group.

- Create a Group named "RxC Conversations" -- any objects you create for RxC Conversations must be added to this group.

- Create a User. The login UI uses `username` but has the label `email` - to prevent confusion you may want to use the same email address for both the "Email address" field and the "Username" field. Add the user to the "RxC Voice" group you created in step 3.

- Now create a Delegate for the User you just created (The Delegate class is an extension/wrapper of the User class). If you have not set up email services, you can bypass the user verification process by checking "Is verified" and entering something into the "Public username" field.

- You should now be able to log in to the site with the test user's username (even though the label says email) and password.

## Contribute

For questions, comments, or troubleshooting, please feel free to open an issue on this repo. Our team currently includes only one developer--any kind of contribution from the community is greatly appreciated!

## Troubleshooting

### database "DATABASE_NAME" does not exist

If you are building your Docker containers, and the rxc-voice_api_1 throws this
error, you probably have already initialized a database with another name.

- connect to rxc-voice_db_1 and open shell

`docker exec -it rxc-voice_db_1 bash`

- open psql shell and list databases

`psql -U POSTGRES_USER
postgres-# \l`

- copy the name of the correct database and update the value of POSTGRES_DB in your .env file

## Chat with us

Ask on Discord: https://discord.gg/  TcE9FKQb
