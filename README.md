## Development

Requires deployment and access to dynamodb table.

Run docker compose(linux): `docker compose up -V --build`

## Deployment

Requires setting up env in `infra/bin/infra.ts` and hosted zone with domain names in `infra/lib/infra-stack.ts`.

Deploy: `cd infra && npm run deploy`

App is deployed [https://todo-app.avtspace.com/](https://todo-app.avtspace.com/).

