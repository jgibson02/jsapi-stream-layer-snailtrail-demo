import * as React from 'react';
import { render } from 'react-dom';

import MapPane from './MapPane';

import './styles.css';

function App() {
  return (
    <div className="App">
      <MapPane />
    </div>
  );
}

const rootElement = document.getElementById('root');

render(<App />, rootElement);
