FROM node

RUN mkdir /qv-app
COPY qv-app/ /qv-app
COPY scripts/ /scripts

WORKDIR /qv-app

RUN npm install

EXPOSE 3000
