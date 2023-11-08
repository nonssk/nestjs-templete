FROM node:18.16.0-alpine as build
WORKDIR /installer
COPY . .
RUN npm install -g typescript@4.5.5
RUN yarn install
RUN yarn build
RUN npm prune --production

FROM node:18.16.0-alpine as release

WORKDIR /app
COPY --from=build ./installer/node_modules ./node_modules
COPY --from=build ./installer/dist ./dist
COPY --from=build ["./installer/package.json","./installer/yarn.lock","./"]

ENV NODE_ENV=production
EXPOSE 8080

USER node
ENTRYPOINT ["node", "./dist/main.js"]