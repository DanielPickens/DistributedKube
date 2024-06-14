ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}node:18.1.0-buster as install
ADD ./package-lock.json ./package.json /distributedkube/algorithm-output/
WORKDIR /distributedkube/algorithm-output
RUN npm ci --production

ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}distributedkube/base-node:v2.0.1-buster
LABEL maintainer="yehiyam@gmail.com"
RUN mkdir /distributedkube
COPY . /distributedkube/algorithm-output
COPY --from=install /distributedkube/algorithm-output/node_modules /distributedkube/algorithm-output/node_modules
WORKDIR /distributedkube/algorithm-output
CMD ["node", "app.js"]