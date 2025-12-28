FROM serversideup/php:8.4-fpm-nginx

ENV PHP_OPCACHE_ENABLE=1

USER root

# Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_23.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g pnpm


COPY --chown=www-data:www-data . /var/www/html

USER www-data

RUN composer install --no-interaction --optimize-autoloader --no-dev

RUN pnpm install && pnpm run build
