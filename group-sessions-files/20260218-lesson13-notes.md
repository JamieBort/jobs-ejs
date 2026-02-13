# 20260211-lesson12-agenda

<!-- TODO: update this file -->

## Table of Contents

1. [Points to highlight](#points-to-highlight)

2. [Project Dependencies](#project-dependencies)

3. [(EJS) Templating - what it is and how it works](#ejs-templating---what-it-is-and-how-it-works)

4. [Sessions and Storage](#sessions-and-storage)

5. [Flash](#flash)

6. [Redirect](#redirect)

7. [Diagram Session + Flash + MongoDB Interaction in Express](#diagram-session--flash--mongodb-interaction-in-express)

8. [References](#references)

<p align="center">
************************
</p>

## Points to highlight

<!-- TODO: Summary -->

Back to [Table of Contents](#table-of-contents) above.

1. Naming mismatch

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

<p align="center">
************************
</p>

## Summary Of Lesson

<!-- TODO: Summary -->

Back to [Table of Contents](#table-of-contents) above.

The lesson teaches how to add **user authentication** to a server-rendered Node.js app using **Passport** and the **passport-local** strategy. It walks you through creating login and registration views, updating headers to show the logged-in user, and setting up routes and controllers for registering, logging in (with Passport), and logging out. You then configure Passport with a local strategy that checks email and password against your MongoDB user model, and add session support so `req.user` is available. Finally the tutorial shows how to protect routes so only authenticated users can access them. ([raw.githubusercontent.com][1])

<p align="center">************************</p>

## To share with students about accessibility

<!-- TODO: Accessibility -->

Back to [Table of Contents](#table-of-contents) above.

<!-- See notes in Logseq -->

<p align="center">************************</p>

## References

<!-- TODO: References -->

Back to [Table of Contents](#table-of-contents) above.

1. passport & passport-local dependencies

   i. https://www.passportjs.org/

   ii. https://www.npmjs.com/package/passport

   iii. https://www.npmjs.com/package/passport-local

2.
