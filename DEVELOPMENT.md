# Developer Instructions

## Getting Started

After cloning the repository, you need to do two things.

- [Setup a PostgreSQL database](#postgresql-configuration)
- [Configure Auth0](#auth0-configuration)

That's it, you're ready to go. Run the following commands in two separate terminals to create a blissful development
experience:

```shell
./gradlew -x webapp & npm start
```

### PostgreSQL configuration

Run the following command in the root folder of the project:

```shell
docker-compose -f src/main/docker/postgresql.yml up -d
```

### Auth0 configuration

Follow the instructions given [in `JHIPSTER.md`](https://github.com/bbortt/event-planner/blob/main/JHIPSTER.md#auth0).
Make sure that you export the following environment variables with your secret values:

- `APPL_OAUTH2_AUDIENCE`
- `APPL_OIDC_CLIENT_ID`
- `APPL_OIDC_CLIENT_SECRET`
- `APPL_OIDC_ISSUER_URI`
