# Jobs EJS Application

## Overview

The **Jobs EJS Application** is a simple web application that allows users to:

- Register and log in securely.
- View and update a secret word stored in their session.
- Manage job listings (CRUD operations) tied to their account.

The app uses **Express**, **EJS templates**, **MongoDB**, and **Passport.js** for authentication. Security is enhanced with **CSRF protection**, **XSS cleaning**, **rate limiting**, and **secure session management**.

## How It Works

1. **Authentication:**
   Users register with name, email, and password. Passwords are hashed with **bcrypt** before being stored in MongoDB.
   Authentication is handled by **Passport.js** using the local strategy.

2. **Sessions & Flash Messages:**
   Sessions are stored in MongoDB via `connect-mongodb-session`. Flash messages allow the app to show errors or info messages to the user.

3. **CSRF Protection:**
   The app uses **host-csrf** to protect against Cross-Site Request Forgery. CSRF tokens are injected into forms automatically.

4. **Views:**
   Templates are written in **EJS**, with partials for headers, footers, and flash messages.
   Logged-in users can access `/secretWordEndPoint` and `/jobs`. Non-logged-in users are redirected to `/`.

5. **Security:**
   - **helmet** for HTTP headers
   - **xss-clean** to sanitize user input
   - **rate limiting** to prevent brute-force attacks

## Getting Started

### Prerequisites

- Node.js >= 18.x
- MongoDB (local or hosted)
- npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/JamieBort/jobs-ejs.git
cd jobs-ejs
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=<your-mongodb-connection-string>
SESSION_SECRET=<your-session-secret>
```

### Running Locally

**Development (with automatic reloads):**

```bash
npm run start dev
```

**Production-like start:**

```bash
npm start
```

The app will run on `http://localhost:3000`.

### Using the App

- Navigate to `/sessions/register` to create a new account.
- Navigate to `/sessions/logon` to log in.
- After logging in, access:
  - `/secretWordEndPoint` to view/change your secret word.
  - `/jobs` to manage your job listings.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes.
4. Commit your changes: `git commit -m "Add your message here"`
5. Push to your branch: `git push origin feature/your-feature-name`
6. Open a Pull Request.

### Guidelines

- Keep code clean and well-commented.
- Follow existing project structure and naming conventions.
- Include tests or ensure functionality is verified.

## Code of Conduct

We expect contributors to follow a professional, respectful, and inclusive code of conduct:

- Be kind and considerate.
- Use welcoming and inclusive language.
- Respect privacy and data of users.
- Report unacceptable behavior via GitHub issues.

## License

This project is licensed under the MIT License. See the [LICENSE.txt](./LICENSE.txt) file for details.
