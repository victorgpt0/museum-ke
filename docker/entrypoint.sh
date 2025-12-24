#!/usr/bin/env sh
set -e

php artisan storage:link -n -vvv

php artisan optimize

php artisan migrate -n --pretend -vvv

php artisan migrate -n --force -vvv

php artisan db:seed -n -vvv

exec /usr/bin/supervisord -c /etc/supervisord/conf.d/supervisord.conf
