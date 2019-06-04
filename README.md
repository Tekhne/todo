# Overview

This is a todo application using React and Ruby on Rails.

# Tests

## Client Tests

The first thing to note is that you should look for `mocha` instead of `jest`. I setup `mocha` because `jest` was running very slowly for me (old hardware). Since I'm using packages like the `expect`, I expect it will be straighforward to convert back to `jest` in the future.

The second thing to note is that this project uses React hooks, which, at the time of this writing, creates a problem for automated testing.

My favorite testing tool up to now has been `enzyme`, but it doesn't currently support hooks.

A recent alternative to `enzyme` that's starting to become popular is `@testing-library/react`. It "supports" hooks because it fully renders components. However, it seems to have other problems. For example, if you have N components that all use a common utility, it makes sense to test the functionality of that utility once, and then just test that those components are "wired up" to that utility. However, `@testing-library/react` discourages the testing of implementation details such "wiring." Therefore, in order to ensure that those components are "wired up" to that utility, you would need to test the end user experience derived from using that utility N times. Even if you were to write test support code to reduce duplicate test code, you'd still be _running_ the same tests N times. I've run into other problems, too. So, until and unless `@testing-library/react` improves, or I learn a better way to use it, I'm going to avoid it.

That leaves React itself. However, at-a-glance, it looks like effectively using the utilities that come with React would require writing a lot of test support code. It doesn't seem to worth it since that's what `enzyme` is already trying to do. I just have to wait for `enzyme` to support hooks.

Since the primary options for testing aren't currently viable, I think the practical (and painful) choice is to avoid writting any more React tests for now, but only because this is a demo, and not a production app. If this were a production app, I would avoid using hooks until the community support was solid, and just continue using class based components, as needed. I will, however, stub out test files for later use. Instead of writing automated tests, I'll lean on manual testing, debugging tools, and programming techniques. Once `enzyme` supports hooks, I'll backfill tests for existing components, and return to the practice of building tests along with new components.


# Development Environment

## Servers

Start the development server on port 4000 (`(cd server; ./bin/rails server -p 4000)`), and the development client on port 3000 (default).
