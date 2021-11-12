# Next.js / Hasura (GraphQL) / Auth0 Sample

> Currently, a sample repository connecting three of the most exciting tools out there!

- [Prerequisites](#prerequisites)
- [Development](#development)
- [License](#license)

## Prerequisites

You'll need the following to get started.

1. [Node.js and npm](https://nodejs.org/en/download/)
   1. at least LTS Version: 14.17.6 (includes npm 6.14.15)
2. A running [Hasura](https://hasura.io/) server or cloud instance
3. A database instance: [PostgreSQL](https://www.postgresql.org/)

The repository makes it very easy to spin up a deployment using [docker-compose](https://docs.docker.com/compose/). All
required files are located in `/docker/compose`.

## Development

Start by installing all required dependencies: `npm install`.

### Local secrets

Next, copy the `.env` file to `.env.local` and adapt the environment variables as needed.

### Starting docker-compose

In case you'll use the `/docker/compose`-setup, get it started by running the following command:

```shell
docker-compose -f docker/compose/docker-compose.yml --env-file .env.local up -d
```

This will take care of schema and metadata management as well.

### Migrate to the latest schema

Use the following commands if you have to manage hasura manually.

**Careful:** PostgreSQL must have the extension `uuid-ossp` enabled.

```shell
cd hasura && \
npx hasura migrate apply --envfile ../.env.local && \
npx hasura metadata apply --envfile ../.env.local
```

### Start Next.js

At this point you're already good to go, as long as you don't introduce changes to the schema. You can now
`npm run dev` and access the webapp on [http://localhost:3000](http://localhost:3000).

### Further instructions

Further instructions, also about setting up Auth0, are given
in [`DEVELOPMENT.md`](https://github.com/bbortt/event-planner/blob/release/DEVELOPMENT.md).

## License

This project is licensed under the terms of
the [Apache 2.0 License](https://github.com/bbortt/event-planner/blob/release/LICENSE).
