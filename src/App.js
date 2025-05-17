import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css';

import Principal from './Paginas/Principal/Principal';

function App(){
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Principal/>} />
            </Routes>
        </Router>
    );
}

export default App;
