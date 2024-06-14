ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}node:18.1.0-buster as install
ADD ./package-lock.json ./package.json /distributedkube/algorithm-queue/
WORKDIR /distributedkube/algorithm-queue
RUN npm ci --production

ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}distributedkube/base-node:v2.0.1-buster
LABEL maintainer="yehiyam@gmail.com"
RUN mkdir /distributedkube
COPY . /distributedkube/algorithm-queue
COPY --from=install /distributedkube/algorithm-queue/node_modules /distributedkube/algorithm-queue/node_modules
WORKDIR /distributedkube/algorithm-queue
CMD ["node", "app.js"]
