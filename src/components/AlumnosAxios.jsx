import { useState, useEffect } from 'react';
import axios from 'axios';
import './AlumnosAxios.css';

const API_URL = 'http://localhost:3001';

function AlumnosAxios() {
  const [alumnos, setAlumnos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    edad: '',
    cursoId: ''
  });

  // useEffect para cargar alumnos y cursos
  useEffect(() => {
    fetchAlumnos();
    fetchCursos();
  }, []);

  const fetchAlumnos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/alumnos`);
      setAlumnos(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los alumnos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCursos = async () => {
    try {
      const response = await axios.get(`${API_URL}/cursos`);
      setCursos(response.data);
    } catch (err) {
      console.error('Error al cargar cursos:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.email || !formData.edad || !formData.cursoId) {
      alert('Por favor, completa todos los campos');
      return;
    }

    try {
      // Calcular el siguiente ID basado en el máximo ID existente
      const maxId = alumnos.length > 0 
        ? Math.max(...alumnos.map(alumno => alumno.id))
        : 0;
      
      const nuevoAlumno = {
        id: maxId + 1,
        nombre: formData.nombre,
        email: formData.email,
        edad: parseInt(formData.edad),
        cursoId: parseInt(formData.cursoId)
      };

      await axios.post(`${API_URL}/alumnos`, nuevoAlumno);
      
      // Resetear formulario
      setFormData({
        nombre: '',
        email: '',
        edad: '',
        cursoId: ''
      });
      
      // Recargar alumnos
      fetchAlumnos();
      alert('Alumno registrado exitosamente');
    } catch (err) {
      setError('Error al registrar alumno: ' + err.message);
    }
  };

  const getCursoNombre = (cursoId) => {
    const curso = cursos.find(c => c.id === cursoId);
    return curso ? curso.nombre : 'N/A';
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="alumnos-container">
      <h2>Gestión de Alumnos - Axios</h2>
      
      {error && <div className="error-message">{error}</div>}

      <div className="form-container">
        <h3>Registrar Nuevo Alumno</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre completo"
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email@example.com"
            />
          </div>

          <div className="form-group">
            <label>Edad:</label>
            <input
              type="number"
              name="edad"
              value={formData.edad}
              onChange={handleInputChange}
              placeholder="Edad"
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Curso:</label>
            <select
              name="cursoId"
              value={formData.cursoId}
              onChange={handleInputChange}
            >
              <option value="">Selecciona un curso</option>
              {cursos.map(curso => (
                <option key={curso.id} value={curso.id}>
                  {curso.nombre}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-submit">Registrar Alumno</button>
        </form>
      </div>

      <div className="table-container">
        <h3>Lista de Alumnos ({alumnos.length})</h3>
        <table className="alumnos-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Edad</th>
              <th>Curso</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map(alumno => (
              <tr key={alumno.id}>
                <td>{alumno.id}</td>
                <td>{alumno.nombre}</td>
                <td>{alumno.email}</td>
                <td>{alumno.edad}</td>
                <td>{getCursoNombre(alumno.cursoId)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AlumnosAxios;
