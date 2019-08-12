# Overview

This is a todo list web application built with React and Ruby on Rails. The
number of features is relatively small, but all features are implemented across
the full stack (front end, back end, database, configuration, tests (see
below), etc.) which amounted to about 5,200 lines of code.

# Client Tests

The first thing to note is that I used `mocha` instead of `jest` for
performance reasons (I developed on old hardware). Since I'm using the `expect
`package , I think it should be straighforward to convert back to `jest` if
needed.

The second thing to note is that this project uses React hooks, which, at the
time of this writing, doesn't have complete testing support (e.g. shallow
rendering). Since my favorite testing tool has been `enzyme`, I didn't
implement many/any client tests. I would find another solution if this were
real production code rather than a demo. For example, I might avoid hooks, or
find another testing solution.

# Development Environment

## Servers

This project was built to expect the development server to be running on port
4000 (`cd server; ./bin/rails server -p 4000`), and the development client on
port 3000 (default).
