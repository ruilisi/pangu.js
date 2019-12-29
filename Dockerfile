FROM node:12-alpine as base
RUN echo "http://mirrors.ustc.edu.cn/alpine/v3.10/main/" > /etc/apk/repositories && \
    echo "http://mirrors.ustc.edu.cn/alpine/v3.10/community/" >> /etc/apk/repositories

ENV SASS_BINARY_SITE https://npm.taobao.org/mirrors/node-sass/
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80
RUN yarn config set registry "https://registry.npm.taobao.org"
WORKDIR /usr/src/app

FROM base as build
COPY package.json .
COPY yarn.lock .
RUN apk add --no-cache git python && \
    yarn && \
    sed -i 's/process.browser = true;//g' node_modules/process/browser.js && \
    yarn cache clean && \
    apk del git
COPY . .
RUN yarn build && \
    rm -rf .next/cache
CMD [ "yarn", "start", "-p", "80"  ]
