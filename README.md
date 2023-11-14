
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
|   +-- common // Common files.
|   |   +-- constants // Common constants.
|   |   +-- decorators // Common decorators.
|   |   +-- interceptors // Common interceptors.
|   |   +-- types // Custom types
|   +-- configs // Configurations folder.
|   |   +-- app // Application config.
|   |   +-- database // Database config.
|   +-- modules // Bussiness Modules.
|   |   +-- users // Example user module.
|   |   |   +-- dto // DTO (Data Transfer Object) Schema, Validation.
|   |   |   +-- user.entity.ts // TypeORM Entities.
|   |   |   +-- user.constants.ts // Example constants file.
|   |   |   +-- user.controller.ts // Example controller.
|   |   |   +-- user.module.ts // Example module file.
|   |   |   +-- user.repository.ts // Example repository.
|   |   |   +-- user.service.ts // Example service.
|   |   +-- email // Email module
|   |   +-- invoices // Invoice module
|   |   +-- orders // Order module
|   |   +-- order-item // Order-item module
|   |   +-- sessions // Session module
|   |   +-- forgot  // forgot module
|   |   +-- payments // Payment module
|   |   +-- products // Product module
|   |   +-- reviews// Review module
|   |   +-- categories// Product module
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


## Installation
### Clone the repository
```bash
$ git clone https://github.com/yukioqna/ecommerce-backend.git
```

### Environment variable
1. Create `config/development.env` and `config/prodution.env` based on `config/sample.env`.
2. Modify `config/development.env` and `config/production.env` files for each environment.
3. Modify `src/configs/configs.constants.ts` to import these environment values to the project.

### Quick install
```bash
$  bash setup.sh
```
## Running the app

```bash
# run seed 
$ npm run seed:run

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

```

## Documentation
### Swagger
```bash
# API, Swagger
- <http://localhost:3000/api>.
```

## License

  Nest is [MIT licensed](LICENSE).