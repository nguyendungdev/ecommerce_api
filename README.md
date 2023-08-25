
# E-commerce API
  
## Introduction
### Purpose of this Repository
This is a main goals of this repository:
- This API provides the backend services for managing products, orders, payments, invoices, and more for your e-commerce platform.

## Folder structure

```ts
+-- config // Environment config files.
+-- src // Sources files
|   +-- auth
|   |   +-- guards // Guards.
|   |   +-- strategies // Authentication stratergies.
|   +-- categories
|   +-- common // Common files.
|   |   +-- constants // Common constants.
|   |   +-- decorators // Common decorators.
|   |   +-- interceptors // Common interceptors.
|   |   +-- response // General response definition.
|   |   +-- serializers // Common serializers.
|   |   +-- decorators // Custom decorators
|   +-- configs // Configurations folder.
|   |   +-- app // Application config.
|   |   +-- database // Database config.
|   +-- modules // Bussiness Modules.
|   |   +-- users // Example user module.
|   |   |   +-- dto // DTO (Data Transfer Object) Schema, Validation.
|   |   |   +-- user.entity.ts // TypeORM Entities.
|   |   |   +-- users.constants.ts // Example constants file.
|   |   |   +-- users.controller.ts // Example controller.
|   |   |   +-- users.module.ts // Example module file.
|   |   |   +-- users.repository.ts // Example repository.
|   |   |   +-- users.service.ts // Example service.
|   |   +-- email // Email module
|   |   +-- invoice // Invoice module
|   |   +-- order // Order module
|   |   +-- payment // Payment module
|   |   +-- product // Product module
+-- test // Jest testing.
+-- app.module.ts // App module file.
+-- main.ts // Main.
```

### Prerequisites
---
My recommand node.js version is dubnium and latest docker version.

* Install node.js: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

* Install Docker Desktop for MAC: [https://docs.docker.com/docker-for-mac/install/](https://docs.docker.com/docker-for-mac/install/)

* Install Docker Desktop for Windows: [https://docs.docker.com/docker-for-windows/install/](https://docs.docker.com/docker-for-windows/install/)

* Install compose: [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)


## Configuration

### Environment variable
1. Create `config/development.env` and `config/prodution.env` based on `config/sample.env`.
2. Modify `config/development.env` and `config/production.env` files for each environment.
3. Modify `src/configs/configs.constants.ts` to import these environment values to the project.

```bash
$ git clone https://github.com/yukioqna/ecommerce-backend.git
```
## Installation
### Install npm packages
```bash
$ npm install
```

Create file named `.env` (format like `development.env`) to set your Data base connection information

```
# DataBase connection information
DB_TYPE="postgres"
DB_HOST="localhost"
DB_PORT=5433
DB_USERNAME=""
DB_PASSWORD=""
DB_DATABASE="ecormmerce"
DB_SYNCHRONIZE=true
```


Next up, generate postgres sql.

If you already have postgres sql in your development environment, you can use that.

But if you don't have one or both, try this process.

Install docker for your OS from link in top of this documentation.

And run followed command.

If your docker is successfully installed, you can start with docker compose.

```bash
  docker-compose up
  If container is created, you can access api on http://localhost:3011
  And you can access database through http://localhost:3306.
```

And then, you can connect postgresql in http://localhost:3306, user name 'root' and password is 'test'.

Finaly, your develop environment is created.

You can start api with followed command.

```bash
  npm run start
```

And if you modify code and save, you can see the process detect code changes and restart it self.
## Documentation
### Swagger
```bash
# API, Swagger - src/swagger.ts
npm run doc:api #> http://localhost:3011/api
```
- This project ultilize <a href='https://docs.nestjs.com/openapi/cli-plugin'> NestJS's CLI Plugin </a>.
- Please aware that there is no need to put `@ApiProperty` decorator for every DTOs properties. For more information, please visit the link above.
## License

  Nest is [MIT licensed](LICENSE).