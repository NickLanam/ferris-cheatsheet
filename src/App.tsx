// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './App.module.css';

import { layers } from './layout';
import { Layer } from './Layer';

function App() {
  return (
    <>
      {layers.layers.map((layer, i) => (
        <Layer key={i} map={layers} name={layer.name} />
      ))}
    </>
  );
}

export default App;
