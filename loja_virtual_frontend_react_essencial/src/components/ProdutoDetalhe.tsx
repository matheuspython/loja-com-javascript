import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Adicionado Link

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem_url: string;
  tamanho?: string;
}

const ProdutoDetalhe: React.FC = () => {
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const numeroWhatsApp = "5511999999999"; // Substitua pelo seu número do WhatsApp
  const backendUrl = "http://localhost:3001"; // AJUSTADO para o backend Node.js

  useEffect(() => {
    if (id) {
      fetch(`${backendUrl}/api/produtos/${id}`)
        .then(response => {
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('Produto não encontrado.');
            }
            throw new Error(`Erro HTTP: ${response.status}`);
          }
          return response.json();
        })
        .then((data: Produto) => {
          setProduto(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Erro ao carregar detalhes do produto:', err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id, backendUrl]);

  const handleComprarWhatsApp = (produtoNome: string) => {
    const mensagem = `Olá! Tenho interesse no produto: ${produtoNome}`;
    const whatsappLink = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappLink, '_blank');
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white p-8 text-center">Carregando detalhes do produto...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-black text-white p-8 text-center">Erro ao carregar produto: {error}</div>;
  }

  if (!produto) {
    return <div className="min-h-screen bg-black text-white p-8 text-center">Produto não encontrado.</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
      <header className="text-center mb-12 w-full max-w-4xl">
        <Link to="/" className="text-purple-400 hover:text-purple-300 mb-4 inline-block">&larr; Voltar para a loja</Link>
        <h1 className="text-5xl font-bold text-purple-500">{produto.nome}</h1>
      </header>

      <main className="w-full max-w-4xl bg-gray-900 border border-purple-700 rounded-lg shadow-xl p-8">
        <div className="md:flex md:space-x-8">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <img 
              src={produto.imagem_url || `https://via.placeholder.com/600x400/${produto.id % 2 === 0 ? '000000' : '6A0DAD'}/FFFFFF?text=${encodeURIComponent(produto.nome)}`} 
              alt={produto.nome} 
              className="w-full h-auto object-cover rounded-md shadow-lg"
            />
          </div>
          <div className="md:w-1/2 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-purple-400 mb-4">Detalhes do Produto</h2>
              <p className="text-gray-300 mb-4 text-lg whitespace-pre-wrap">{produto.descricao}</p>
              <p className="text-2xl font-bold text-purple-500 mb-2">R$ {produto.preco.toFixed(2).replace('.', ',')}</p>
              {produto.tamanho && <p className="text-gray-400 text-lg mb-6">Tamanho: {produto.tamanho}</p>}
            </div>
            <button 
              onClick={() => handleComprarWhatsApp(produto.nome)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 mt-auto text-lg"
            >
              Comprar via WhatsApp
            </button>
          </div>
        </div>
      </main>

      <footer className="text-center mt-12 py-6 border-t border-purple-700 w-full max-w-4xl">
        <p className="text-purple-400">&copy; {new Date().getFullYear()} Minha Loja Virtual. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default ProdutoDetalhe;

