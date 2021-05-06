FROM node:15.14

RUN mkdir /polis-app
COPY polis-app/ /polis-app
COPY scripts/ /scripts

WORKDIR /polis-app

RUN npm install

EXPOSE 3000
