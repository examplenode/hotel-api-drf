# Hotel 5* REST API

RESTful API для управления отелем, разработанное на Django REST Framework.

## Стек технологий
- Python / Django
- Django REST Framework (DRF)
- Simple JWT (Аутентификация)
- drf-spectacular (Swagger UI)
- SQLite (База данных)

## Функционал
- **3 связанные модели:** Номера (Room), Гости (Guest), Бронирования (Booking).
- Полный CRUD для всех моделей.
- Обязательная JWT-аутентификация (Bearer Token).
- Регистрация клиента: `POST /api/register/` (username, email, password), вход: `POST /api/token/`.
- Клиент может только просматривать номера, изменять их может только администратор.
- Пагинация списков (по 10 элементов).
- Интерактивная документация Swagger с поддержкой авторизации.

## Как запустить локально
1. Клонируйте репозиторий: `git clone https://github.com/ваш_никнейм/hotel-api-drf.git`
2. Создайте виртуальное окружение: `python -m venv venv`
3. Активируйте его: `venv\Scripts\activate` (Windows)
4. Установите зависимости: `pip install django djangorestframework djangorestframework-simplejwt drf-spectacular`
5. Выполните миграции: `python manage.py migrate`
6. Запустите сервер: `python manage.py runserver`
7. Перейдите к документации: `http://127.0.0.1:8000/api/docs/`

## Клиентское приложение (Vue.js)
Находится в папке `frontend`. Сделано на Vue 3 + Vue Router, сборка через Vite.

Возможности:
- вход и регистрация, JWT-токены хранятся в `localStorage`, при истечении access-токена он обновляется через refresh;
- просмотр списков номеров, гостей и бронирований (с пагинацией), просмотр записи, создание, редактирование и удаление;
- страницы без входа недоступны: пользователь перенаправляется на `/login`;
- проверка полей в форме, вывод ошибок от API и уведомления об успешных действиях.

Запуск (сервер Django должен быть запущен на порту 8000):
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Откройте `http://localhost:5173/`

Vite перенаправляет запросы `/api` на `http://127.0.0.1:8000` (см. `vite.config.js`), поэтому настраивать CORS в Django не нужно.

Структура `frontend/src`:
- `api.js` — запросы к API, вход/выход, токены, уведомления;
- `entities.js` — описание полей моделей Room, Guest, Booking;
- `router.js` — маршруты и защита страниц;
- `views/` — страницы: вход, список, просмотр, форма.
