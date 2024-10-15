import React from 'react';
import './App.css';
import Sala from './components/Sala';
import Cozinha from './components/Cozinha';
import Quarto from './components/Quarto';

const App: React.FC = () => {
  return (
    <div className='casa'>
      <h1>Casa Inteligente</h1>
      <Sala />
      <Cozinha />
      <Quarto />

      {/* Rodapé */}
      <footer>
        <p>Desenvolvido por: Aline Fernanda Hoffmann</p>
      </footer>
    </div>
  );
}

export default App;
