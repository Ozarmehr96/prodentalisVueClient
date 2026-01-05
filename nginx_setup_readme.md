# README: Настройка Nginx для ProDentalis (Vue + ASP.NET Core + PWA + HTTPS)

## 1️⃣ Установка необходимых пакетов

На Ubuntu / Debian:

```bash
# Установка nginx
sudo apt update
sudo apt install nginx -y

# Установка Certbot для получения бесплатных SSL сертификатов
sudo apt install certbot python3-certbot-nginx -y

# Проверяем версии
nginx -v
certbot --version
```

---

## 2️⃣ Размещение файлов сайта

**Vue SPA (клиент)**:

```text
/var/www/prodentalis/prodentalis-client  # сюда кладем собранный Vue (npm run build → dist)
```

**Лэндинг**:

```text
/var/www/prodentalis/landing  # сюда кладем файлы landing page (index.html, assets)
```

**Backend (ASP.NET Core)**:

- Слушает Kestrel на порту 5000 (`http://0.0.0.0:5000`)  
- Пример `appsettings.json`:

```json
"Kestrel": {
  "Endpoints": {
    "Http": {
      "Url": "http://0.0.0.0:5000"
    }
  }
}
```

---

## 3️⃣ Настройка Nginx

Создаем файл для клиента:

```bash
sudo nano /etc/nginx/sites-available/app.prodentalis.ru
```

Пример конфигурации с комментариями:

```nginx
server {
    server_name app.prodentalis.ru;

    # -------------------------
    # 1️⃣ HTTPS (SSL)
    # -------------------------
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/prodentalis.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/prodentalis.ru/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # -------------------------
    # 2️⃣ Backend API (ASP.NET Core)
    # -------------------------
    location ^~ /api/ {
        proxy_pass http://127.0.0.1:5000;   # без слэша в конце
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # -------------------------
    # 3️⃣ Swagger UI (если есть)
    # -------------------------
    location ^~ /swagger/ {
        proxy_pass http://127.0.0.1:5000/swagger/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # -------------------------
    # 4️⃣ SPA (Vue)
    # -------------------------
    root /var/www/prodentalis/prodentalis-client;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

### Лэндинг (prodentalis.ru)

```nginx
server {
    server_name prodentalis.ru www.prodentalis.ru;

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/prodentalis.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/prodentalis.ru/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /var/www/prodentalis/landing;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 4️⃣ HTTP → HTTPS редирект

```nginx
server {
    listen 80;
    server_name prodentalis.ru www.prodentalis.ru app.prodentalis.ru;
    return 301 https://$host$request_uri;
}
```

---

## 5️⃣ Проверка конфигурации и перезапуск

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 6️⃣ Получение и продление SSL через Certbot

```bash
sudo certbot --nginx
```

- Выбираем домены, которые хотим защитить  
- Certbot автоматически обновит конфиги и сертификаты  
- Сертификаты продлеваются автоматически через cron

---

## 7️⃣ Как работает PWA и backend через nginx

1. **Vue SPA** и PWA обслуживаются nginx напрямую → быстрый фронтенд  
2. **Все запросы /api/** → проксируются на Kestrel → ASP.NET Core backend  
3. **Swagger UI** → через отдельный `location /swagger/` проксируется на backend  
4. **HTTPS обязательный** для PWA, чтобы:  
   - работали сервис-воркеры  
   - работали камеры и push уведомления на Android/iOS  
5. **Vue SPA** ловит все остальные пути и возвращает `index.html` → поддержка SPA роутинга

---

## 8️⃣ Проверка работы

- Backend API: `https://app.prodentalis.ru/api/health` → JSON ответ ✅  
- Swagger: `https://app.prodentalis.ru/swagger/index.html` → UI ✅  
- Vue SPA / PWA: `https://app.prodentalis.ru/` → работает, можно «Add to Home Screen» ✅

---

Теперь у тебя есть **готовый production-ready nginx конфиг**, PWA, Vue SPA и ASP.NET Core backend под HTTPS.

