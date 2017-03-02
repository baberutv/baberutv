FROM node:6.10.0

ENV PATH /root/.yarn/bin:${PATH}
ENV YARN_VERSION 0.21.3

RUN \
  curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version ${YARN_VERSION}

WORKDIR /app

COPY ./package.json ./yarn.lock /app/
RUN yarn

COPY . /app/

EXPOSE 8080
CMD ["yarn", "start"]
