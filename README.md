build and run frontend docker image

cd frontend

docker build --tag qvtool_frontend:1.0 .

docker run --publish 8000:8080 --detach --name frontend qvtool_frontend:1.0

view site at: localhost:8000


no dockerfile yet for backend


start up docker image with .env variables

docker run --env-file .env
