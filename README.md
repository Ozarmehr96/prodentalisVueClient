# Настройка клиентской части ProDentalis (Vue.js + Nginx)

## 1. Сборка Vue.js проекта для продакшн

В папке вашего проекта выполните команду:

```bash
npm install      # Установка зависимостей
npm run build    # Сборка проекта для продакшн
```

По умолчанию сборка попадет в папку `dist/`. Для удобства скопируйте содержимое в директорию на сервере, например:

```bash
sudo mkdir -p /var/www/prodentalis/prodentalis-client
sudo cp -r dist/* /var/www/prodentalis/prodentalis-client/
```

## 2. Настройка Nginx

Создайте файл конфигурации для Nginx:

```bash
sudo nano /etc/nginx/sites-available/prodentalis-client
```

Пример содержимого:

```nginx
server {
    listen 80;
    server_name your_domain_or_ip;  # замените на свой домен или публичный IP

    root /var/www/prodentalis/prodentalis-client;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Создайте символическую ссылку в `sites-enabled`:

```bash
sudo ln -s /etc/nginx/sites-available/prodentalis-client /etc/nginx/sites-enabled/
```

## 3. Проверка конфигурации и перезапуск Nginx

```bash
sudo nginx -t        # Проверка конфигурации
sudo systemctl restart nginx
sudo systemctl enable nginx  # Автозапуск при старте системы
```

## 4. Настройка прав доступа

Убедитесь, что директория с клиентом имеет правильного владельца:

```bash
sudo chown -R www-data:www-data /var/www/prodentalis/prodentalis-client
sudo chmod -R 755 /var/www/prodentalis/prodentalis-client
sudo systemctl restart nginx
```

```bash NGNIX

############################################################
# 1️⃣ prodentalis.ru — лэндинг
############################################################

server {
    listen 80;  # Порт HTTP
    server_name prodentalis.ru www.prodentalis.ru;

    # Корневая папка лэндинга
    root /var/www/prodentalis/landing;
    index index.html;

    # SPA роутинг (если нужно)
    location / {
        try_files $uri $uri/ /index.html;
    }
}

############################################################
# 2️⃣ app.prodentalis.ru — клиент Vue (собранный)
############################################################

server {
    listen 80;
    server_name app.prodentalis.ru;

    # Корень собранного Vue проекта (dist)
    root /var/www/prodentalis/prodentalis-client;
    index index.html;

    # SPA роутинг (чтобы все пути обрабатывались Vue)
    location / {
        try_files $uri $uri/ /index.html;
    }
}

```

## 5. Проверка

Откройте ваш домен или публичный IP в браузере. Должна отобразиться клиентская часть вашего Vue.js приложения.

> Все запросы на маршруты будут корректно обрабатываться благодаря `try_files /index.html;` в конфигурации Nginx.

