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
- Пагинация списков (по 10 элементов).
- Интерактивная документация Swagger с поддержкой авторизации.

## Как запустить локально
1. Клонируйте репозиторий: `git clone https://github.com/ваш_никнейм/hotel-api-drf.git`
2. Создайте виртуальное окружение: `python -m venv venv`
3. Активируйте его: `venv\Scripts\activate` (Windows)
4. Установите зависимости: `pip install django djangorestframework djangorestframework-simplejwt drf-spectacular`
5. Выполните миграции: `python manage.py migrate`
6. Запустите сервер: `python manage.py runserver`
7. Перейдите к документации: `http://127.0.0.1:8000/api/docs/