# Wednesday Solution's CloudNative Template! 🚀

This is a monorepo template built using TurboRepo. Under the hood we have Fastify Service which is running with a Postgres instance.

# Guides

The monorepo works on K8s for local development and also is deployable on K8s and is fully cloudnative follow the guides below for quick and easy setup.

- [Developer's Guide](https://github.com/wednesday-solutions/fastify-postgres/blob/main/DEVELOPERS_GUIDE.md)

# Philosophy

No code is a bad code. The code you start with is always good code because you and your team (even if you're the only team 🙃) agreed upon it. What we have in this repository is also good code. Well not exactly good, but in our *opinion* good code.

Good code because it follows what we wanted it to follow. Then what is bad code? No code repository becomes bad code repository in a day or two. It becomes *bad/unmaintainable/unscalable/sluggish* with time. Call it whatever you want bad code is easily recognizable. And it falls down to you to fix and then maintain it.

There are several things in this repository that help catch what a human eye might miss. Linters, Type Checkers, Editor configurations, pre-commit hooks, and much more. But they can be avoided because they are bypassable. And that is exactly what makes the good code bad.

So rules to live by:

1. Linter is your friend *NOT* your enemy; don't bypass it (feel free to change the initial rules)
2. Follow the code style that you decide upon (establish it with your team)
3. Use comments to let the other devs know what the code does
4. Don't bypass the pre-commit hooks, it starts as "just this one time" and becomes a "let's do it who cares"
5. Write tests that actually test the logic that you're trying to implement, make sure to write tests first and then write logic accordingly

# Technology Used 👨‍💻

The following are the technology that this template utilizes.

- [TurboRepo](https://turbo.build/repo/docs)
- [Fastify](https://www.fastify.io/)
- [Postgres](https://www.postgresql.org/)
- [Sequelize](https://sequelize.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Kubernetes](https://kubernetes.io/)

# Architecture of the template 🏗

The template is a monorepo where the main applications are in the `/apps` directory.
Aside that we also have several `packages` that we store in the `packages` directory that provided shared config and code.

We use [`dotenv-cli`](https://www.npmjs.com/package/dotenv-cli) to pass the `environment` files based on what `NODE_ENV` we wanna use. The monorepo utilizes K8s for development too, please refer the developer's guide to know more.

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

We also support Integration tests. To be honest Integration testing simply means that you just normally run your application in a test environment. The test runner provides you with features to handle opening and closing your application. For testing the backend we run our integration tests against a real database and a redis instance both of which will be running inside their own docker containers.

The process of creating integration tests is quite similar to how we created Unit tests above. However there is a subtle catch. For testing be it Unit or Integration testing we generally create setup file(s) that help us do stuff after, before, or in between with any logic we want. Maybe you wanna create your database instance before you even start testing! In such a case prefer using Jest CLI flags to pass the `setupFilesAfterEnv` with the file path you wanna initialize.

This has been done in the `alpha` service which shows a good example of how to use different support files based upon if we're running unit tests or integration tests.

### **Setting up postgres and redis for testing**

We have a bash script and a `docker-compose` that will automatically spin up a postgres and a redis instance (you require [`docker`](https://www.docker.com/) and [`docker-compose`](https://docs.docker.com/compose/)). The postgres and the redis instance also define their required envs in `docker-compose.yml` itself.

You can start the postgres and redis instance on docker using:

```shell
pnpm start:svc
```

For teardown you can use:

```shell
pnpm stop:svc
```

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

## Development Scripts 📝

Development scripts are there to you help you out with a bunch of stuff. Few are listed below!

| **Purpose**                     | **Script**                  |
|---------------------------------|-----------------------------|
| Install dependencies            | pnpm i                      |
| Start development server        | pnpm start:dev              |
| Create and run qa build         | pnpm start:qa               |
| Create and run prod build       | pnpm start:prod             |
