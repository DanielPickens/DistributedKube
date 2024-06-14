ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}node:18.1.0-buster as install
ADD ./package-lock.json ./package.json /distributedkube/pipeline-driver-queue/
WORKDIR /distributedkube/pipeline-driver-queue
RUN npm ci --production

ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}distributedkube/base-node:v2.0.1-buster
LABEL maintainer="maty21@gmail.com"
RUN mkdir /distributedkube
COPY . /distributedkube/pipeline-driver-queue
COPY --from=install /distributedkube/pipeline-driver-queue/node_modules /distributedkube/pipeline-driver-queue/node_modules
WORKDIR /distributedkube/pipeline-driver-queue
CMD ["node", "app.js"]
