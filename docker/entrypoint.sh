#!/usr/bin/env sh
set -e

echo "Starting Postgresql..."

su - postgres -c "pg_ctl -D /var/lib/postgresql/data -l /var/lib/postgresql/logfile start"

su - postgres -c "psql -c \"CREATE DATABASE ${DB_DATABASE};\"" || echo "Database already exists"
su - postgres -c "psql -c \"CREATE USER ${DB_USERNAME} WITH PASSWORD '${DB_PASSWORD}';\"" 2>/dev/null || echo "User already exists"
su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE ${DB_DATABASE} TO ${DB_USERNAME};\"" 2>/dev/null || true
su - postgres -c "psql -d ${DB_DATABASE} -c \"GRANT ALL ON SCHEMA public TO ${DB_USERNAME};\"" 2>/dev/null || true

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
