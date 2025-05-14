const express = require("express");
const cors = require("cors");
const path = require("path"); // Adicionado para servir arquivos estáticos
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta public (para admin.html e editar_produto.html)
app.use(express.static(path.join(__dirname, "public")));

// Rota para criar um novo produto
app.post("/api/produtos", async (req, res) => {
  const { nome, descricao, preco, imagem_url, tamanho } = req.body;
  if (!nome || !descricao || preco === undefined) {
    return res.status(400).json({ error: "Nome, descrição e preço são obrigatórios." });
  }
  try {
    const novoProduto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco: parseFloat(preco),
        imagem_url,
        tamanho,
      },
    });
    res.status(201).json(novoProduto);
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({ error: "Erro ao criar produto no banco de dados." });
  }
});

// Rota para listar todos os produtos
app.get("/api/produtos", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: {
        createdAt: "desc", // Ordenar por mais recente
      }
    });
    res.json(produtos);
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    res.status(500).json({ error: "Erro ao buscar produtos." });
  }
});

// Rota para buscar um produto específico pelo ID
app.get("/api/produtos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const produto = await prisma.produto.findUnique({
      where: { id: parseInt(id) },
    });
    if (produto) {
      res.json(produto);
    } else {
      res.status(404).json({ error: "Produto não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    res.status(500).json({ error: "Erro ao buscar produto." });
  }
});

// Rota para atualizar um produto pelo ID
app.put("/api/produtos/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, imagem_url, tamanho } = req.body;
  if (!nome || !descricao || preco === undefined) {
    return res.status(400).json({ error: "Nome, descrição e preço são obrigatórios para atualização." });
  }
  try {
    const produtoAtualizado = await prisma.produto.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        descricao,
        preco: parseFloat(preco),
        imagem_url,
        tamanho,
      },
    });
    res.json(produtoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    if (error.code === "P2025") { 
        return res.status(404).json({ error: "Produto não encontrado para atualização." });
    }
    res.status(500).json({ error: "Erro ao atualizar produto." });
  }
});

// Rota para deletar um produto pelo ID
app.delete("/api/produtos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.produto.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); 
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    if (error.code === "P2025") {
        return res.status(404).json({ error: "Produto não encontrado para deleção." });
    }
    res.status(500).json({ error: "Erro ao deletar produto." });
  }
});

// Rota para servir a página de administração principal
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// Rota para servir a página de edição de produto
app.get("/admin/editar", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "editar_produto.html"));
});


const PORT = process.env.PORT || 3001; 
app.listen(PORT, () => {
  console.log(`Servidor Node.js rodando na porta ${PORT}`);
});

