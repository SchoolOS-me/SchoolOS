#!/bin/bash
set -e

echo "Starting celery beat service..."

celery -A config flower
