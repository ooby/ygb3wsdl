FROM alpine:3.9
ARG registry="https://registry.npmjs.org"
RUN apk add --no-cache nodejs yarn
ADD . /app
WORKDIR /app
RUN yarn install \
        --prod \
        --pure-lockfile \
        --cache-folder /dev/shm/yarn_cache \
        --registry $registry
ENTRYPOINT yarn start