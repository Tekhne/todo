import 'jest-dom/extend-expect';
import 'jest-enzyme';
import 'react-testing-library/cleanup-after-each';
import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';

configure({ adapter: new Adapter() });