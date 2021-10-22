# Install dependencies only when needed
FROM node:16.11.1-alpine3.14 AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json ./
COPY package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:16.11.1-alpine3.14 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY .. .
RUN npm run fullbuild

# Production image, copy all the files and run next
FROM nginx:1.20.0-alpine
MAINTAINER Timon Borter <timon.borter@gmx.ch>

COPY --from=builder /app/out /usr/share/nginx/html
