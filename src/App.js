import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

import './App.css';

import Principal from './Paginas/Principal/Principal';

function App(){
    return(
        <HelmetProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Principal/>} />
                </Routes>
            </Router>
        </HelmetProvider>
    );
}

export default App;
