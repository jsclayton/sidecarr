FROM node:16.6.1-alpine3.14 as development
VOLUME ["/config", "/pms"]
ENV NODE_ENV=development PATH=/app/node_modules/.bin:$PATH
WORKDIR /app
COPY .yarnclean .yarnrc package.json yarn.lock ./
RUN apk add --no-cache --virtual .build-deps alpine-sdk python2 && \
  yarn --frozen-lockfile --non-interactive && \
  apk del .build-deps
WORKDIR /app/src
COPY . .
CMD ["tsnd", "src/server"]
ENTRYPOINT ["bin/exec-pretty.sh"]

FROM node:16.6.1-alpine3.14 as build
ENV NODE_ENV=development PATH=/app/node_modules/.bin:$PATH
WORKDIR /app
COPY --from=development /app/node_modules /app/node_modules
WORKDIR /app/src
COPY . .
RUN tsc

FROM node:16.6.1-alpine3.14
VOLUME ["/config", "/pms"]
EXPOSE 8000
ENV NODE_ENV=production PATH=/app/node_modules/.bin:$PATH
WORKDIR /app
COPY .yarnclean .yarnrc package.json yarn.lock ./
RUN apk add --no-cache --virtual .build-deps alpine-sdk python2 && \
  yarn --frozen-lockfile --non-interactive && \
  yarn cache clean && \
  apk del .build-deps
WORKDIR /app/src
COPY --from=build /app/src/dist ./
COPY package.json ./
COPY bin ./bin
RUN rm /app/.yarnclean /app/.yarnrc /app/package.json /app/yarn.lock
CMD ["node", "server"]
ENTRYPOINT ["bin/exec-pretty.sh"]