FROM ${BASE_PRIVATE_REGISTRY}python:3.7
ADD ./requirements.txt /distributedkube/algorithm-hyperparams-tuner/dockerfile/requirements.txt
WORKDIR /distributedkube/algorithm-hyperparams-tuner
RUN pip install -r ./dockerfile/requirements.txt 
RUN mkdir -p /distributedkube-logs
COPY . /distributedkube/algorithm-hyperparams-tuner
CMD ["/bin/sh", "-c", "python -u app.py 2>&1 |tee /distributedkube-logs/stdout.log"]