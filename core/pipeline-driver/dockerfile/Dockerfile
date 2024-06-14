ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}node:18.1.0-buster as install
ADD ./package-lock.json ./package.json /distributedkube/pipeline-driver/
WORKDIR /distributedkube/pipeline-driver
RUN npm ci --production

ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}distributedkube/base-node:v2.0.1-buster
LABEL maintainer="yehiyam@gmail.com"
RUN mkdir /distributedkube
COPY . /distributedkube/pipeline-driver
COPY --from=install /distributedkube/pipeline-driver/node_modules /distributedkube/pipeline-driver/node_modules
WORKDIR /distributedkube/pipeline-driver
CMD ["node", "app.js"]
