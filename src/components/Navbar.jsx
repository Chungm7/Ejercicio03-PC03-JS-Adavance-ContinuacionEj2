import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-logo">Gestión Académica</h1>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Inicio</Link>
          </li>
          <li className="navbar-item">
            <Link to="/axios" className="navbar-link">Alumnos (Axios)</Link>
          </li>
          <li className="navbar-item">
            <Link to="/alova" className="navbar-link">Alumnos (Alova)</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
