#!/usr/bin/env sh
set -e

# Ensure database file exists and is writable
if [ ! -f database/database.sqlite ]; then
    echo "Creating database file..."
    touch database/database.sqlite
    chmod 664 database/database.sqlite
fi

# Verify database is writable
if [ ! -w database/database.sqlite ]; then
    echo "ERROR: database/database.sqlite is not writable"
    ls -la database/
    exit 1
fi

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
