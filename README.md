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
# strictly necessary
DJANGO_SECRET_KEY=

# needed for database
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_DB=qvtoolapi_db
POSTGRES_USER=
POSTGRES_PASSWORD=

# needed for Oauth2
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_SECRET=

# needed for email services
MAILCHIMP_API_KEY=
SENDGRID_API_KEY=
TRANSACTION_EMAIL=
```

5. Configure urls in rxc-voice/src/utils/urls.ts -- comment out the production urls and uncomment the local urls.

6. Build images and stand up containers (make sure docker is running first). Choose a docker-compose yaml file. <polis> to run RxC Conversations, <voice> to run RxC Voice, and <prod> to run both apps at once in a production environment (not recommended for dev / testing).

```
docker-compose -f docker-compose-<polis / voice / prod>.yml up --build
```

Note - If images are already present ```docker-compose -f docker-compose-<polis / voice / prod>.yml up```

The project is now up and running -

Backend API - http://127.0.0.1:8000

RxC Conversations - http://localhost:4000

RxC Voice - http://localhost:3000

## Creating users and accessing the site for testing

1. Create a superuser to access the admin site

```
docker exec -it qvtool_api_1 ./QVtoolapi/manage.py createsuperuser
```

2. Log in to the admin site at http://127.0.0.1:8000/admin

3. Create a Group named "RxC Voice" -- any objects you create for RxC Voice must be added to this group.

4. Create a Group named "RxC Conversations" -- any objects you create for RxC Conversations must be added to this group.

5. Create a User. It is recommended that you use the same email address for both the "Email address" field and the "Username" field. Add the user to the "RxC Voice" group you created in step 3.

6. Now create a Delegate for the User you just created (The Delegate class is an extension/wrapper of the User class). If you have not set up email services, you can bypass the user verification process by checking "Is verified" and entering something into the "Public username" field.

7. You should now be able to log in to the site with the test user's email and password.

## Contribute

For questions, comments, or troubleshooting, please feel free to open an issue on this repo. Our team currently includes only one developer--any kind of contribution from the community is greatly appreciated!
