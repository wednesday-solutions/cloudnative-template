# Fastify and Postgres with TurboRepo! 🚀

This is a monorepo template built using TurboRepo. Under the hood we have Fastify Service which is running with a Postgres instance.

# Technology Used 👨‍💻

The following are the technology that this template utilizes.

- [TurboRepo](https://turbo.build/repo/docs)
- [Fastify](https://www.fastify.io/)
- [Postgres](https://www.postgresql.org/)
- [Sequelize](https://sequelize.org/)
- [TypeScript](https://www.typescriptlang.org/)

# Architecture of the template 🏗

The template is a monorepo where the main applications are in the `/apps` directory.
Aside that we also have several `packages` that we store in the `packages` directory that provided shared config and code.

The database configurations and any functions that interact with the database are too stored in the common `database` directory.

We use [`dotenv-cli`](https://www.npmjs.com/package/dotenv-cli) to pass the `environment` files based on what `NODE_ENV` we wanna use.

# Testing 👨‍🔬

We use `Jest` test-runner for testing out the application.
The `alpha` application has both `Unit tests` and `Integration tests` done. We'd suggest you to have a look at how they are implemented and feel free to augment them to your liking.

For running unit tests across all your applications the following need to be done. Do note Turbo and Jest are already hooked up for Unit and Integration testing across all the application(s) present in the `apps` directory.

However the TurboRepo pipeline specified in `turbo.json` requires you to have same names across the applications only then your application would be included in the pipeline.

## Unit Testing 🧪

You can create Jest patterns by specifying a `jest.config.js` file in your application and change your config as you wish. However for testing create an npm script with the name `test:unit` and this will automatically hook it in your TurboRepo pipeline. And then just run `pnpm run test:unit` from the root directory. That will automatically run all the unit tests across each of your applications.

**Steps for reference**

1. Create a `jest.config.js` file at the base directory of your application.
2. Extend the common `jest.config.js` by importing it in `jest.config.js` by doing `require('../../jest.config.js')`
3. Define your unit test patterns and write a bunch of unit tests.
4. Create an npm script with the following name `test:unit` and it should execute unit testing.
5. Do `pnpm run test:unit` at your root directory and watch your unit tests run!

## Integration Testing 🤖

We also support Integration tests. To be honest Integration testing simply means you just normally run your application in the test environment. The test runner provides you with features to handle opening and closing your application. For testing the backend we run our integration tests against a real database which will be running inside a docker container.

The process of creating integration tests is quite similar to how we created Unit tests above. However there is a subtle catch. For testing be it Unit or Integration testing we generally create setup file(s) that help us do stuff after, before, or what ever in between logic we want. Maybe you wanna create your database instance before you even start testing! In such a case prefer using Jest CLI flags to pass the `setupFilesAfterEnv` with the file path you wanna initialize.

This has been done in the `alpha` service which shows a good example of use different support files based upon if we're running unit tests or integration tests.

### **Setting up an postgres database instance for testing**

We have a bash script and a `docker-compose` that will automatically spin up a postgres instance (you require [`docker`](https://www.docker.com/) and [`docker-compose`](https://docs.docker.com/compose/)). The postgres instance also defines the required envs in the docker compose itself.

You can start the postgres instance on docker using:

```shell
pnpm start:postgres
```

For teardown you can use:

```shell
pnpm stop:postgres
```

For creating a quick instance to the testing database we have a function called `createSequelizeInstanceForTesting` from `packages/database/src/core/instance.ts` which can imported through `fastify-postgres-database` shared package. The function defines the configuration to connect to the database for testing automatically.

```typescript
import { createSequelizeInstanceForTesting } from 'fastify-postgres-database';

const instanceForTesting = createSequelizeInstanceForTesting();
```

The instance can now be used with other functions or database related stuff to talk with the database.

*IMPORTANT* - Don't forget to close your connection to your database in your setup file in the `afterAll` block or this will leave it hanging and jest will report for open handles.

### **Steps for reference**

1. Create your `setup-jest` file depending upon if you're using TypeScript or JavaScript
  - Setup `beforeAll` and `afterAll` logic in this file
  - Its a good idea to connect to your `db` here and close connection to it in the `afterAll` block
  - You can also clear your database in the `beforeEach` block which will run before each and every test
2. Create integration tests directory and write integration tests
3. Create an npm script with the following name `test:integration` and it should execute integration tests.
  - PS: You can use `testPathPattern` CLI flag to specify in which directory your integration tests reside in
4. Do `pnpm run test:integration` at your root directory and watch your integration tests run!

### **Development Scripts**

| **Purpose**                     | **Script**                  |
|---------------------------------|-----------------------------|
| Install dependencies            | pnpm i                      |
| Start development server        | pnpm start:dev              |
| Create and run qa build         | pnpm start:qa               |
| Create and run prod build       | pnpm start:prod             |
| compose development             | pnpm development:up         |
| rebuild and compose development | pnpm development:up --build |
