FROM node as builder

RUN mkdir /polis-app
COPY polis-app/ /polis-app
COPY scripts/ /scripts

WORKDIR /polis-app

EXPOSE 3000

RUN npm install
RUN npm build

FROM nginx

COPY --from=builder /polis-app/build /var/www/polis-app

ENTRYPOINT ["nginx", "-g", "daemon off;"]
