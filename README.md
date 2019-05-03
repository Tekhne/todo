# Overview

This is a todo application using React and Ruby on Rails.

# Development Notes

* Look for Mocha-based tests, not Jest-based. Since Jest was running so slowly for me, I setup tests to use Mocha instead. I'm using the `expect` package and the `jest-dom` package, however, so I'm hoping it should be straightforward to convert back to Jest if it becomes necessary.

* Start the development server on port 4000 and the development client on port 3000.
