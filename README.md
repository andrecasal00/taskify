<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


### PROJECT UNDER DEVELOPMENT


## Description

This is a project that is under development with the purpose of making a project management easier.

## Installation Steps

⚠️ Before we begin it's necessary to have the Nest CLI installed previously. If you don't have it, install it by running the following command:
```bash
$ npm i -g @nestjs/cli
```

### 1. it is necessary to install all the dependecies that this project uses

```bash
$ npm install
```

### 2. it is necessary to run the docker-compose file

```bash
$ docker-compose up -d
```

### 3. we need to migrate our prisma file

```bash
$ npx prisma migrate dev
```

### 4. after the prisma migration, it is necessary to run the seed

```bash
$ npx prisma db seed
```

### 5. running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


### Database Design

![database](https://i.imgur.com/hoqwXYe.png)


### API Documentation

http://localhost:3000/api/