require('jsdom-global/register');

const expect = require('expect');
global.expect = expect;
global.window.expect = expect;
require('jest-dom/extend-expect');

const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
Enzyme.configure({ adapter: new Adapter() });

// Prevent webpack imports from causing errors.
require.extensions['.css'] = () => ({});
require.extensions['.scss'] = () => ({});
