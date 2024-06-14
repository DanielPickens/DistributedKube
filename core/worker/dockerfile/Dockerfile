ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}node:18.1.0-buster as install
ADD ./package-lock.json ./package.json /distributedkube/worker/
WORKDIR /distributedkube/worker
RUN npm ci --production

ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}distributedkube/base-node:v2.0.1-buster
LABEL maintainer="yehiyam@gmail.com"
RUN mkdir /distributedkube
COPY . /distributedkube/worker
COPY --from=install /distributedkube/worker/node_modules /distributedkube/worker/node_modules
WORKDIR /distributedkube/worker
CMD ["node", "app.js"]
