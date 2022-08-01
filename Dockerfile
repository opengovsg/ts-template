FROM node:lts-alpine AS node-modules-builder
LABEL maintainer="Open Government Products"

ARG ENV=production
WORKDIR /usr/src/app

COPY . ./
RUN npm ci
RUN ENV=$ENV REACT_APP_ENV=$ENV npm run build \
  && npm prune --production

FROM node:lts-alpine
WORKDIR /usr/src/app

COPY --from=node-modules-builder /usr/src/app/backend ./backend
COPY --from=node-modules-builder /usr/src/app/frontend/build ./frontend/build
COPY --from=node-modules-builder /usr/src/app/shared ./shared
COPY --from=node-modules-builder /usr/src/app/node_modules ./node_modules
COPY --from=node-modules-builder /usr/src/app/package.json ./

EXPOSE 8080
CMD ["npm", "run", "start"]
