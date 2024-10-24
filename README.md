# Full-Stack CRUD Application

## Overview

This is a full-stack CRUD application built using **Next.js** with TypeScript for both the frontend and backend. The application serves as a dashboard for managing resources (e.g., products, users, etc.) and showcases the implementation of Create, Read, Update, and Delete functionalities.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication with Clerk
- CRUD operations for managing resources
- Responsive design with Tailwind CSS
- Dashboard interface with data visualization using Tanstack Table
- File upload functionality using Uploadthing
- Linting and formatting with ESLint and Prettier

## Technologies Used

- **Next.js**: A React framework for building server-rendered applications.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Prisma**: An ORM for relational databases, facilitating database interactions.
- **PostgreSQL**: A relational SQL database used to store application data.
- **Clerk**: User authentication and management service.
- **Tailwind CSS**: A utility-first CSS framework for styling the application.
- **Axios**: For making HTTP requests.
- **React Hook Form**: For managing form state and validation.
- **Zod**: For schema validation.

## Installation

To get started with this project, follow the steps below:

1. **Clone the repository:**

```bash
git clone https://github.com/YOUR_USERNAME/crud.git
cd crud
```

2. **Install dependencies:**

```bash
Copy code
npm install
```
3. **Set up your environment variables:**

Create a .env file in the root directory of the project and add your database connection string and Clerk API keys:

```env
Copy code
DATABASE_URL="your_postgresql_database_url"
CLERK_API_KEY="your_clerk_api_key"
CLERK_FRONTEND_API="your_clerk_frontend_api"
```

4. **Run database migrations:*()

```bash
Copy code
npx prisma migrate dev
npx prisma generate
```

5. **Initialize Database:**

```bash
node ./init_db/initialize-database.js
```

6. Start the development server:

```bash
Copy code
npm run dev
```

7. **Open your browser:**

Navigate to http://localhost:3000 to view the application.
