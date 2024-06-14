ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}node:18.1.0-buster as install
ADD ./package-lock.json ./package.json /distributedkube/resource-manager/
WORKDIR /distributedkube/resource-manager
RUN npm ci --production

ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}distributedkube/base-node:v2.0.1-buster
LABEL maintainer="yehiyam@gmail.com"
RUN mkdir /distributedkube
COPY . /distributedkube/resource-manager
COPY --from=install /distributedkube/resource-manager/node_modules /distributedkube/resource-manager/node_modules
WORKDIR /distributedkube/resource-manager
CMD ["node", "app.js"]
