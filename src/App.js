import "primereact/resources/themes/md-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import './App.css';
import React, {useState} from 'react';
import Index from "./vistas/VistaPrincipal";

function App() {

    return (
        <div className="App">
          <Index/>
        </div>
    );
}

export default App;
