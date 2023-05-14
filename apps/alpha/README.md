# Alpha

The `alpha` service! This service deals with most of the work right now!

## Migrations

We're using Sequelize as an ORM to interact with the database. However we're using `Umzug` to manage the migrations. Umzug is a framework agnostic Nodejs migration tool. And it does exactly what it says keep track of migrations in your DB.

We have a `migrate.ts` file that contains the `seeder` and the `migrator`, both of them use Umzug to perform migration and database seeding. We use `ts-node` to run the file in isolation which also means the application itself is not required for migrations and seeding.

The migration accepts the following commands through NPM Scripts:

- `pnpm run migrate:main:setup` - Will run SQL to create `main` database [REQUIRED]
- `pnpm run migrate:main:up` - Will run the latest migrations.
- `pnpm run migrate:down` - Will revert the last ran migration.
- `pnpm run migrate:purge` - Sequentially removes all the migrations and resets DB to the zero state.

The commands above are self explainatory. As far as the migrations themselves go we have two dirs,

1. `migrations` - contains all the db migrations and their revert (down) scripts
2. `seeders` - contains all the seeding data

To create a new migration simply create a new `<counter>-your-migration-name.sql` replace `<counter>` with the next number in line with the existing migrations. Also don't forget to create a down migration with the exact same name in the `migrations/down` directory.

NOTE: The name of the `up` migration and the `down` migration's sql file MUST be same.

## Seeding

For development purposes we also have a seeder that uses the `SeederMeta` to keep track of the previously ran seeders. In the same way as the migrations we have `seeder` running through the NPM Scripts.

- `pnpm run seed:up` - Updates the DB with the seeding data
- `pnpm run seed:down` - Removes the seeds inserted.

NOTE: Migrations MUST be applied first before running/inserting the seed data.

Create your seeds in the `seeders` directory. For removing the seeds and keeping a track of them exactly how you do with migrations, just create a `down` function and you're done. Look at the initially provided seeding scripts to get more idea about it.
