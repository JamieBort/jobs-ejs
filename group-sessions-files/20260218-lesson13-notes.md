# 20260218-lesson13-notes

## Table of Contents

1. [Summary Of Lesson](#summary-of-lesson)

2. [Note about digital accessibility](#note-about-digital-accessibility)

3. [Points to highlight](#points-to-highlight)

4. [Project Dependencies](#project-dependencies)

5. [Order of operations for the completing assignment](#order-of-operations-for-the-completing-assignment)

6. [Flow of logic](#flow-of-logic)

7. [Resources](#resources)

<p align="center">************************</p>

## Summary Of Lesson

Back to [Table of Contents](#table-of-contents) above.

The lesson teaches how to add **user authentication** to a server-rendered Node.js app using **Passport** and the **passport-local** strategy. It walks you through creating login and registration views, updating headers to show the logged-in user, and setting up routes and controllers for registering, logging in (with Passport), and logging out. You then configure Passport with a local strategy that checks email and password against your MongoDB user model, and add session support so `req.user` is available. Finally the tutorial shows how to protect routes so only authenticated users can access them.

<p align="center">************************</p>

## Note about digital accessibility

Back to [Table of Contents](#table-of-contents) above.

This week's lesson mentions the existence of digital accessibility (A11Y) and shares a few resources. I am coming back to this topic because it is important and deserves more attention for at least two reasons.

First, as mentioned in the lesson, the goal of digital accessibility is to ensure that the same resources available to people without disabilities are equally available to people with disabilities. By improving the experience for those who rely on accessible design, we also create a better, more usable experience for everyone — including those who may not explicitly depend on accessibility features. As software developers, as we grow in our careers and deepen our expertise in our specialized fields, we should each advocate for people with disabilities by intentionally expanding our knowledge and skills to build more accessible software.

Second, the field of digital accessibility continues to grow — much like software testing, cybersecurity, front-end development, and UI/UX — it has established itself as a discipline in its own right. In other words, accessibility (A11Y) is a specialized field where someone can build an entire career focused exclusively on creating inclusive digital experiences. Case in point, in 2020 GitHub's first accessibility contribution to their users was providing dark mode. And only last year did they formally join the [Global Accessibility Awareness Day Pledge](https://gaad.foundation/what-we-do/gaad-pledge) (GAAD Pledge), when they debuted this [Accessibility](https://accessibility.github.com/) page. Another example, not until 2021 did the [New York City government](https://www.nyc.gov/site/mopd/initiatives/digital-accessibility.page) finally adopt "the [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/TR/WCAG21/) Level AA standard." WCAG sets the technical standards for web accessibility. There is plenty of opportunity for people to become more involved in this field.

Next Steps: I will leave it to you to look into this further. Aside from the resources shared in the [lesson](https://classes.codethedream.org/course/node-v3/lion?week=15&lesson=Authentication%20with%20Passport), you could also search online for a combination of `a11y`, `resources`, `standards`, `accessibility`, `digital accessibility`, and `software development`. And while I am not at all an expert in the field, you're always welcome to DM me with question. I'll do my best to get you a sufficient answer.

Note: a variation of this was also shared [here](https://codethedream.slack.com/archives/C01SFH46W72/p1771513562236669).

<p align="center">************************</p>

## Points to highlight

Back to [Table of Contents](#table-of-contents) above.

1. Naming mismatch in the assignment

   a. util vs utils
   - Last weeks [lesson](https://classes.codethedream.org/course/node-v3/lion?week=14&lesson=Server%20Side%20Rendering%20with%20EJS) says to create a `utils` directory.

   - However this week's [lesson](https://classes.codethedream.org/course/node-v3/lion?week=15&lesson=Authentication%20with%20Passport) references `util/parseValidationErrs.js` file which is in the `util/` directory.

   - And next week's [lesson](https://classes.codethedream.org/course/node-v3/lion?week=16&lesson=Final%20Project%20Begins) also references the `util/` directory.

   - I chose to rename the director in question as `util/`.

   b. parseValidationErr vs parseValidationErrs
   - Similar to the util vs utils above.

   - parseValidationErrs is used in later lessons so I chose that one.

2. In the previous lesson I renamed the following values for clarity - the same value was used in multiple locations but for different purposes. I am sharing this again here because it remains relevant.

   | type      | location                | original value         | current value              |
   | --------- | ----------------------- | ---------------------- | -------------------------- |
   | file name | jobs-ejs root directory | ./views/secretWord.ejs | ./views/secretWordView.ejs |
   | string    | ./app.js                | secretWord             | secretWordEndPoint         |
   | variable  | ./app.js                | session                | sessionStore               |

<p align="center">************************</p>

## Project Dependencies

Back to [Table of Contents](#table-of-contents) above.

Same as last week. But this week we're discussing and working with passport and passport-local.

**passport** <-- **Were using this dependency in this lesson**

- Authentication middleware
- Handles login state, serialization, and session integration

**passport-local** <-- **Were using this dependency in this lesson**

- Local username/email + password authentication strategy
- Typically used with bcrypt for password verification

<p align="center">************************</p>

## Order of operations for the completing assignment

Back to [Table of Contents](#table-of-contents) above.

A. Setup template files

1.  Create and populate [views](../views/) and [partials](../views/partials/).

    Nothing new here. Simply populating files and then updating an old file.

    No observable changes on the website until we establish some routes/endpoints.

B. Setup Router and Controller

2. Create and populate [routes/sessionRoutes.js](../routes/sessionRoutes.js)

3. Create and populate [controllers/sessionController.js](../controllers/sessionController.js)

4. Create and populate [util/parseValidationErrs.js](../util/parseValidationErrs.js)

5. Create and populate [middleware/storeLocals.js](../middleware/storeLocals.js)

6. Update [app.js](../app.js) with store/sessions wiring.

7. Verify [db/connect.js](../db/connect.js) is populated correctly.

8. Update [app.js](../app.js) with await require("./db/connect")(process.env.MONGO_URI);

C. Configure Passport

9. Create and populate [passport/passportInit.js](../passport/passportInit.js)

10. Update [app.js](../app.js) with passport wiring.

11. Update [routes/sessionRoutes.js](../routes/sessionRoutes.js) with `passport.authenticate()` method.

12. Update [controllers/sessionController.js](../controllers/sessionController.js) to remove code pertaining to flash.

D. Protect a Route

13. Create and populate [middleware/auth.js](../middleware/auth.js)

14. Create and populate [routes/secretWordEndPoint.js](../routes/secretWordEndPoint.js)

15. Update [app.js](../app.js) with secretWord wiring

<p align="center">************************</p>

## Flow of logic

Back to [Table of Contents](#table-of-contents) above.

**Diagrams showing**

- URL the user visits
- Middleware they pass through (`body-parser`, `session`, `passport`, `auth`)
- Which EJS view they see in the browser
- What they can do next (click link, submit form, logoff, etc.)

Giving the **end-user perspective**

- Every navigation starts at `/`
- Login/register → session created
- Secret word page → protected route, uses session + flash
- Logoff → session cleared

### 🔹 End-User Flow Chart (from `app.js`)

```
[Start] User navigates to http://localhost:3000/
   |
   v
[Middleware in app.js]
   - body-parser parses req.body
   - session middleware attaches req.session
   - passport.initialize()
   - passport.session() attaches req.user (if logged in)
   - connect-flash stores flash messages
   - storeLocals sets res.locals.user, res.locals.flash
   |
   v
[Route Handler]
   - GET "/"
   - app.get("/", (req, res) => res.render("index"))
   |
   v
[View Rendered]
   - ./views/index.ejs
   - Includes partials:
       - ./views/partials/head.ejs
       - ./views/partials/header.ejs (shows user if logged in)
       - ./views/partials/footer.ejs
   |
   v
[User Sees]
   - If NOT logged in: (Option 1)
       - Links: "Logon" (/sessions/logon) and "Register" (/sessions/register)
   - If logged in: (Option 2)
       - Link: "Secret Word" (/secretWordEndPoint)
       - Logged-in user info in header
```

### User clicks **Logon** (`/sessions/logon`) (Option 1)

```
[URL] GET /sessions/logon
   |
   v
[Middleware] (same as above)
   |
   v
[Route Handler] logonShow → renders ./views/logon.ejs
   |
   v
[View Rendered]
   - ./views/logon.ejs
   - Includes head, header, footer partials
   - Form fields: email, password, buttons
   |
   v
[User Action]
   - Enter email/password → POST /sessions/logon
```

```
[POST /sessions/logon] → passport.authenticate("local")
   |
   v
[Passport LocalStrategy runs]
   - Verify credentials (calls done(null,user) if success)
   - On success → user.id stored in session (serializeUser)
   - req.user populated on next request
   |
   v
[Redirect]
   - success → GET "/" (homepage)
   - failure → GET "/sessions/logon" (login page again with flash errors)
```

### User clicks **Register** (`/sessions/register`) (Option 2)

```
[URL] GET /sessions/register
   |
   v
[Route Handler] registerShow → renders ./views/register.ejs
   |
   v
[View Rendered]
   - ./views/register.ejs
   - Includes head, header, footer
   - Form fields: name, email, password, confirm password
   |
   v
[User Action]
   - Enter info → POST /sessions/register
```

```
[POST /sessions/register] → registerDo (controller)
   - Creates new user in DB
   - May set flash messages on success/failure
   |
   v
[Redirect]
   - Typically back to "/" or "/sessions/logon" depending on controller
```

### User clicks **Secret Word** (`/secretWordEndPoint`) [Protected by auth middleware]

```
[URL] GET /secretWordEndPoint
   |
   v
[auth middleware]
   - Checks if req.user exists (user logged in)
   - If NOT logged in → redirect to logon
   - If logged in → continue
   |
   v
[Route Handler] secretWordRouter.get("/")
   - Initialize req.session.secretWord = "syzygy" if not set
   - Render ./views/secretWordView.ejs with secretWord
```

```
[View Rendered]
   - ./views/secretWordView.ejs
   - Includes head, header, footer
   - Shows current secretWord
   - Form to submit new secret word
   |
   v
[User Action]
   - Enter new word → POST /secretWordEndPoint
```

```
[POST /secretWordEndPoint]
   - If word starts with "P" → flash errors, redirect back to GET
   - Else → update req.session.secretWord, flash info, redirect back to GET
```

### User clicks **Logoff** (from header form)

```
[POST /sessions/logoff]
   - logoff controller clears session / logs out user
   - Redirects to homepage "/"
```

### 🔹 Summary Table Mapping URL → View

| URL                          | Middleware / Checks                                | View Rendered                         | User Action / Notes                |
| ---------------------------- | -------------------------------------------------- | ------------------------------------- | ---------------------------------- |
| `/`                          | body-parser, session, passport, flash, storeLocals | `index.ejs`                           | Click logon/register/secret link   |
| `/sessions/logon` (GET)      | body-parser, session, passport, flash, storeLocals | `logon.ejs`                           | Submit login form                  |
| `/sessions/logon` (POST)     | passport.authenticate("local")                     | redirects: `/` or `/sessions/logon`   | Login success/failure              |
| `/sessions/register` (GET)   | body-parser, session, passport, flash, storeLocals | `register.ejs`                        | Submit registration form           |
| `/sessions/register` (POST)  | registerDo (controller)                            | redirects to `/` or `/sessions/logon` | New user created                   |
| `/sessions/logoff` (POST)    | clears session                                     | redirect `/`                          | User logged off                    |
| `/secretWordEndPoint` (GET)  | auth middleware, session                           | `secretWordView.ejs`                  | Show secret word and form          |
| `/secretWordEndPoint` (POST) | auth middleware, session                           | redirect GET `/secretWordEndPoint`    | Update secret word, flash messages |

<p align="center">************************</p>

## Resources

Back to [Table of Contents](#table-of-contents) above.

1.  Dependencies

    a. `passport` dependency ** NEW **

    i. https://www.passportjs.org/

    ii. https://www.npmjs.com/package/passport

    b. `passport-local` dependency ** NEW **

    iii. https://www.npmjs.com/package/passport-local

    iv. https://www.passportjs.org/packages/passport-local/

    c. connect-mongodb-session

    v. https://www.npmjs.com/package/connect-mongodb-session

    d. express-session

    vi. https://www.npmjs.com/package/express-session

2.  [Authentication with Passport](https://classes.codethedream.org/course/node-v3/lion?week=15&lesson=Authentication%20with%20Passport) lesson/assignment page

3.  [MongoDB](https://www.mongodb.com/) database - no new content this week. But the database is used for this lesson.

4.  _no video this lesson_
