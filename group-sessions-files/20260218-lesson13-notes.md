# 20260211-lesson12-agenda

## Table of Contents

1. [Summary Of Lesson](#summary-of-lesson)

2. [Accessibility](#to-share-with-students-about-accessibility) <!-- TODO: UPDATE section title and link -->

3. [Points to highlight](#points-to-highlight)

4. [Project Dependencies](#project-dependencies)

5. [Sessions and Storage]() maybe don't' use this one

6. [Resources](#resources)

<p align="center">************************</p>

## Summary Of Lesson

<!-- TODO: Summary -->

Back to [Table of Contents](#table-of-contents) above.

The lesson teaches how to add **user authentication** to a server-rendered Node.js app using **Passport** and the **passport-local** strategy. It walks you through creating login and registration views, updating headers to show the logged-in user, and setting up routes and controllers for registering, logging in (with Passport), and logging out. You then configure Passport with a local strategy that checks email and password against your MongoDB user model, and add session support so `req.user` is available. Finally the tutorial shows how to protect routes so only authenticated users can access them.

<p align="center">************************</p>

## To share with students about accessibility <!-- TODO: UPDATE section title -->

<!-- TODO: Accessibility -->

Back to [Table of Contents](#table-of-contents) above.

<!-- TODO: SHARE this section with all of the students in the slack channel. -->

The lesson mentions the existence of digital accessibility (A11Y) and shares a few resources. I am coming back to this topic because it is important and deserves more attention for at least two reasons.

First, as mentioned in the lesson, the goal of digital accessibility is to ensure that the same resources available to people without disabilities are equally available to people with disabilities. By improving the experience for those who rely on accessible design, we also create a better, more usable experience for everyone — including those who may not explicitly depend on accessibility features. As software developers, as we grow in our careers and deepen our expertise in our specialized fields, we should each advocate for people with disabilities by intentionally expanding our knowledge and skills to build more accessible software.

Second, the field of digital accessibility continues to grow — much like software testing, cybersecurity, front-end development, and UI/UX — it has established itself as a discipline in its own right. In other words, accessibility (A11Y) is a specialized field where someone can build an entire career focused exclusively on creating inclusive digital experiences. Case in point, in 2020 GitHub's first accessibility contribution to their users was providing dark mode. And only last year did they formally join the [Global Accessibility Awareness Day Pledge](https://gaad.foundation/what-we-do/gaad-pledge) (GAAD Pledge), when they debuted this [Accessibility](https://accessibility.github.com/) page. Another example, not until 2021 did the [New York City government](https://www.nyc.gov/site/mopd/initiatives/digital-accessibility.page) finally adopt "the [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/TR/WCAG21/) Level AA standard." WCAG sets the technical standards for web accessibility. There is plenty of opportunity for people to become more involved in this field.

Next Steps: I will leave it to you to look into this further. Aside from the resources shared in the [lesson](https://classes.codethedream.org/course/node-v3/lion?week=15&lesson=Authentication%20with%20Passport), you could also search online for a combination of `a11y`, `resources`, `standards`, `accessibility`, `digital accessibility`, and `software development`. And while I am not at all an expert in the field, you're always welcome to DM me with question. I'll do my best to get you a sufficient answer.

<!-- See notes in Logseq -->

<p align="center">************************</p>

## Points to highlight

<!-- TODO: Points to highlight -->

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

<!-- TODO: Project Dependencies -->

Back to [Table of Contents](#table-of-contents) above.

Same as last week. But this week we're discussing and working with passport and passport-local.

**passport** <--**NEW CODE** (not discussed in the lesson but used in a future lesson)

- Authentication middleware
- Handles login state, serialization, and session integration

**passport-local** <--**NEW CODE** (not discussed in the lesson but used in a future lesson)

- Local username/email + password authentication strategy
- Typically used with bcrypt for password verification

<p align="center">************************</p>

## Order of operations

<!-- TODO: Order of operations -->

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

## Resources

<!-- TODO: Resources -->

Back to [Table of Contents](#table-of-contents) above.

1. passport & passport-local dependencies

   i. https://www.passportjs.org/

   ii. https://www.npmjs.com/package/passport

   iii. https://www.npmjs.com/package/passport-local

2.
