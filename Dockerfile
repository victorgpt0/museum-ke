FROM serversideup/php:8.4-fpm-nginx AS base
WORKDIR /var/www/html
USER root
RUN install-php-extensions exif pgsql pdo_pgsql && \
    apt-get update && \
    apt-get install -y postgresql postgresql-contrib && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

FROM base AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

FROM node:22-alpine AS node_modules
WORKDIR /app
COPY package.json package-lock.json ./
RUN  npm ci
COPY . .
RUN npm run build

FROM base AS final
WORKDIR /var/www/html
USER root

COPY docker/php.ini /usr/local/etc/php/conf.d/99-laravel.ini
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisord/conf.d/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

COPY --chown=www-data:www-data . .
COPY --from=vendor --chown=www-data:www-data /app/vendor ./vendor
COPY --from=node_modules --chown=www-data:www-data /app/public/build ./public/build

RUN composer dump-autoload --optimize --classmap-authoritative && \
    chown -R www-data:www-data /var/www/html && \
    chmod -R 775 storage bootstrap/cache database

RUN su - postgres -c "initdb -D /var/lib/postgresql/data" && \
    su - postgres -c "echo \"host all all 0.0.0.0/0 md5\" >> /var/lib/postgresql/data/pg_hba.conf" && \
    su - postgres -c "initdb \"listen_addresses='*'\" >> /var/lib/postgresql/data/postgresql.conf"

USER www-data

EXPOSE 8080/tcp

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost/up || exit 1

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
