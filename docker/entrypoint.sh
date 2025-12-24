#!/usr/bin/env sh
set -e

echo "Starting Laravel application..."

php artisan storage:link -n -vvv || true

php artisan optimize

echo "Checking migrations..."
php artisan migrate -n --pretend -vvv

echo "Running migrations..."
php artisan migrate -n --force -vvv

echo "Seeding DB..."
php artisan db:seed -n -vvv

echo "Starting supervisord..."
exec /usr/bin/supervisord -c /etc/supervisord/conf.d/supervisord.conf
