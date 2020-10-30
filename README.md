build and run frontend docker image

cd frontend

docker build --tag qvtool_frontend:1.0 .

docker run --publish 8000:8080 --detach --name frontend qvtool_frontend:1.0

view site at: localhost:8000


no dockerfile yet for backend


start up docker image with .env variables

docker run --env-file .env


KNOWN BUGS

create-election page:
deleting one ballot fires onClick twice, deletes top element every time.
same thing for adding/deleting voter email addresses.
