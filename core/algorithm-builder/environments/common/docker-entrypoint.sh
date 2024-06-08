#!/bin/sh

set -e
echo "$@"
if [ "${DEV_MODE}" = "true"  ]; then
    exec /distributedkube/nodemon --watch /distributedkube/algorithm-runner/algorithm_unique_folder/ --ignore *.pyc  -L --ext '*' --delay 2 -x  "$@"
else
    exec "$@"
fi