# 20260211-lesson12-agenda

## Table of Contents

1. [Points to highlight](#points-to-highlight)

2. [Project Dependencies](#project-dependencies)

3. [(EJS) Templating - what it is and how it works](#ejs-templating---what-it-is-and-how-it-works)

4. [Sessions and Storage](#sessions-and-storage)

5. [Flash](#flash)

6. [Redirect](#redirect)

7. [Diagram Session + Flash + MongoDB Interaction in Express](#diagram-session--flash--mongodb-interaction-in-express)

8. [References](#references)

<p align="center">************************</p>

## Points to highlight

Back to [Table of Contents](#table-of-contents) above.

NOTE 1:

    I've renamed the following values for clarity - the same value was used in multiple locations but for different purposes.

    | type      | location                | original value         | current value              |
    | --------- | ----------------------- | ---------------------- | -------------------------- |
    | file name | jobs-ejs root directory | ./views/secretWord.ejs | ./views/secretWordView.ejs |
    | string    | ./app.js                | secretWord             | secretWordEndPoint         |
    | variable  | ./app.js                | session                | sessionStore               |

NOTE 2:

    In a previous lesson ("Jobs API - part 1" lesson) we used JWT tokens for signin authentication.

    This week we're using the "express-session" dependency for the same purpose.

    While this lesson also also covers server-side rendering, JWT can also be used in place of the "express-session" dependency.

    Likewise, while the "Jobs API - part 1" lesson uses client-side rendering, the "express-session" dependency could be used in place of JWT.

<p align="center">************************</p>

## Project Dependencies

Back to [Table of Contents](#table-of-contents) above.

This project is built with **Node.js, Express, MongoDB, EJS, and session-based authentication**. Below is a breakdown of all runtime and development dependencies and their purpose in the application.

### 🔗 Runtime Dependencies (`dependencies`)

These packages are **required for the application to run** in both development and production.

### Uncategorized

##### **express**

- Web framework used to build the HTTP server
- Handles routing, middleware, and request/response flow

##### **ejs** <--**NEW CODE**

- Server-side templating engine
- Used to render dynamic HTML views with data from the server

##### **dotenv**

- Loads environment variables from a `.env` file into `process.env`
- Used for secrets, database URIs, ports, and environment config

#### **Sessions & Authentication**

##### **express-session** <--**NEW CODE**

- Manages user sessions via cookies
- Stores per-user data such as login state and preferences

##### **connect-mongodb-session** <--**NEW CODE**

- Persists session data in MongoDB
- Ensures sessions survive server restarts and scale across instances

##### **connect-flash** <--**NEW CODE**

- Stores temporary session messages (success/error)
- Commonly used after redirects for user feedback

##### **passport** <--**NEW CODE** (not discussed in the lesson but used in a future lesson)

- Authentication middleware
- Handles login state, serialization, and session integration

##### **passport-local** <--**NEW CODE** (not discussed in the lesson but used in a future lesson)

- Local username/email + password authentication strategy
- Typically used with bcrypt for password verification

##### **bcryptjs**

- Secure password hashing library
- Used to hash and compare user passwords safely

#### **Database**

##### **mongoose**

- Object Data Modeling (ODM) library for MongoDB
- Provides schemas, models, and validation

#### **Security & Protection**

##### **helmet**

- Sets secure HTTP headers
- Protects against common vulnerabilities like clickjacking and MIME sniffing

##### **express-rate-limit**

- Limits repeated requests from the same IP
- Used to prevent brute-force attacks and abuse

##### **host-csrf**

- CSRF (Cross-Site Request Forgery) protection middleware
- Prevents malicious cross-site form submissions

##### **xss-clean**

- Sanitizes user input
- Helps prevent cross-site scripting (XSS) attacks

##### **cookie-parser**

- Parses cookies into `req.cookies`
- Useful for CSRF protection and custom cookie handling

#### **Error Handling**

##### **express-async-errors**

- Automatically forwards errors thrown in async routes
- Eliminates the need for repetitive try/catch blocks

### 🛠️ Development Dependencies (`devDependencies`)

These packages are **only used during development** and are not required in production.

#### **nodemon**

- Automatically restarts the server when files change
- Improves development speed and workflow

#### **eslint** <--**NEW CODE** (but not discussed in the lesson nor pertinent to the lesson)

- Static code analysis tool
- Helps catch bugs and enforce best practices

#### **prettier** <--**NEW CODE** (but not discussed in the lesson nor pertinent to the lesson)

- Opinionated code formatter
- Keeps the codebase clean and consistent

### 🧠 Dependency Summary

- **dependencies** → Required for the app to function
- **devDependencies** → Improve developer experience and code quality
- **Sessions** are stored in MongoDB for production safety
- **Security middleware** is included to reduce common web vulnerabilities

<p align="center">************************</p>

## (EJS) Templating - what it is and how it works

Back to [Table of Contents](#table-of-contents) above.

A **template engine** is a tool that:

> **Takes an HTML template + some data → produces final HTML**

Server-side rendering generates HTML on the server (back end) before sending it to the browser.

Compared to client-side rendering (front end) builds HTML in the browser. React is an example of client-side rendering.

You can think of templating as:

- An HTML file with **placeholders**
- Plus a renderer that **fills those placeholders with real values**

The browser **never sees the template**.
It only receives **fully rendered HTML**.

### Why this is needed

Without a template engine, a server has two bad options:

#### ❌ Send raw HTML strings

```js
res.send("<h1>Hello Alice</h1>");
```

This quickly becomes unreadable and unmaintainable.

#### ❌ Create separate HTML files for every case

```js
res.sendFile("profile-alice.html");
res.sendFile("profile-bob.html");
```

This doesn’t scale at all.

### What a template engine enables instead

With a template engine, you write **one reusable HTML template**:

```ejs
<h1>Hello <%= name %></h1>
```

And render it with different data:

```js
res.render("profile", { name: "Alice" });
```

The server sends this to the browser:

```html
<h1>Hello Alice</h1>
```

So instead of:

- Many HTML files

You get:

- **One template**
- **Many data values**

### Key idea

> A template engine lets the server **combine structure (HTML) with data (JavaScript values)** to generate pages dynamically.

### Alternative template engines to EJS

- **Pug** (formerly Jade)
- **Handlebars** (`hbs` / `express-handlebars`)
- **Nunjucks**
- **Mustache**
- **React / JSX-style engines**

That’s the minimal list.

### Where to find the EJS template code

- First wired in the [./app.js](../app.js) file.

- Template files found in the [./views/](../views/) directory.

<p align="center">************************</p>

## Sessions and Storage

Back to [Table of Contents](#table-of-contents) above.

### What problem are sessions solving?

HTTP is **stateless**.
Every request is independent.

Sessions allow us to:

- Store **per-user data**
- Persist that data across requests
- Keep users isolated from each other

In this lesson (see "session v.1" in the app.js file), session data is stored in **MongoDB** instead of memory.

### How MongoDB Session Store works

#### High-level flow

```
Browser
  │
  │ 1. Request (no cookie on first visit)
  ▼
express-session middleware
  │
  │ 2. Creates req.session
  │ 3. Saves session in MongoDB
  │ 4. Sends back session ID cookie (connect.sid)
  ▼
Browser stores cookie
  │
  │ 5. Future requests include cookie
  ▼
express-session
  │
  │ 6. Reads session ID from cookie
  │ 7. Loads session data from MongoDB
  ▼
req.session (available to route handlers)
```

### Step-by-step summary

1. **First visit**
   - No session cookie exists.
   - `express-session` creates `req.session = {}`.
   - Session is saved to MongoDB.
   - A cookie (`connect.sid`) containing the **session ID** is sent to the browser.

2. **Subsequent requests**
   - Browser sends the cookie.
   - Express reads the session ID.
   - Session data is loaded from MongoDB.
   - `req.session` is populated for that request.

### Important Concepts

#### 1️⃣ Cookie vs Session Data

- The **cookie only stores the session ID**.
- The **actual session data lives in MongoDB**.
- Multiple users → multiple session documents.
- Server restart → sessions still exist (because MongoDB persists).

#### 2️⃣ What a session document looks like

Example (simplified):

```js
{
  _id: "sessionIdHere",
  session: {
    cookie: { /* metadata */ },
    secretWord: "syzygy",
    flash: {
      info: ["The secret word was changed."],
      error: []
    }
  }
}
```

- `secretWord` is per-user.
- `flash` messages are stored inside the session.
- Cookie metadata is also stored.

#### 3️⃣ Cookie configuration (MongoDB Session Store)

From `app.js`:

- `sameSite: "strict"`
  → Cookie only sent on same-site requests (helps prevent CSRF)

- `secure: false` (development)
  → Cookie allowed over HTTP

- `secure: true` (production)
  → Cookie sent only over HTTPS

- `app.set("trust proxy", 1)` in production
  → Required when behind services like Render

### What you’ll see in DevTools

| Property | Value (MongoDB Session Store)  |
| -------- | ------------------------------ |
| Name     | `connect.sid`                  |
| Value    | Random session ID              |
| Domain   | localhost (dev)                |
| Path     | `/`                            |
| Secure   | false (dev), true (production) |
| SameSite | Strict                         |

Remember:

- If you restart the server → cookie still valid.
- MongoDB still has the session → user state is restored.

### Comparison: In-Memory Session Store (see "session v.0" in the app.js file) vs MongoDB Session Store

In-Memory Session Store (previous lesson) used the **default in-memory store**.

| Feature             | In-Memory Session Store | MongoDB Session Store |
| ------------------- | ----------------------- | --------------------- |
| Storage Location    | Server RAM              | MongoDB               |
| Survives Restart    | ❌ No                   | ✅ Yes                |
| Production Ready    | ❌ No                   | ✅ Yes                |
| Cookie Flags Config | Defaults                | Explicitly configured |

#### Key Difference

- **In-Memory Session Store:** Restart server → all sessions disappear.
- **MongoDB Session Store:** Restart server → sessions restored from MongoDB.

Everything else (how cookies work, how `req.session` behaves) is conceptually the same.

<p align="center">************************</p>

## Flash

Back to [Table of Contents](#table-of-contents) above.

### What is Flash?

**Flash messages are temporary session messages.**

They are designed to:

- Survive a redirect
- Appear exactly once
- Automatically disappear after being read

They are commonly used for:

- Success messages
- Error messages
- Login/logout feedback
- Form validation messages

Flash is powered by the `connect-flash` middleware, and it depends on `express-session`.

### Why Flash is Needed

In Express, after handling a POST request, we usually redirect:

```js
res.redirect("/secretWordEndPoint");
```

This follows the **PRG pattern (Post → Redirect → Get)**.

Problem:

- If you send a message during POST,
- The redirect triggers a new request,
- Any local variables are lost.

Flash solves this by temporarily storing messages in the session.

## How Flash Works (Under the Hood)

Flash is just structured session usage.

#### On POST

```js
req.flash("info", "The secret word was changed.");
req.flash("error", "That word won't work!");
```

What happens:

1. Message is stored inside `req.session.flash`
2. Session is saved to MongoDB
3. Redirect happens

#### On the Next GET

```js
req.flash("info");
req.flash("error");
```

What happens:

1. Flash reads messages from session
2. Returns them as an array
3. **Deletes them immediately**

That’s why:

- The message appears once
- Refreshing the page does not show it again

### Where Flash Lives

Inside the MongoDB session document:

```js
{
  session: {
    cookie: { ... },
    secretWord: "syzygy",
    flash: {
      info: ["The secret word was changed."],
      error: ["You can't use words that start with p."]
    }
  }
}
```

Flash is not separate storage.
It is stored inside the session.

### How It Connects to Your App

#### In `app.js`

Enable flash:

```js
app.use(require("connect-flash")());
```

Make flash messages available to templates:

```js
res.locals.info = req.flash("info");
res.locals.errors = req.flash("error");
```

Now EJS can display them.

### Mental Model

Think of flash as:

> “Write to session now, read once later, then auto-delete.”

It gives you temporary, per-user messaging that survives redirects without polluting permanent session state.

### Key Takeaways

- Flash depends on sessions.
- Messages are stored in MongoDB (because sessions are).
- Messages persist across one redirect.
- Messages disappear after being read.
- Flash is ideal for user feedback after form submissions.

<p align="center">************************</p>

## Redirect

Back to [Table of Contents](#table-of-contents) above.

"Redirect" is mentioned in the [Flash](#flash) section above. Also, notice that this `res.redirect("/secretWordEndPoint");` line of code is in app.js file.

### Without Redirect

If you did this:

```js
res.render("secretWordView");
```

after a POST, then:

- User submits form ✅
- Page renders ✅
- User hits refresh ❗
- Browser warns: “Resubmit form?”
- If they confirm → POST runs again

That means:

- The form resubmits
- The data changes again
- Flash messages repeat
- Side effects can duplicate

That’s bad UX and potentially dangerous.

---

### With Redirect (PRG)

Flow becomes:

```
POST  →  Redirect  →  GET
```

Now:

- User submits form ✅
- Server processes it ✅
- Redirect happens ✅
- Final page is a GET ✅
- User refreshes page → only GET runs

No duplicate form submission.

---

### Why Flash Needs Redirect

Flash exists **because of redirects**.

If we didn’t redirect:

- We could just render the page and pass a message directly.

But since redirect creates a brand-new request:

- Normal variables disappear.
- We need somewhere to temporarily store the message.
- That place is the **session**.
- Flash writes to session.
- Next request reads it.
- Then deletes it.

So:

> Redirect creates a second request.
> Flash allows data to survive that one extra request.

<p align="center">************************</p>

## Diagram Session + Flash + MongoDB Interaction in Express

Back to [Table of Contents](#table-of-contents) above.

Perfect — let’s tighten that section so it reinforces:

- Sessions live in MongoDB
- Flash lives inside the session
- The cookie only carries the session ID
- Flash is written on POST and consumed on GET

You can replace your current **Diagram Session + Flash + MongoDB Interaction in Express** section with this:

## Diagram: Session + Flash + MongoDB Interaction in Express

Back to [Table of Contents](#table-of-contents) above.

### The 5 Pieces Involved

1. **Browser** → stores the session cookie (`connect.sid`)
2. **express-session** → reads/writes `req.session`
3. **MongoDBStore** → persists session documents
4. **connect-flash** → stores temporary messages in the session
5. **Route + EJS template** → reads session + flash data

### Full Request Lifecycle (POST → Redirect → GET)

This is the important mental model.

```
(1) Browser submits POST
        │
        ▼
(2) express-session
        │
        │  Reads session ID from cookie
        │  Loads session from MongoDB
        ▼
(3) Route handler (POST)
        │
        │  req.session.secretWord = "newWord"
        │  req.flash("info", "Secret word changed")
        │
        ▼
(4) Session saved to MongoDB
        │
        ▼
(5) res.redirect(...)
        │
        ▼
──────── NEW REQUEST ────────
        │
        ▼
(6) express-session
        │
        │  Reads cookie again
        │  Loads updated session from MongoDB
        ▼
(7) Route handler (GET)
        │
        │  res.locals.info = req.flash("info")
        │
        │  ↑ Reads AND deletes flash messages
        ▼
(8) EJS renders page
        │
        ▼
(9) Browser receives HTML with message
```

### What Just Happened?

- The browser **never saw the flash message directly**.
- The message was:
  - Stored in the session
  - Persisted in MongoDB
  - Retrieved on the next request
  - Deleted immediately after being read

Flash works because sessions persist across requests.

### Visual: Where Everything Lives

```
Browser
  └── Cookie: connect.sid=abc123
                │
                ▼
MongoDB
  └── Session Document
        ├── cookie metadata
        ├── secretWord
        └── flash
             ├── info[]
             └── error[]
```

Important:

- Cookie → only contains session ID
- MongoDB → contains all session data
- Flash → lives inside the session document

### One-Sentence Mental Model for Students

> Flash is temporary data stored inside the session, persisted in MongoDB, and automatically deleted after one read.

<p align="center">************************</p>

## References

Back to [Table of Contents](#table-of-contents) above.

1. Dependencies

   a. https://ejs.co/

   b. https://www.npmjs.com/package/express-session

   c. https://www.npmjs.com/package/connect-mongodb-session

   d. https://www.npmjs.com/package/connect-flash

2. [Server Side Rendering with EJS](https://classes.codethedream.org/course/node-v3/lion?week=14&lesson=Server%20Side%20Rendering%20with%20EJS) lesson

3. [MongoDB](https://www.mongodb.com/) database - no new content this week. But the database is used for this lesson.

4. _no video this lesson_

---

Back to [Table of Contents](#table-of-contents) above.
