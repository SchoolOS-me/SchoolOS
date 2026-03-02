# 🍔 Saas backend application

## Local env setup

1. Copy env template:
   - `cp .env.example .env`
2. Update DB/CORS/CSRF values in `.env`.
3. Start backend.

See `CLEANUP_AUDIT.md` for endpoint/table cleanup candidates.

### `saas backend test`

Runs tests and linters inside docker container.

### `saas backend build`

Builds docker images used by the backend and pushes them to AWS ECR repository. Make sure you're logged into the AWS
using `saas aws set-env [ENV_NAME]` command.

### `saas backend deploy`

This rule deploys admin-panel, api, and migrations stacks.

## Pycharm integration

One option to configure the python interpreter in pycharm is to add interpreter with docker/docker-compose option.
The advantage of this solution is independence from using python package manager.
