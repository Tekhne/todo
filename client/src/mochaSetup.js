require('jsdom-global/register');

global.window.Date = Date;

const expect = require('expect');
global.expect = expect;
global.window.expect = expect;
require('@testing-library/jest-dom/extend-expect');

// Prevent webpack imports from causing errors.
require.extensions['.css'] = () => ({});
require.extensions['.scss'] = () => ({});
