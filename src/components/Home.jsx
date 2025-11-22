import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Bienvenido al Sistema de Gestión Académica</h1>
        <p className="subtitle">
          Sistema completo para administrar alumnos y cursos
        </p>

        <div className="cards-container">
          <div className="info-card">
            <h3>📚 Axios</h3>
            <p>
              Gestiona alumnos usando Axios, una de las bibliotecas HTTP más
              populares de JavaScript. Permite realizar peticiones HTTP de
              forma sencilla y eficiente.
            </p>
          </div>

          <div className="info-card">
            <h3>🚀 Alova</h3>
            <p>
              Gestiona alumnos usando Alova, una biblioteca moderna de
              peticiones HTTP que ofrece una API ligera y potente para
              interactuar con servicios REST.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
