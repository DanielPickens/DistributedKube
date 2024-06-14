ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}node:18.1.0-buster as install
ADD ./package-lock.json ./package.json /distributedkube/gc-service/
WORKDIR /distributedkube/gc-service
RUN npm ci --production

ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}distributedkube/base-node:v2.0.1-buster
LABEL maintainer="yehiyam@gmail.com"
RUN mkdir /distributedkube
COPY . /distributedkube/gc-service
COPY --from=install /distributedkube/gc-service/node_modules /distributedkube/gc-service/node_modules
WORKDIR /distributedkube/gc-service
CMD ["node", "app.js"]