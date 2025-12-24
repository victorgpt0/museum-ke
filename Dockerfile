FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM php:8.2-fpm-alpine

SHELL ["/bin/sh", "-e", "-c"]

RUN apk add --no-cache \
    nginx \
    supervisor \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    icu-dev \
    sqlite-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_sqlite bcmath xml intl gd opcache exif pcntl posix

WORKDIR /var/www/html
COPY . .
COPY --from=builder /app/public/build ./public/build

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader --no-scripts \
    && chmod +x docker/entrypoint.sh

COPY docker/php.ini /usr/local/etc/php/conf.d/99-laravel.ini
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN touch database/database.sqlite && \
    chown -R www-data:www-data /var/www/html && \
    chmod -R 775 storage bootstrap/cache database

EXPOSE 80/tcp

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost/up || exit 1

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
