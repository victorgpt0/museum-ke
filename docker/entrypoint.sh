#!/usr/bin/env sh
set -e

php artisan tinker --execute="dump(env('DB_DATABASE'), env('DB_HOST'));"

echo "Starting Postgresql..."

PG_VERSION=$(ls /usr/lib/postgresql/ | head -n 1)
PG_BIN="/usr/lib/postgresql/$PG_VERSION/bin"

runuser -u postgres -- "$PG_BIN/pg_ctl" -D /var/lib/postgresql/data -l /var/lib/postgresql/logfile start

until runuser -u postgres -- "$PG_BIN/pg_isready" -h localhost -p 5432; do
	echo "Waiting for postgres..."
	sleep 1
done

echo "DATABASE=${DB_DATABASE}"

if ! runuser -u postgres -- psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_DATABASE}'" | grep -q 1; then
  echo "Creating database ${DB_DATABASE}..."
  runuser -u postgres -- createdb "${DB_DATABASE}"
else
  echo "Database already exists"
fi

if ! runuser -u postgres -- psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USERNAME}'" | grep -q 1; then
  echo "Creating user ${DB_USERNAME}..."
  runuser -u postgres -- psql -v ON_ERROR_STOP=1 -c "CREATE USER \"${DB_USERNAME}\" WITH PASSWORD '${DB_PASSWORD}';"
else
  echo "User already exists"
fi


runuser -u postgres -- psql -v ON_ERROR_STOP=1 -c "GRANT ALL PRIVILEGES ON DATABASE \"${DB_DATABASE}\" TO \"${DB_USERNAME}\";"

runuser -u postgres -- psql -d "${DB_DATABASE}" -v ON_ERROR_STOP=1 <<SQL
GRANT ALL ON SCHEMA public TO "${DB_USERNAME}";
ALTER SCHEMA public OWNER TO "${DB_USERNAME}";
SQL

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
