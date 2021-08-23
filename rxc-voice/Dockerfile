# Install dependencies only when needed
FROM node:15.14-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /rxc-voice
COPY rxc-voice/package.json rxc-voice/package-lock.json ./
RUN npm install

# Rebuild the source code only when needed
FROM node:15.14-alpine AS builder
WORKDIR /rxc-voice
COPY rxc-voice/ /rxc-voice
COPY --from=deps /rxc-voice/node_modules ./node_modules

EXPOSE 4000
