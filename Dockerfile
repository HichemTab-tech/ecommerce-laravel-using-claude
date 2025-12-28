FROM php:8.4-fpm-alpine

# System packages
RUN apk add --no-cache \
    nginx \
    sqlite \
    sqlite-dev \
    pkgconfig \
    nodejs \
    npm \
    bash \
    curl \
    zip \
    unzip \
    oniguruma-dev \
    libzip-dev

# PHP extensions
RUN docker-php-ext-install \
    pdo \
    pdo_sqlite \
    mbstring \
    zip

# Install pnpm
RUN npm install -g pnpm

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy EVERYTHING
COPY . .

# Install PHP deps
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction

# Fake env so artisan can boot during build
RUN cp .env.example .env \
    && php artisan key:generate

# Install frontend deps + build
RUN pnpm install && pnpm run build

# SQLite DB
RUN mkdir -p database \
    && touch database/database.sqlite \
    && chmod -R 777 database storage bootstrap/cache

# Nginx config
COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

CMD sh -c "php-fpm -D && nginx -g 'daemon off;'"
