ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}node:18.1.0-buster as install
ADD ./package-lock.json ./package.json /distributedkube/algorithm-builder/
WORKDIR /distributedkube/algorithm-builder
RUN npm ci --production
RUN echo stam

ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}distributedkube/base-node:v2.0.1-buster
LABEL maintainer="distributedkube.dev@gmail.com"

RUN apt update && apt install -y git gettext-base && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /distributedkube/algorithm-builder
WORKDIR /distributedkube/algorithm-builder
COPY . /distributedkube/algorithm-builder
COPY --from=install /distributedkube/algorithm-builder/node_modules /distributedkube/algorithm-builder/node_modules
CMD ["npm", "start"]