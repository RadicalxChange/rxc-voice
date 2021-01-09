FROM node

RUN mkdir /rxc-voice
COPY rxc-voice/ /rxc-voice
COPY scripts/ /scripts

WORKDIR /rxc-voice

RUN npm install

EXPOSE 3000
