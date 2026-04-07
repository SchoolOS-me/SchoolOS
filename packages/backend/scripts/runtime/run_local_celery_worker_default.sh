#!/bin/bash

set -e

watchmedo auto-restart \
  --directory=/app \
  --pattern=*.py \
  --recursive \
  -- celery -A config worker -l info
