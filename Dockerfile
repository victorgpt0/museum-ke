FROM serversideup/php:8.4-fpm AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN --mount=type=cache,target=/root/.composer \
    composer install --no-dev --no-scripts --no-autoloader --prefer-dist

FROM node:22-alpine AS node_modules
WORKDIR /app
COPY package.json package-lock.json ./
RUN  --mount=type=cache,target=/root/.npm \
     npm ci
COPY . .
RUN npm run build

FROM serversideup/php:8.4-fpm

SHELL ["/bin/sh", "-e", "-c"]

WORKDIR /var/www/html

COPY docker/php.ini /usr/local/etc/php/conf.d/99-laravel.ini
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x docker/entrypoint.sh

COPY . .

COPY --from=vendor /app/vendor ./vendor
COPY --from=node_modules /app/public/build ./public/build

RUN touch database/database.sqlite && \
    chown -R www-data:www-data /var/www/html && \
    chmod -R 775 storage bootstrap/cache database

EXPOSE 80/tcp

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost/up || exit 1

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
