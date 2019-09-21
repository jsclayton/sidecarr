FROM node:12.10-alpine as development
ENV NODE_ENV=development PATH=/app/node_modules/.bin:$PATH
WORKDIR /app
COPY .yarnclean .yarnrc package.json yarn.lock ./
RUN yarn --frozen-lockfile --non-interactive
WORKDIR /app/src
COPY . .

FROM node:12.10-alpine as build
ENV NODE_ENV=development PATH=/app/node_modules/.bin:$PATH
WORKDIR /app
COPY --from=development /app/node_modules /app/node_modules
WORKDIR /app/src
COPY . .
RUN tsc

FROM node:12.10-alpine
EXPOSE 8000
ENV NODE_ENV=production PATH=/app/node_modules/.bin:$PATH
WORKDIR /app
COPY .yarnclean .yarnrc package.json yarn.lock ./
RUN yarn --frozen-lockfile --non-interactive && yarn cache clean
WORKDIR /app/src
COPY package.json ./
COPY --from=build /app/src/dist ./dist
RUN rm dist/jest.config.js /app/.yarnclean /app/.yarnrc /app/package.json /app/yarn.lock
