ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}node:18.1.0-buster as install
ADD ./package-lock.json ./package.json /distributedkube/datasource-service/
WORKDIR /distributedkube/datasource-service
RUN npm ci --production

ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}distributedkube/base-node:v2.0.1-buster
LABEL maintainer="yehiyam@gmail.com"
RUN apt update && apt install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*
RUN wget -O dvc.deb https://github.com/iterative/dvc/releases/download/2.9.3/dvc_2.9.3_amd64.deb &&\
  apt install ./dvc.deb &&\
  rm ./dvc.deb
ADD dockerfile/gitconfig /.gitconfig
ADD dockerfile/gitconfig /root/.gitconfig
RUN mkdir -p /distributedkube/datasource-service
WORKDIR /distributedkube/datasource-service
COPY . /distributedkube/datasource-service
COPY --from=install /distributedkube/datasource-service/node_modules /distributedkube/datasource-service/node_modules
CMD ["node", "app"]
