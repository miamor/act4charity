/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

<<<<<<< HEAD
import React from 'react';
import Main from './src/main';
import {initialState, reducer, StateProvider} from './src/contexts/global';
=======
import React from 'react'
import Main from './src/main'
import { initialState, reducer, StateProvider } from './src/contexts/global'
>>>>>>> cd9822afb3f36ed79b10861ed6da3e0d88cc4256

const App: () => Node = () => {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Main />
    </StateProvider>
<<<<<<< HEAD
  );
};

export default App;
=======
  )
}


export default App
>>>>>>> cd9822afb3f36ed79b10861ed6da3e0d88cc4256
