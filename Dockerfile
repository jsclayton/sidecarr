FROM node:12.13-alpine as development
VOLUME ["/config", "/pms"]
ENV NODE_ENV=development PATH=/app/node_modules/.bin:$PATH
WORKDIR /app
COPY .yarnclean .yarnrc package.json yarn.lock ./
RUN yarn --frozen-lockfile --non-interactive
WORKDIR /app/src
COPY . .
CMD ["tsnd", "src/server"]
ENTRYPOINT ["bin/exec-pretty.sh"]

FROM node:12.13-alpine as build
ENV NODE_ENV=development PATH=/app/node_modules/.bin:$PATH
WORKDIR /app
COPY --from=development /app/node_modules /app/node_modules
WORKDIR /app/src
COPY . .
RUN tsc && cp src/server/routes/mask.svg dist/server/routes/

FROM node:12.13-alpine
VOLUME ["/config", "/pms"]
EXPOSE 8000
ENV NODE_ENV=production PATH=/app/node_modules/.bin:$PATH
WORKDIR /app
COPY .yarnclean .yarnrc package.json yarn.lock ./
RUN yarn --frozen-lockfile --non-interactive && yarn cache clean
WORKDIR /app/src
COPY --from=build /app/src/dist ./
COPY package.json ./
COPY bin ./bin
RUN rm /app/.yarnclean /app/.yarnrc /app/package.json /app/yarn.lock
CMD ["node", "server"]
ENTRYPOINT ["bin/exec-pretty.sh"]