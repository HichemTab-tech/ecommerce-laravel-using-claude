FROM ubuntu:24.04

LABEL maintainer="Hichem Taboukouyout"

ARG NODE_VERSION=20

WORKDIR /var/www/html

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC

# Timezone
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Base packages
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    git \
    zip \
    unzip \
    sqlite3 \
    gnupg \
    libpng-dev \
    libzip-dev \
    libonig-dev \
    && rm -rf /var/lib/apt/lists/*

# PHP 8.4
RUN mkdir -p /etc/apt/keyrings \
    && curl -sS https://keyserver.ubuntu.com/pks/lookup?op=get\&search=0xb8dc7e53946656efbce4c1dd71daeaab4ad4cab6 \
        | gpg --dearmor > /etc/apt/keyrings/ondrej.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/ondrej.gpg] https://ppa.launchpadcontent.net/ondrej/php/ubuntu noble main" \
        > /etc/apt/sources.list.d/ondrej.list \
    && apt-get update \
    && apt-get install -y \
        php8.4-cli \
        php8.4-sqlite3 \
        php8.4-mbstring \
        php8.4-xml \
        php8.4-zip \
        php8.4-curl \
    && rm -rf /var/lib/apt/lists/*

# Composer
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin \
    --filename=composer

# Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_$NODE_VERSION.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g pnpm \
    && rm -rf /var/lib/apt/lists/*

# Copy app
COPY . .

# Install backend deps
RUN composer install --no-dev --optimize-autoloader --no-interaction

# SQLite database
RUN mkdir -p database \
    && touch database/database.sqlite \
    && chmod -R 777 database storage bootstrap/cache resources/actions resources/routes resources/wayfinder

#RUN mkdir -p \
#    storage/framework/cache \
#    storage/framework/sessions \
#    storage/framework/views \
#    bootstrap/cache \
# && chmod -R 777 storage bootstrap/cache


#RUN cp .env.example .env \
#    && php artisan key:generate

# Install frontend deps + build
RUN pnpm install && pnpm run build

#RUN pnpm install
#
## DEBUG: run artisan directly with max verbosity
#RUN php artisan wayfinder:generate --with-form -vvv || true
#
#RUN pnpm run build

EXPOSE 80

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=80"]
