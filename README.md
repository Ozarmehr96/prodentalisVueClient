### История изменений

## 2026.03.09.1
- Отмена заказа директором. Отображение списка примерок. Экспорт заказов заказчиков.

## 2026.03.01.1
- Отображение зубов в формате FDI в квадрате при печати заказа. Журнал выплат зарплаты сотрудникам. Управление выплатами.

## 2026.02.23.1
- Экспорт финансового отчета.

## 2026.02.08.1
- Исправлено отображение кнопки отмены задачи при просмотре заказа. 
- Улучшено отображение финансов.
- Сортировка расходных материалов при просмотре себестоимости работ.

## 2026.01.16.1
- Добавлена возможность управления заказчиками. 
- Автоматический расчет стоимости заказа.
- Исправлена отображение картинов типов работ.
- Исправлена печать заказа: qr отображается справа от данные о заказе без отступа.

## 2026.01.01.1
- Реализована возможность добавления связанных этопов к этапу для их запуска.

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

cp -r /var/www/prodentalis /var/www/backups/prodentalis051125
## 3. Проверка конфигурации и перезапуск Nginx

```bash
sudo nginx -t        # Проверка конфигурации
sudo systemctl restart nginx
sudo systemctl enable nginx  # Автозапуск при старте системы
```

## 4. Настройка прав доступа

Убедитесь, что директория с клиентом имеет правильного владельца:

```bash
cp -r /var/www/prodentalis/ /var/www/backups/prodentalis050125

sudo chown -R www-data:www-data /var/www/prodentalis/prodentalis-client
sudo chmod -R 755 /var/www/prodentalis/prodentalis-client
sudo systemctl restart nginx
sudo nginx -t        # Проверка конфигурации
sudo systemctl restart nginx
sudo systemctl enable nginx  # Автозапуск при старте системы
```

```bash NGNIX

############################################################
# 1️⃣ prodentalis.ru — лэндинг
############################################################
sudo nano /etc/nginx/sites-available/prodentalis-client
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


## Сертификаты
Successfully deployed certificate for prodentalis.ru to /etc/nginx/sites-enabled/prodentalis-client
Successfully deployed certificate for app.prodentalis.ru to /etc/nginx/sites-enabled/prodentalis-client
Successfully deployed certificate for www.prodentalis.ru to /etc/nginx/sites-enabled/prodentalis-client
Congratulations! You have successfully enabled HTTPS on https://prodentalis.ru, https://app.prodentalis.ru, and https://www.prodentalis.ru


## Настройки NGINX с SSL

# sudo nano /etc/nginx/sites-available/prodentalis-client
############################################################
# 1️⃣ prodentalis.ru — лэндинг
############################################################

server {  # Порт HTTP
    server_name prodentalis.ru www.prodentalis.ru;

    # Корневая папка лэндинга
    root /var/www/prodentalis/landing;
    index index.html;

    # SPA роутинг (если нужно)
    location / {
        try_files $uri $uri/ /index.html;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/prodentalis.ru/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/prodentalis.ru/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


}

############################################################
# 2️⃣ app.prodentalis.ru — клиент Vue (собранный)
############################################################

server {
    server_name app.prodentalis.ru;

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/prodentalis.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/prodentalis.ru/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # -------------------------
    # 🔹 Backend API Фотографии
    # Картинки которые загружают для типов задач и тд, хранятся на серваке бэке. Поэтому управляем именно в nginx.
    # Например: https://app.prodentalis.ru/api/images/worktypes/ea4caa6b-ade7-4416-b4c4-2896568428dc.webp приходит такой запрос с клиента
    # перенавравляем в бэк так http://127.0.0.1:5000/images/.....
    # -------------------------
    location ^~ /api/images/ {
        proxy_pass http://127.0.0.1:5000/images/;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }


    # -------------------------
    # 🔹 Backend API (наш бк слушает HTTP, мы с помощью NGINX перенаправляем на нужный порт). Клиент должен отправить запрос /api
    # Мы обращаемся к БЭК через NGINX
    # -------------------------
    location ^~ /api/ {
        proxy_pass http://127.0.0.1:5000; 
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # -------------------------
    # 🔹 SPA (Vue)
    # -------------------------
    root /var/www/prodentalis/prodentalis-client;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}



server {
    if ($host = www.prodentalis.ru) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = prodentalis.ru) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name prodentalis.ru www.prodentalis.ru;
    return 404; # managed by Certbot




}

server {
    if ($host = app.prodentalis.ru) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name app.prodentalis.ru;
    return 404; # managed by Certbot


}



