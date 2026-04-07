#!/bin/bash

cd /app/packages/workers/ || exit

pnpm run sls --version
pnpm run sls deploy --stage "${ENV_STAGE}"
