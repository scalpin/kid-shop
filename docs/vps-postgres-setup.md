# PostgreSQL на VPS для krokha-trikotazhevna.ru

Текущая dev-база в проекте поднимается локально через Docker. Для прода лучше держать PostgreSQL на том же VPS, что и Next.js, и не открывать порт `5432` наружу.

## 1. DNS

В панели домена нужно создать/изменить A-запись:

```text
krokha-trikotazhevna.ru.  A  157.22.190.39
www                       A  157.22.190.39
```

Сейчас домен должен указывать именно на IP нового VPS.

## 2. Установка PostgreSQL на Ubuntu

Подключиться к серверу:

```bash
ssh root@157.22.190.39
```

Установить PostgreSQL:

```bash
apt update
apt install -y postgresql postgresql-contrib
systemctl enable --now postgresql
```

Создать базу и пользователя. Пароль ниже нужно заменить на свой длинный пароль.

```bash
sudo -u postgres psql
```

```sql
CREATE USER kroha_app WITH PASSWORD 'CHANGE_ME_LONG_PASSWORD';
CREATE DATABASE kroha_trikotazhevna OWNER kroha_app;
GRANT ALL PRIVILEGES ON DATABASE kroha_trikotazhevna TO kroha_app;
\q
```

PostgreSQL по умолчанию на Ubuntu слушает локально. Так и оставляем: приложение на этом же VPS будет ходить в БД через `127.0.0.1`.

## 3. ENV для сайта на VPS

В `.env.production` или в переменных окружения сервиса:

```text
DATABASE_URL=postgres://kroha_app:CHANGE_ME_LONG_PASSWORD@127.0.0.1:5432/kroha_trikotazhevna
DATABASE_SSL=false
```

## 4. Заливка схемы и тестовых данных с локального компьютера

Самый безопасный способ — SSH-туннель, без открытия PostgreSQL в интернет.

В первом терминале:

```bash
ssh -L 55433:127.0.0.1:5432 root@157.22.190.39
```

Во втором терминале из папки проекта:

```bash
DATABASE_URL=postgres://kroha_app:CHANGE_ME_LONG_PASSWORD@localhost:55433/kroha_trikotazhevna npm run db:reset
```

На Windows PowerShell:

```powershell
$env:DATABASE_URL='postgres://kroha_app:CHANGE_ME_LONG_PASSWORD@localhost:55433/kroha_trikotazhevna'
npm run db:reset
```

## 5. Важно перед продом

- Не открывать порт `5432` наружу в firewall.
- Сделать ежедневный backup БД.
- Файлы товаров лучше хранить либо в S3-совместимом хранилище в РФ, либо на VPS в отдельной папке с регулярным backup.
- Для 2 ГБ ОЗУ лучше начать с PostgreSQL + Next.js + nginx на одном сервере, без лишних контейнеров в проде.
