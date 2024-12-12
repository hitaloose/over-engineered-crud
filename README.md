# Over-Engineered CRUD (in progress)

A TypeScript project showcasing a robust architecture for user registration with features like domain-driven design, clean architecture, and test-driven development. Designed for scalability and maintainability, this project uses tools and best practices to deliver an over-engineered CRUD solution.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Technologies Used](#technologies-used)
- [Development Practices](#development-practices)
- [License](#license)

---

## Overview
This project implements a user registration use case with:
- Input validation for passwords and existing users.
- Separation of concerns using clean architecture principles.
- Mock repositories for easy testing.

The primary goal is to provide a reference for building highly structured and maintainable applications using TypeScript.

---

## Features
- **Domain-Driven Design**: Clear separation of domain logic, use cases, and infrastructure.
- **Test-Driven Development**: Comprehensive unit tests using Vitest.
- **Static Analysis**: Enforced through ESLint and Prettier.
- **Modern Build Tools**: Leveraging Vite for configuration.

---

## Project Structure
```
├── src/
│   ├── main/                # Application entry point
│   │   └── index.ts         # Initializer
│   ├── application/         # Application-specific logic
│   │   ├── cryptography/    # Cryptographic utilities
│   │   ├── mocks/           # Mock implementations for testing
│   │   ├── repositories/    # Interfaces for data persistence
│   │   └── usecases/        # Application use cases
│   ├── domain/              # Core business logic
│   │   ├── entities/        # Domain entities
│   │   ├── errors/          # Domain-specific errors
│   │   └── usecases/        # Domain use case interfaces
├── tests/                   # Integration tests
├── commitlint.config.mjs    # Commit linting rules
├── eslint.config.mjs        # ESLint configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── package.json             # Dependencies and scripts
```

---

## Getting Started
### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) (v9 or later)

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

### Running the Project
Start the application in development mode:
```bash
npm run dev
```

---

## Scripts
| Command          | Description                                       |
|------------------|---------------------------------------------------|
| `npm run start`  | Run the project in production mode.              |
| `npm run dev`    | Run the project in development mode.             |
| `npm run test`   | Run unit tests with Vitest.                      |
| `npm run lint`   | Analyze code quality with ESLint.                |
| `npm run format` | Automatically fix lint issues.                   |
| `npm run prepare`| Setup Git hooks using Husky.                     |

---

## Technologies Used
- **Core**: [TypeScript](https://www.typescriptlang.org/), [Express](https://expressjs.com/)
- **Testing**: [Vitest](https://vitest.dev/), [@faker-js/faker](https://fakerjs.dev/)
- **Linting & Formatting**: [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)
- **Build Tools**: [Vite](https://vitejs.dev/)
- **Utilities**: [Husky](https://typicode.github.io/husky/), [TSX](https://github.com/esbuild-kit/tsx)

---

## Development Practices
- **Commit Linting**: Enforced with `@commitlint/config-conventional`.
- **Import Sorting**: Managed with `@ianvs/prettier-plugin-sort-imports`.
- **Coding Standards**: Enforced with TypeScript and ESLint configurations.

---

## License
This project is licensed under the [MIT License](LICENSE).
