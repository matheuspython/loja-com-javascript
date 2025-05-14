import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App'; // Sua página principal da loja
import ProdutoDetalhe from './components/ProdutoDetalhe'; // Sua página de detalhes do produto
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/produto/:id" element={<ProdutoDetalhe />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

