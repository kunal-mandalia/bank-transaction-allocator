import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// TODO: add chrome global to jest setupFiles
// type defs are available but perhaps not the stub implementation
// export th
it.skip('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
