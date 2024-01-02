ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}node:18.1.0-buster as install
ADD ./package-lock.json ./package.json /distributedkube/api-server/
WORKDIR /distributedkube/api-server
RUN npm ci --production

ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}distributedkube/base-node:v2.0.1-buster
LABEL maintainer="danielpickens@gmail.com"
RUN mkdir /distributedkube
COPY . /distributedkube/api-server
COPY --from=install /distributedkube/api-server/node_modules /distributedkube/api-server/node_modules
WORKDIR /distributedkube/api-server
CMD ["node", "app.js"]