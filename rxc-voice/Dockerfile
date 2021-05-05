FROM node:15.14

RUN mkdir /rxc-voice
COPY rxc-voice/ /rxc-voice
COPY scripts/ /scripts

WORKDIR /rxc-voice

RUN npm install

RUN npm rebuild node-sass

EXPOSE 4000
