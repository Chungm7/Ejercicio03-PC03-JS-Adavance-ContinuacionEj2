import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AlumnosAxios from './components/AlumnosAxios';
import AlumnosAlova from './components/AlumnosAlova';
import MatriculasAlova from './components/MatriculasAlova';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/axios" element={<AlumnosAxios />} />
          <Route path="/alova" element={<AlumnosAlova />} />
          <Route path="/matriculas" element={<MatriculasAlova />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
