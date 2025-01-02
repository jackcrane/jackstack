# JackStack

An extremely opinionated starter stack for building full-stack applications the Jack way.

## Stack

- React
- Node.js (Express)
- PostgreSQL
- Prisma
- Postmark
- Jest
- Supertest
- ESLint
- Prettier
- Docker

## Features

#### Basics

- React
- Node.js
- PostgreSQL
- Prisma

#### Code Quality

- ESLint
- Vitest
- Supertest
- Codecov

#### Ops

- Docker
- GitHub Actions

### Third Party Integrations

- Postmark Email Delivery
- ip-api.com IP Geolocation
- React Email[^1]

## Getting Started

1. Clone the repo and delete the `.git` folder

```bash
git clone https://github.com/jackcrane/jack-stack.git your-project-name
cd your-project-name
rm -rf .git
git init
```

2. Create the `.env` file

```bash
cp .env.example .env
```

```bash
DATABASE_URL="postgresql://..." # Your PostgreSQL connection string
POSTMARK_API_TOKEN="..." # Your Postmark API token. You can get this from the Postmark dashboard. It looks like a uuid.
JWT_SECRET="..." # A random string.
```

3. Install dependencies

```bash
cd api && yarn install
cd ..
cd app && yarn install
```

4. Start the server

```bash
cd api && yarn start
```

```bash
cd api && yarn dev
```

5. Start the frontend

```bash
cd app && yarn start
```

6. Open the app in your browser

> Visit [http://localhost:5173](http://localhost:5173) to view the app. The server is running on 3000 but unless you are testing an API endpoint, you should not need to use it.

## Testing

This project uses Vitest for testing on the backend. Tests are available via

```bash
yarn test
```

```bash
yarn coverage
```

Typical vitest arguments can be passed to the above commands (e.g. `yarn coverage --ui`).

Frontend tests are not currently available.

Test files are colocated with their respective route files inside of a `test` folder and named `*.test.js`.

[^1]: NOTE: React Email is ~sort of~ supported, but is not really and requires some manual work after the inital setup. The workflow is: (1) Write the email in React, (2) `yarn email:export`, (3) change the extension from `html` to `hbs`, (4) copy the new email template into the `react-email/complete` folder. To prevent having to redo work, instead of using typical React templating, include variables (in this case `name`) as follows: `{"{{name}}"}`.