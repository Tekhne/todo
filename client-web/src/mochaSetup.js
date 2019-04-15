const Adapter = require('enzyme-adapter-react-16');
const Enzyme = require('enzyme');
const jsdom = require('jsdom');
require('jsdom-global/register');

Enzyme.configure({ adapter: new Adapter() });

// Prevent webpack imports from causing errors.
require.extensions['.css'] = () => ({});
require.extensions['.scss'] = () => ({});
