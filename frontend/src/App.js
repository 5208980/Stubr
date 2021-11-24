import './App.css';
import {
  BrowserRouter as Router, Routes, Route,
} from "react-router-dom";

import MetaMask from './components/MetaMask';
import List from './components/List';
import Home from './components/Home';

import Upload from './components/Upload';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MetaMask />} />
        <Route path="/home" element={<Home />} />
        <Route path="/list/:contract/:id" element={<List />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </Router>
  );
}
export default App;
