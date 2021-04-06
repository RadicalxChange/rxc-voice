## RadicalxChange Voice

RxC Voice is an app for decentralized democratic governance. It is developed by RadicalxChange to model and experiment with a new democratic process for decentralized democracy that leverages Quadratic Funding, pol.is, and Quadratic Voting.

This repo also hosts RxC Conversations, a wrapper for Pol.is conversations held in the RadicalxChange community.

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

The variables needed are as follows:

```
DJANGO_SECRET_KEY=
MAILCHIMP_API_KEY=
SENDGRID_API_KEY=
TRANSACTION_EMAIL=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_SECRET=
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
```

5. Configure urls in rxc-voice/src/utils/urls.ts -- comment out the production urls and uncomment the local urls.

6. Build images and stand up containers (make sure docker is running first). Choose a docker-compose yaml file. <polis> to run RxC Conversations, <voice> to run RxC Voice, and <prod> to run both apps at once in a production environment.

```
docker-compose -f docker-compose-<polis / voice / prod>.yml up --build
```

Note - If images are already present ```docker-compose -f docker-compose-<polis / voice / prod>.yml up```

The project is now up and running -

Backend API - http://127.0.0.1:8000

RxC Conversations - http://localhost:4000

RxC Voice - http://localhost:3000

7. Create a superuser to access the admin site

```
docker exec -it QVtool_api_1 ./manage.py createsuperuser
```

8. Log in to the admin site at http://127.0.0.1:8000/admin

## Contribute

For questions, comments, or troubleshooting, please feel free to open an issue on this repo. Our team currently includes only one developer--any kind of contribution from the community is greatly appreciated!
