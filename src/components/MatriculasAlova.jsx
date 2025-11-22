import { useState, useEffect } from 'react';
import { useRequest } from 'alova/client';
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
  const [alumnos, setAlumnos] = useState([]);
  const [cursos, setCursos] = useState([]);

  // Peticiones GET
  const getMatriculas = () => alovaInstance.Get('/matriculas');
  const getAlumnos = () => alovaInstance.Get('/alumnos');
  const getCursos = () => alovaInstance.Get('/cursos');

  // Cargar matrículas
  const {
    data: matriculas,
    loading: loadingMatriculas,
    error: errorMatriculas,
    send: refetchMatriculas
  } = useRequest(getMatriculas, {
    initialData: []
  });

  // Cargar alumnos
  const {
    data: alumnosData,
    loading: loadingAlumnos
  } = useRequest(getAlumnos, {
    initialData: []
  });

  // Cargar cursos
  const {
    data: cursosData,
    loading: loadingCursos
  } = useRequest(getCursos, {
    initialData: []
  });

  // Actualizar estados locales cuando los datos se cargan
  useEffect(() => {
    if (alumnosData) setAlumnos(alumnosData);
  }, [alumnosData]);

  useEffect(() => {
    if (cursosData) setCursos(cursosData);
  }, [cursosData]);

  // Crear matrícula
  const { loading: creating, send: createMatricula } = useRequest(
    (data) => alovaInstance.Post('/matriculas', data),
    { immediate: false }
  );

  // Actualizar matrícula
  const { loading: updating, send: updateMatricula } = useRequest(
    (id, data) => alovaInstance.Put(`/matriculas/${id}`, data),
    { immediate: false }
  );

  // Eliminar matrícula
  const { loading: deleting, send: deleteMatricula } = useRequest(
    (id) => alovaInstance.Delete(`/matriculas/${id}`),
    { immediate: false }
  );

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
        await updateMatricula(editingId, formData);
        alert('Matrícula actualizada exitosamente');
        setEditingId(null);
      } else {
        // Crear
        await createMatricula(formData);
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
      await refetchMatriculas();
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
        await deleteMatricula(id);
        alert('Matrícula eliminada exitosamente');
        await refetchMatriculas();
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
    const alumno = alumnos.find(a => a.id === alumnoId);
    return alumno ? alumno.nombre : 'Desconocido';
  };

  const getNombreCurso = (cursoId) => {
    const curso = cursos.find(c => c.id === cursoId);
    return curso ? curso.nombre : 'Desconocido';
  };

  if (loadingAlumnos || loadingCursos) {
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
              disabled={creating || updating}
              className="btn-submit"
            >
              {creating || updating ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear Matrícula'}
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
        
        {errorMatriculas && (
          <div className="error-message">Error al cargar matrículas: {errorMatriculas.message}</div>
        )}
        
        {loadingMatriculas ? (
          <div className="loading">Cargando matrículas...</div>
        ) : matriculas && matriculas.length > 0 ? (
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
                    disabled={deleting}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(matricula.id)}
                    className="btn-delete"
                    disabled={deleting}
                  >
                    {deleting ? 'Eliminando...' : 'Eliminar'}
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
