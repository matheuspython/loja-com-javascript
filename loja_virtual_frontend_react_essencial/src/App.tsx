import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Importar Link
import './index.css'; // Garante que o Tailwind CSS seja carregado

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem_url: string;
  tamanho?: string;
}

function App() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const numeroWhatsApp = "5511999999999"; // Substitua pelo seu número do WhatsApp
  const backendUrl = "http://localhost:3001"; // AJUSTADO para o backend Node.js

  useEffect(() => {
    fetch(`${backendUrl}/api/produtos`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: Produto[]) => setProdutos(data))
      .catch(error => console.error('Erro ao carregar produtos do backend Node.js:', error));
  }, [backendUrl]);

  const handleComprarWhatsApp = (produtoNome: string) => {
    const mensagem = `Olá! Tenho interesse no produto: ${produtoNome}`;
    const whatsappLink = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-purple-500">Minha Loja Virtual</h1>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {produtos.length > 0 ? produtos.map(produto => (
          <div key={produto.id} className="bg-gray-900 border border-purple-700 rounded-lg shadow-xl p-6 flex flex-col justify-between">
            <div>
              <Link to={`/produto/${produto.id}`}> 
                <img 
                  src={produto.imagem_url || `https://via.placeholder.com/300x200/${produto.id % 2 === 0 ? '000000' : '6A0DAD'}/FFFFFF?text=${encodeURIComponent(produto.nome)}`} 
                  alt={produto.nome} 
                  className="w-full h-48 object-cover rounded-md mb-4 cursor-pointer hover:opacity-80 transition-opacity" 
                />
              </Link>
              <Link to={`/produto/${produto.id}`} className="hover:text-purple-300 transition-colors">
                <h2 className="text-2xl font-semibold text-purple-400 mb-2">{produto.nome}</h2>
              </Link>
              <p className="text-gray-300 mb-2 text-sm truncate">{produto.descricao}</p> 
              <p className="text-xl font-bold text-purple-500 mb-1">R$ {produto.preco.toFixed(2).replace('.', ',')}</p>
              {produto.tamanho && <p className="text-gray-400 text-sm mb-4">Tamanho: {produto.tamanho}</p>}
              <Link to={`/produto/${produto.id}`} className="text-purple-400 hover:text-purple-300 mb-3 text-sm self-start">
                Ver detalhes
              </Link>
            </div>
            <button 
              onClick={() => handleComprarWhatsApp(produto.nome)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 mt-auto"
            >
              Comprar via WhatsApp
            </button>
          </div>
        )) : (
          <p className="col-span-full text-center text-xl text-gray-400">Nenhum produto encontrado ou carregando...</p>
        )}
      </main>

      <footer className="text-center mt-12 py-6 border-t border-purple-700">
        <p className="text-purple-400">&copy; {new Date().getFullYear()} Minha Loja Virtual. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;

