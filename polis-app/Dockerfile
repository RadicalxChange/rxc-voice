# Install dependencies only when needed
FROM node:15.14-alpine as deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /polis-app
COPY polis-app/package.json polis-app/package-lock.json ./
RUN npm install

# Rebuild the source code only when needed
FROM node:15.14-alpine as runner
WORKDIR /polis-app
COPY polis-app/ /polis-app
COPY --from=deps /polis-app/node_modules ./node_modules

EXPOSE 3000
