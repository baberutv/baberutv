FROM node:6.10.0-alpine

ENV PATH /root/.yarn/bin:${PATH}
ENV YARN_VERSION 0.21.3

RUN \
  apk add --no-cache --update --virtual .build-deps bash curl gnupg tar && \
  curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version ${YARN_VERSION} && \
  apk del .build-deps

WORKDIR /app

COPY ./package.json ./yarn.lock /app/
RUN yarn

COPY . /app/
RUN \
  yarn build -- --env production && \
  rm -rf ./node_modules && \
  yarn --production && \
  rm -rf $(yarn cache dir)

EXPOSE 8080
CMD ["yarn", "start"]
