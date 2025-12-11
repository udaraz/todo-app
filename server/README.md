# TODO API (Laravel)

## Setup
1. Clone repository
2. Run `composer install` (Make sure composer installed)
3. Copy `.env.example` to `.env` 
4. Configure database in `.env`:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=todo-app
   DB_USERNAME=root
   DB_PASSWORD=
   ```
5. Run `php artisan migrate --seed` 
6. Run `php artisan serve`

## API Endpoints
- POST /api/login - Login
- POST /api/register - Register
- GET /api/v1/todos - Get all todos
- POST /api/v1/todos - Create todo
- PUT /api/v1/todos/{id} - Update todo
- PATCH /api/v1/todos/{id}/done - Toggle done status
- DELETE /api/v1/todos/{id} - Delete todo

## Assumptions
- Using MySQL instead of MongoDB
