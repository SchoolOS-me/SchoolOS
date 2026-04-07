#!/bin/bash
set -e

echo "Starting celery beat service..."

celery -A config beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
