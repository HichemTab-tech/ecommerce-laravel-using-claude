# ---------- PHP / Laravel ----------
FROM serversideup/php:8.4-fpm AS app

ENV PHP_OPCACHE_ENABLE=1

USER root

RUN apt-get update && apt-get install -y \
    curl git unzip \
    && rm -rf /var/lib/apt/lists/*

# Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_23.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g pnpm

WORKDIR /var/www/html

COPY --chown=www-data:www-data . .

USER www-data

RUN composer install --no-dev --optimize-autoloader

RUN mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    database \
    bootstrap/cache \
    && touch database/database.sqlite \
    && chmod -R 775 storage bootstrap/cache database

RUN pnpm install && pnpm run build

RUN cp .env.example .env \
    && php artisan key:generate \
    && php artisan migrate --force


# ---------- Nginx ----------
FROM nginx:alpine AS nginx

COPY --from=app /var/www/html /var/www/html
COPY docker/nginx/conf.d /etc/nginx/conf.d
