#!/bin/bash
set -e

echo "Starting celery beat service..."

celery -A config flower --address='0.0.0.0' --port=80
