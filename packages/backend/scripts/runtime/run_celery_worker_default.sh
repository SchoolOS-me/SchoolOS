#!/bin/bash
set -e

echo "Starting celery worker – default queue..."

celery -A config worker -l info
