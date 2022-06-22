# RadicalxChange Voice

RxC Voice is an app for decentralized democratic governance. It is developed by RadicalxChange to model and experiment with a new democratic process for decentralized democracy that leverages Quadratic Funding, pol.is, and Quadratic Voting.

This repo also hosts RxC Conversations, a wrapper for Pol.is conversations held in the RadicalxChange community.

## Local Setup - Docker

The Docker method is recommended for non-developers or anyone who wants to
quickly get the project running off-the-shelf. The Docker method is also
recommended for production. docker-compose-prod.yml can be used to spin up
production containers.

- Install Docker

- Install docker-compose (included in Docker Desktop for Mac and Windows)

- Clone project -
```
git clone --config core.autocrlf=input https://github.com/RadicalxChange/rxc-voice.git
cd rxc-voice
git checkout development
```

- Create .env file and fill up suitable environment variables.

```
cp .env-example .env
```

- Configure urls in `rxc-voice/src/utils/urls.ts` -- comment out the production urls and uncomment the local urls.

- Build images and stand up containers (make sure docker is running first).
```
# build and stand up containers
docker-compose -f docker-compose-voice.yml up --build
```

OR

```
# build containers
docker-compose -f docker-compose-voice.yml build
# then stand up containers
docker-compose -f docker-compose-voice.yml up
```

- Create a superuser to access the admin site

```
docker exec -it rxc-voice_api_1 ./manage.py createsuperuser


The project is now up and running -

Backend API - http://127.0.0.1:8000

RxC Voice - http://localhost:4000
```

## Deploy Instructions - virtual environment

The virtual environment method takes a few extra steps to set up, but is great for lightweight, fast development. This is recommended for developers who are spending a non-trivial amount of time working on the project.

- Install [PostgreSQL](https://www.postgresql.org/download/) and make sure it's running.

- Use [this guide](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/#creating-a-virtual-environment) to install pip and venv.

- Create a virtual environment to hold RxC Voice backend python packages
```
python3 -m venv ./venv/rxc-voice-backend
```

- Clone project -
```
git clone https://github.com/RadicalxChange/rxc-voice.git
cd rxc-voice
git checkout master
```

- Create .env file and fill up suitable environment variables
```
cp .env-example .env
```

- Configure urls in `rxc-voice/src/utils/urls.ts` -- comment out the production urls and uncomment the local urls.

- Activate your virtual environment
```
source ./venv/rxc-voice-backend/bin/activate
```

- Install required python packages in your virtual environment
```
cd backend/RxcVoiceApi
python3 -m pip install -r requirements.txt
```

- Make database migrations
```
python manage.py makemigrations main
```

- Apply migrations
```
python manage.py migrate
```

- Create a superuser to access the admin site. Don't forget to give the user a password, you'll need it to log in to the admin. 

```
python manage.py createsuperuser
```

- Start backend server
```
python manage.py runserver
```

- Open a new terminal window and install required frontend packages (your venv should not be activated)
```
cd rxc-voice/rxc-voice
npm install
```

- start frontend server
```
npm start
```

The project is now up and running -

Backend API - http://127.0.0.1:8000

RxC Voice - http://localhost:4000

## Creating users and accessing the site for testing

- Log in to the admin site at http://127.0.0.1:8000/admin
- Create a new user and profile. You can do this either via [the admin](http://127.0.0.1:8000/admin/main/profile/) or the [frontend UI](http://localhost:4000/verify)
- If you are unable to verify your account via the frontend, you may have to set `is_verified` for your new profile as true in the admin
- [Via the frontend](http://localhost:4000/login), log in with your user's `username` and password. 
- If you can't log in, verify the environment variable in `rxc-voice/src/utils/urls.ts` are set correctly
- Once logged in, verify you can create an event, and that you can view the event [under processes in the admin](http://127.0.0.1:8000/admin/main/process/)

## Contribute

For questions, comments, or troubleshooting, please feel free to open an issue on this repo. Our team currently includes only one full-time developer--any kind of contribution from the community is greatly appreciated!

## Troubleshooting

### database "DATABASE_NAME" does not exist

If you are building your Docker containers, and the rxc-voice_api_1 throws this
error, you probably have already initialized a database with another name.

- connect to rxc-voice_db_1 and open shell

`docker exec -it rxc-voice_db_1 bash`

- open psql shell and list databases

`psql -U POSTGRES_USER
postgres-# \l`

- copy the name of the correct database and update the value of `POSTGRES_DB` in your .env file

## Chat with us

Ask on Discord: https://discord.gg/ nw5QvvxQj7
