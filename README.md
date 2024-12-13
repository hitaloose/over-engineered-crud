# Over-Engineered CRUD

Welcome to the **Over-Engineered CRUD** project! This repository contains a robust and modular implementation of a CRUD system built with a focus on scalability, maintainability, and best practices in software development. The project leverages TypeScript, Express, TypeORM, Zod, and other modern tools.

## Table of Contents

1. [Features](#features)
2. [Technologies](#technologies)
3. [Project Structure](#project-structure)
4. [Setup Instructions](#setup-instructions)
5. [Scripts](#scripts)
6. [Usage](#usage)
7. [Testing](#testing)
8. [Contributing](#contributing)
9. [License](#license)

---

## Features

- **Authentication**: Basic user registration with validation and password hashing.
- **Modularity**: Clear separation of concerns across different layers (domain, application, presentation, infra).
- **Validation**: Powered by Zod to ensure robust input validation.
- **Database Management**: Uses SQLite with TypeORM for ORM capabilities.
- **Error Handling**: Comprehensive error handling for a seamless user experience.
- **Code Quality**: Pre-configured ESLint and Prettier for consistent code styling and formatting.

---

## Technologies

- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **ORM**: [TypeORM](https://typeorm.io/)
- **Validation**: [Zod](https://zod.dev/)
- **Testing**: [Vitest](https://vitest.dev/)
- **Cryptography**: [Bcrypt](https://www.npmjs.com/package/bcrypt)

---

## Project Structure

```plaintext
src/
├── application/        # Application-level use cases and mocks
├── domain/             # Domain entities, contracts, and business logic
├── infra/              # Infrastructure implementations (database, validators, cryptography)
├── main/               # Entry point, factories, and setup
├── presentation/       # Controllers, adapters, and decorators
```

Key Configuration Files:
- **`tsconfig.json`**: TypeScript compiler configuration.
- **`eslint.config.mjs`**: ESLint rules for consistent coding style.
- **`vite.config.ts`**: Vite configuration for tests.
- **`commitlint.config.mjs`**: Commit linting configuration for conventional commits.

---

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18.x
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [SQLite](https://www.sqlite.org/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hitaloose/over-engineered-crud.git
   cd over-engineered-crud
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Prepare Husky hooks:
   ```bash
   npm run prepare
   ```

---

## Scripts

Here are the available npm scripts:

| Script            | Description                                           |
|-------------------|-------------------------------------------------------|
| `npm run start`   | Starts the application.                               |
| `npm run dev`     | Starts the app in development mode with hot reload.   |
| `npm run clean`   | Cleans the `dist` directory.                          |
| `npm run build`   | Compiles TypeScript to JavaScript.                    |
| `npm run test`    | Runs tests using Vitest.                              |
| `npm run lint`    | Runs ESLint to check for coding standard violations.  |
| `npm run format`  | Formats code using Prettier.                          |

---

## Usage

### Starting the Application

Run the development server:

```bash
npm run dev
```

The server will start on [http://localhost:3333](http://localhost:3333).

### API Endpoints

#### Register a User

- **POST** `/auth/register`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "passwordConfirmation": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com"
  }
  ```

---

## Testing

Run the unit tests:

```bash
npm run test
```

### Key Testing Tools:
- **Vitest**: For unit and integration testing.
- **Faker.js**: For generating mock data in tests.

---

## Contributing

We welcome contributions to improve this project. Please follow the steps below:

1. Fork this repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/).
4. Push to your fork and submit a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

Feel free to explore and contribute to **Over-Engineered CRUD**! 🎉
