#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset

pnpm run sls package --stage "${ENV_STAGE}"
