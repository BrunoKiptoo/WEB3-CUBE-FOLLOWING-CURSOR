// src/App.js
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import React from 'react';
import FOX3D from "./components/3d";

function App() {
  return (
    <div className="App">
      <ToastContainer position='top-center' />
      <header className="App-header">
        <FOX3D/>
      </header>
    </div>
  );
}

export default App;
