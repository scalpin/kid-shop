# Локальная база и перенос каталога в прод

Рабочая схема:

```text
локальная PostgreSQL-база → проверка каталога и прайса → экспорт → импорт на VPS
```

Продовую базу руками не трогаем во время экспериментов. На сервер отправляем только финальную локальную версию каталога.

## 1. Запуск локальной базы

```powershell
npm run db:up
npm run db:migrate
npm run dev
```

Проверка:

```text
http://localhost:3000/catalog
http://localhost:3000/prices
```

Локальная БД:

```text
host: localhost
port: 55432
database: kroha_trikotazhevna
user: kroha
password: kroha_dev_password
```

Эти данные можно использовать в DBeaver, DataGrip, TablePlus или другом редакторе PostgreSQL.

## 2. Тестовые и реальные товары

Залить тестовые товары:

```powershell
npm run db:seed
```

Очистить локальную таблицу товаров перед реальным заполнением:

```powershell
npm run db:clear:products -- --yes
```

После этого можно вносить реальные товары в локальную БД.

Если npm съедает флаг `--yes`, используй короткую команду:

```powershell
npm run db:clear:products:yes
```

## 3. Картинки

Для картинок, которые должны уехать на VPS вместе с каталогом, используй папку:

```text
public/uploads
```

Например:

```text
public/uploads/products/bodi-001/main.jpg
```

В поле `images` в базе указывай путь от корня сайта:

```text
/uploads/products/bodi-001/main.jpg
```

Скрипт переноса автоматически отправляет папку `public/uploads` на VPS, если она существует.

## 4. Проверочный экспорт

Экспортировать локальные товары в JSON:

```powershell
npm run db:export:products
```

Файл появится в:

```text
db/exports
```

Проверить импорт без изменения базы:

```powershell
npm run db:import:products -- db/exports/products-...json --dry-run
```

На Windows удобнее так:

```powershell
npm run db:import:products:dry-run -- db/exports/products-...json
```

## 5. Перенос локального каталога в прод

Важно: команда ниже заменяет всю таблицу `products` в продовой базе.

```powershell
npm run prod:push-products
```

Скрипт попросит ввести:

```text
PUSH PRODUCTS
```

После подтверждения он:

1. экспортирует локальные товары;
2. отправит JSON на VPS;
3. отправит `public/uploads`, если папка есть;
4. заменит таблицу `products` в продовой БД;
5. перезапустит сервис сайта.

Если нужно без интерактивного подтверждения:

```powershell
npm run prod:push-products -- --yes
```

Если npm съедает `--yes`, используй:

```powershell
npm run prod:push-products:yes
```

## 6. Что не переносится этой командой

Команда переносит только:

- таблицу `products`;
- папку `public/uploads`.

Код сайта переносится отдельно обычным путём:

```powershell
git push origin master
```

На сервере:

```bash
deploy-kroha
```
