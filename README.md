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

- Create a superuser to access the admin site

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

- Create a Group named "RxC Voice" -- any objects you create for RxC Voice must be added to this group.

- Create a User. The login UI uses `username` but has the label `email` - to prevent confusion you should use the same email address for both the "Email address" field and the "Username" field. Add the user to the "RxC Voice" group you created in step 3.

- Now create a Delegate for the User you just created (The Delegate class is an extension/wrapper of the User class). If you have not set up email services, you can bypass the user verification process by checking "Is verified" and entering something into the "Public username" field.

- You should now be able to log in to the site with the test user's email and password.

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

- copy the name of the correct database and update the value of POSTGRES_DB in your .env file

## Chat with us

Ask on Discord: https://discord.gg/ nw5QvvxQj7
