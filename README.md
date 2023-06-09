# Bitespeed Backend Task: Identity Reconciliation

**Hosted api endpoint**: https://bitespeed-coding-challenge.onrender.com

## How to start this server
- Download and install `nvm`. Configure it to use `node v16`.
- Create a `.env` file in the root directory.
- Update your env file with `DB_URL`.
Example:
```sh
DB_URL=postgres://username:password@host/db
```
- Run `npm i` to install node dependencies.
- Run `npm run compile` to compile the project.
- To start the server run `node build/src/index.js`

- Database Schema is share in `sql/create-contact-table.sql`. Use it to create the neccessary tables in your database.
- You can use Postman or curl to test the `/identify` endpoint.
Sample curl:
```sh
curl --location --request POST 'http://localhost:3000/identify' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "a@bc.com",
    "phoneNumber": "717171"
}'
```

## What can be done better
- Docker images for server.
- API documentation using swagger.
- Unit tests. If I had more time, I would have gone for at least 90% coverage. However the code I wrote is very testable. I tried to create interfaces wherever possible, which helps isolate and mock dependencies when testing.
- Add pre commit hooks to repository for linting, fixing and testing.
- Add a migrations system for doing database migrations. We can use the migrations functionality of `knex.js` ORM which I used for SQL queries.
- Add terraform or cloudformation scripts.

## Design decisions
- Separate business logic from application logic.
- Use dependency injection.
- Prefer composition over inheritance.
- Always use interfaces.
- Always try to provide strong transactional guarantees and use database transactions wherever needed.

