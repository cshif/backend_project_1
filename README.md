# project_1

A backend practice project.

## Stack
- Node framework: [Express.js](https://expressjs.com/)
- database: [PostgreSQL](https://www.postgresql.org/)
- ORM: [Prisma](https://www.prisma.io/)
- validation: [express-validator](https://express-validator.github.io/docs) / [joi](https://joi.dev/)
- HTTP request logger: [morgan](https://github.com/expressjs/morgan)
- mailer: [nodemailer](https://nodemailer.com/)
- API docs generator: [jsdoc](https://jsdoc.app/)
- testing: [Jest](https://jestjs.io/) & [SuperTest](https://github.com/ladjs/supertest)

## Setup

1. Clone the repository
```
git clone git@github.com:cshif/backend_project_1.git
```

2. Copy and fill in the environment variables
```
cp .env.example .env
```

3. Install the dependencies
```
yarn install
```

4. Done!

## Execute
```
yarn start
```

## Project Structure

```
.
├── /prisma
│  ├── /migrations
│  ├── client.js
│  └── schema.prisma
├── /src
│  ├── /common
│  │  ├── /classes
│  │  ├── /handlers
│  │  ├── /middlewares
│  │  └── /utils
│  ├── /config
│  ├── /constants
│  ├── /devtools
│  ├── /modules
│  │  └── /user
│  │      ├── /application
│  │      │  └── UserService.js
│  │      ├── /domain
│  │      │  └── UserEntity.js
│  │      ├── /infrastructure
│  │      │  └── UserRepository.js
│  │      └── /presentation
│  │          ├── validator
│  │          ├── UserController.js
│  │          └── UserRoutes.js
│  ├── app.js
│  └── server.js
└── /tests
```
