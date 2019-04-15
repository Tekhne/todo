import Content from './Content';
import React from 'react';
import Viewport from './Viewport';

export function Welcome() {
  return (
    <Viewport>
      <Content>
        <section>
          <h1>Todo Lists Improved</h1>
          <p>
            Combine a todo list with a day planner. It's simple, and it will
            revolutionize your productivity.
          </p>
        </section>
      </Content>
    </Viewport>
  );
}

export default Welcome;
