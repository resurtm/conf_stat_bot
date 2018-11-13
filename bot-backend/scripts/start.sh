#!/usr/bin/env sh

if [ "$NODE_ENV" = "production" ]; then
    yarn start:prod
else
    yarn start:dev
    cp -r /work/build/node_modules /work/app
fi
