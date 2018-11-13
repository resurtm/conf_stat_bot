FROM node:8
LABEL maintainer="resurtm@gmail.com"

RUN mkdir -p /work/build
WORKDIR /work/build

COPY package.json .
COPY yarn.lock .
RUN yarn install

RUN mkdir -p /work/app
WORKDIR /work/app

RUN ln -s ../build/node_modules node_modules
COPY . .

EXPOSE 8080
ENV APP_PORT 8080
ENV APP_HOST 0.0.0.0
CMD ["yarn", "start"]
