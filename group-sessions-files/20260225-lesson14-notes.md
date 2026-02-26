# 20260225-lesson14-notes

## Table of Contents

1. [Summary Of Lesson](#summary-of-lesson)

2. [Points to highlight](#points-to-highlight)

3. [Cross Site Request Forgery (CSRF) Attack](#cross-site-request-forgery-csrf-attack)

4. [Resources](#resources)

<p align="center">************************</p>

## Summary Of Lesson

<!-- TODO: Summary -->

Back to [Table of Contents](#table-of-contents) above.

This lesson,

- first demonstrates a CSRF vulnerability caused by Passport relying on session cookies (via the https://github.com/Code-the-Dream-School/csrf-attack repo).

- then fixes a CSRF vulnerability caused by Passport relying on session cookies,

- then integrates the host-csrf middleware (after cookie and body parsers but before routes) and add CSRF tokens to every form to block the attack.

After securing the app, builds a dynamic jobs database feature using only server-side rendering with EJS (no client-side JavaScript), implementing protected GET and POST routes for listing, creating, editing, updating, and deleting jobs (never mutating data with GET), wiring up routes, controllers, views, and MongoDB logic while ensuring users can only access their own records via req.user.

Lastly enhances overall security by configuring Helmet, xss-clean, and express-rate-limit, then thoroughly test that both functionality and CSRF protection work correctly.

<p align="center">************************</p>

## Points to highlight

<!-- TODO: Points to highlight -->

Back to [Table of Contents](#table-of-contents) above.

1. In the previous two lessons I renamed the following values for clarity - the same value was used in multiple locations but for different purposes. I am sharing this again here because it remains relevant.

   | type      | location                | original value         | current value              |
   | --------- | ----------------------- | ---------------------- | -------------------------- |
   | file name | jobs-ejs root directory | ./views/secretWord.ejs | ./views/secretWordView.ejs |
   | string    | ./app.js                | secretWord             | secretWordEndPoint         |
   | variable  | ./app.js                | session                | sessionStore               |

<p align="center">************************</p>

## Cross Site Request Forgery (CSRF) Attack

<!-- TODO: Summary -->

Back to [Table of Contents](#table-of-contents) above.

### What is the problem?

Passport is using the session cookie to determine if the user is logged in. This creates a security vulnerability called “cross site request forgery” (CSRF).

### Demonstrating the issue/problem

#### Setup

1. Clone this [csrf-attack](https://github.com/Code-the-Dream-School/csrf-attack) repository in its own directory, outside of your `jobs-ejs/` directory.

2. Install packages for the `csrf-attack` app: `npm install`

3. Make sure the `SESSION_SECRET` secret string in the `.env` file of the `jobs-ejs` application is established.

#### Execution

3. Start both node express applications. Specifically, start the existing `jobs-ejs` application and the newly cloned `csrf-attack` application.

4. Navigate to both `http://localhost:3000/` in one tab and `http://localhost:4000/` in a different tab.

   **Make sure you're using the same browser for both tabs.**

   The one at localhost:4000 has a `Click Me!` button. **Don’t click it yet.**

5. Navigate to `http://localhost:3000/secretWord`.

   This requires you to log in first.

6. Establish a new secret string.

7. Close the tab for `http://localhost:3000/`.

8. Open a new tab for `http://localhost:3000/`.

9. Check the value of the secret string in the browser (in the localhost:3000/ tab).

   As expected, it still has the updated value that you set in step `6.` above.

10. Log off.

    This will discard your session.

11. Click the button in the `http://localhost:4000/` tab.

12. Log back on and view the secret string again.

    As expected, it is back to `syzygy`. This is because you logged off.

    More to the point, because you were logged off the malicious software (in this case running on localhost:4000 and pressing the `Click Me!` button) didn't do anything.

13. Update the secret string with a custom value.

14. Refresh the `http://localhost:3000/secretWord` tab.

    Notice the secret string remains on that page.

15. Without logging off of `jobs-ejs`, click the `Click Me!` button in the 4000 tab.

16. Refresh the `http://localhost:3000/secretWord` tab.

    Notice the new message on that page.

    Hey, what happened! (By the way, this attack would succeed even if you closed the 3000 tab entirely.)

#### Explanation

The `csrf-attack` application sends a request to the `jobs-ejs` application in the context of your browser — and that browser request automatically includes the cookie.

So, the application thinks the request comes from a _logged on_ user, and honors it.

If the `jobs-ejs` application makes database changes, or even transfers money, as a result of a form post, the `csrf-attack` application could do that as well.

One solution is to use the `host-csrf` package. The `host-csrf` package was installed at the start of the project.

<!-- Follow the instructions here to integrate the package with your application. You will need to change app.js as well as each of the forms in your EJS files. You can use process.env.SESSION_SECRET as your cookie-parser secret. Note that the app.use for the CSRF middleware must come after the cookie parser middleware and after the body parser middleware, but before any of the routes. You will see a message logged to the console that the CSRF protection is not secure. That is because you are using HTTP, not HTTPS, so the package is less secure in this case, but you would be using HTTPS in production. As you will see, it stops the attack.
Re-test, first to see that your application still works, and second, to see that the attack no longer works. (A moral: Always log off of sensitive applications before you surf, in case the sensitive application is vulnerable in this way. Also note that it does not help to close the application, as the cookie is still present in the browser. You have to log off to clear the cookie. Even restarting the browser does not suffice.)

Enabling CSRF protection in the project is an important part of this lesson — don’t omit it! By the way, the CSRF attack only works when the credential is in a cookie. It doesn’t work if you use JWTs in the authorization header. However, as we've seen, to send JWTs in an authorization header, you have to store sensitive data in browser local storage, which is always a bad idea. -->

<p align="center">************************</p>

## Resources

<!-- TODO: Resources -->

Back to [Table of Contents](#table-of-contents) above.

1.  host-csrf dependency https://www.npmjs.com/package/host-csrf

    This is already installed. We just haven't implemented it until this less.

2.  [Final Project Begins](https://classes.codethedream.org/course/node-v3/lion?week=16&lesson=Final%20Project%20Begins) lesson/assignment page.

3.  [MongoDB](https://www.mongodb.com/) database.

    No new content this week. But the database is used for this lesson.

4.  _no video this lesson_
