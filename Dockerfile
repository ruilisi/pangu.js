FROM node:12-alpine

ENV NODE_ENV production
ENV PORT 80
EXPOSE 80

WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .
RUN apk add --no-cache git python && \
    yarn && \
    yarn cache clean && \
    apk del git
COPY . .
RUN yarn run build
CMD [ "yarn", "start", "-p", "80"  ]
