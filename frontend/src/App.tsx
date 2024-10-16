import React from 'react';
import './App.css';
import Sala from './components/Sala';
import Cozinha from './components/Cozinha';
import Quarto from './components/Quarto';

const App: React.FC = () => {
  return (
    <div className='casa'>
      <h1 className='titulo-casa'>Casa Inteligente</h1>
      <div className='comodos-casa'>
        <Sala />
        <Cozinha />
        <Quarto />
      </div>
      {/* Rodapé */}
      <footer>
        <p>Desenvolvido por: Aline Fernanda Hoffmann</p>
      </footer>
    </div>
  );
}

export default App;
