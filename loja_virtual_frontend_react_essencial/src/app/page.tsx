import React, { useEffect, useState } from 'react';

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: string;
  imagemURL: string;
}

export default function HomePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const numeroWhatsApp = "5511999999999"; // Substitua pelo seu número do WhatsApp

  useEffect(() => {
    fetch('/produtos.json')
      .then(response => response.json())
      .then(data => setProdutos(data))
      .catch(error => console.error('Erro ao carregar produtos:', error));
  }, []);

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
        {produtos.map(produto => (
          <div key={produto.id} className="bg-gray-900 border border-purple-700 rounded-lg shadow-xl p-6 flex flex-col justify-between">
            <div>
              <img src={produto.imagemURL} alt={produto.nome} className="w-full h-48 object-cover rounded-md mb-4" />
              <h2 className="text-2xl font-semibold text-purple-400 mb-2">{produto.nome}</h2>
              <p className="text-gray-300 mb-2">{produto.descricao}</p>
              <p className="text-xl font-bold text-purple-500 mb-4">{produto.preco}</p>
            </div>
            <button 
              onClick={() => handleComprarWhatsApp(produto.nome)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Comprar via WhatsApp
            </button>
          </div>
        ))}
      </main>

      <footer className="text-center mt-12 py-6 border-t border-purple-700">
        <p className="text-purple-400">&copy; {new Date().getFullYear()} Minha Loja Virtual. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

