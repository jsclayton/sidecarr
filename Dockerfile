FROM node:12.10-alpine as development
ENV NODE_ENV=development
WORKDIR /app
COPY .yarnclean .yarnrc package.json yarn.lock ./
RUN yarn --frozen-lockfile --non-interactive
WORKDIR /app/src
COPY . .

FROM node:12.10-alpine as build
WORKDIR /app
COPY --from=development /app/node_modules /app
WORKDIR /app/src
COPY . .
RUN yarn tsc

FROM node:12.10-alpine
ENV NODE_ENV=production PATH=/app/node_modules/.bin:$PATH
WORKDIR /app
COPY .yarnclean .yarnrc package.json yarn.lock ./
RUN yarn --frozen-lockfile --non-interactive && yarn cache clean
WORKDIR /app/src
COPY package.json ./
COPY --from=development ./app/src/dist ./dist
