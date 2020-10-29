FROM node

RUN mkdir /frontend
COPY . /frontend

WORKDIR /frontend

RUN npm install
RUN npm rebuild node-sass

EXPOSE 3000

CMD [ "npm", "start" ]
