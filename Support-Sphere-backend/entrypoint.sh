#!/bin/sh
set -e

python manage.py migrate --noinput
python manage.py collectstatic --noinput
python manage.py seed_data

exec daphne -b 0.0.0.0 -p 8000 support_sphere.asgi:application
