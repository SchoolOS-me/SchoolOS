#!/bin/bash
set -e

echo Starting app server...

gunicorn -c python:config.gunicorn config.asgi:application
