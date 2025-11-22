import { useState, useEffect } from 'react';
import alovaInstance from '../config/alova';
import './MatriculasAlova.css';

function MatriculasAlova() {
  const [formData, setFormData] = useState({
    alumnoId: '',
    cursoId: '',
    fechaMatricula: '',
    estado: 'Activo'
  });
  const [editingId, setEditingId] = useState(null);
  const [matriculas, setMatriculas] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [matriculasRes, alumnosRes, cursosRes] = await Promise.all([
        alovaInstance.Get('/matriculas'),
        alovaInstance.Get('/alumnos'),
        alovaInstance.Get('/cursos')
      ]);
      
      setMatriculas(matriculasRes);
      setAlumnos(alumnosRes);
      setCursos(cursosRes);
      setError(null);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const cargarMatriculas = async () => {
    try {
      const data = await alovaInstance.Get('/matriculas');
      setMatriculas(data);
    } catch (err) {
      console.error('Error al cargar matrículas:', err);
    }
  };

  const generarNuevoId = () => {
    if (matriculas.length === 0) return "1";
    
    // Convertir todos los IDs a números y encontrar el máximo
    const ids = matriculas.map(m => {
      const id = parseInt(m.id);
      return isNaN(id) ? 0 : id;
    });
    
    const maxId = Math.max(...ids);
    return String(maxId + 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.alumnoId || !formData.cursoId || !formData.fechaMatricula) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    try {
      if (editingId) {
        // Actualizar
        await alovaInstance.Put(`/matriculas/${editingId}`, formData);
        alert('Matrícula actualizada exitosamente');
        setEditingId(null);
      } else {
        // Crear - generar ID secuencial
        const nuevoId = generarNuevoId();
        const nuevaMatricula = {
          ...formData,
          id: nuevoId
        };
        await alovaInstance.Post('/matriculas', nuevaMatricula);
        alert('Matrícula creada exitosamente');
      }
      
      // Resetear formulario
      setFormData({
        alumnoId: '',
        cursoId: '',
        fechaMatricula: '',
        estado: 'Activo'
      });
      
      // Recargar matrículas
      await cargarMatriculas();
    } catch (error) {
      console.error('Error al guardar matrícula:', error);
      alert('Error al guardar la matrícula');
    }
  };

  const handleEdit = (matricula) => {
    setFormData({
      alumnoId: matricula.alumnoId,
      cursoId: matricula.cursoId,
      fechaMatricula: matricula.fechaMatricula,
      estado: matricula.estado
    });
    setEditingId(matricula.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta matrícula?')) {
      try {
        await alovaInstance.Delete(`/matriculas/${id}`);
        alert('Matrícula eliminada exitosamente');
        await cargarMatriculas();
      } catch (error) {
        console.error('Error al eliminar matrícula:', error);
        alert('Error al eliminar la matrícula');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      alumnoId: '',
      cursoId: '',
      fechaMatricula: '',
      estado: 'Activo'
    });
  };

  const getNombreAlumno = (alumnoId) => {
    const alumno = alumnos?.find(a => a.id === alumnoId);
    return alumno ? alumno.nombre : 'Desconocido';
  };

  const getNombreCurso = (cursoId) => {
    const curso = cursos?.find(c => c.id === cursoId);
    return curso ? curso.nombre : 'Desconocido';
  };

  if (loading) {
    return <div className="loading">Cargando datos...</div>;
  }

  return (
    <div className="matriculas-container">
      <h1>Gestión de Matrículas</h1>
      
      {/* Formulario */}
      <div className="formulario-section">
        <h2>{editingId ? 'Editar Matrícula' : 'Nueva Matrícula'}</h2>
        <form onSubmit={handleSubmit} className="matricula-form">
          <div className="form-group">
            <label htmlFor="alumnoId">Alumno *</label>
            <select
              id="alumnoId"
              name="alumnoId"
              value={formData.alumnoId}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione un alumno</option>
              {alumnos.map(alumno => (
                <option key={alumno.id} value={alumno.id}>
                  {alumno.nombre} - {alumno.email}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cursoId">Curso *</label>
            <select
              id="cursoId"
              name="cursoId"
              value={formData.cursoId}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione un curso</option>
              {cursos.map(curso => (
                <option key={curso.id} value={curso.id}>
                  {curso.nombre} - {curso.duracion}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="fechaMatricula">Fecha de Matrícula *</label>
            <input
              type="date"
              id="fechaMatricula"
              name="fechaMatricula"
              value={formData.fechaMatricula}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="estado">Estado *</label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              required
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Completado">Completado</option>
            </select>
          </div>

          <div className="form-buttons">
            <button 
              type="submit" 
              className="btn-submit"
            >
              {editingId ? 'Actualizar' : 'Crear Matrícula'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={handleCancelEdit}
                className="btn-cancel"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de Matrículas */}
      <div className="lista-section">
        <h2>Matrículas Registradas</h2>
        
        {error && (
          <div className="error-message">Error al cargar matrículas: {error}</div>
        )}
        
        {matriculas && matriculas.length > 0 ? (
          <div className="matriculas-grid">
            {matriculas.map(matricula => (
              <div key={matricula.id} className="matricula-card">
                <div className="matricula-header">
                  <h3>Matrícula #{matricula.id}</h3>
                  <span className={`estado-badge ${matricula.estado.toLowerCase()}`}>
                    {matricula.estado}
                  </span>
                </div>
                <div className="matricula-body">
                  <div className="matricula-info">
                    <strong>Alumno:</strong>
                    <span>{getNombreAlumno(matricula.alumnoId)}</span>
                  </div>
                  <div className="matricula-info">
                    <strong>Curso:</strong>
                    <span>{getNombreCurso(matricula.cursoId)}</span>
                  </div>
                  <div className="matricula-info">
                    <strong>Fecha:</strong>
                    <span>{new Date(matricula.fechaMatricula).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
                <div className="matricula-actions">
                  <button 
                    onClick={() => handleEdit(matricula)}
                    className="btn-edit"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(matricula.id)}
                    className="btn-delete"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No hay matrículas registradas</p>
        )}
      </div>
    </div>
  );
}

export default MatriculasAlova;
