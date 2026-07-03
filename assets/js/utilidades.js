const API_PRODUTOS = "http://localhost:3000/produtos";

function caminhoBase() {
  const estaEmPaginaInterna = window.location.pathname.includes("/pages/");
  return estaEmPaginaInterna ? "../" : "./";
}

function formatarPreco(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function montarLinkProduto(id) {
  return caminhoBase() + "pages/produto.html?id=" + id;
}

async function buscarProdutos() {
  try {
    const resposta = await fetch(API_PRODUTOS);

    if (!resposta.ok) {
      throw new Error("API indisponivel");
    }

    const produtosApi = await resposta.json();

    if (!produtosApi.every(function (produto) {
      return Array.isArray(produto.imagens) && produto.imagens.length >= 3;
    })) {
      throw new Error("API sem imagens cadastradas");
    }

    return produtosApi;
  } catch (erro) {
    const respostaLocal = await fetch(caminhoBase() + "dbTeste.json");
    const banco = await respostaLocal.json();
    return banco.produtos;
  }
}

function escaparAtributo(valor) {
  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function resolverCaminhoImagem(caminho) {
  if (!caminho) {
    return "";
  }

  if (/^(https?:|data:|blob:|\/)/.test(caminho)) {
    return caminho;
  }

  if (caminho.indexOf("./") === 0) {
    return caminhoBase() + caminho.slice(2);
  }

  if (caminho.indexOf("../") === 0) {
    return caminho;
  }

  return caminhoBase() + caminho;
}

function obterImagensProduto(produto) {
  const imagens = Array.isArray(produto.imagens) ? produto.imagens : [];

  return [0, 1, 2].map(function (indice) {
    const imagem = imagens[indice] || {};

    return {
      src: typeof imagem === "string" ? imagem : imagem.src || "",
      alt: imagem.alt || produto.nome + " - foto " + (indice + 1)
    };
  });
}

function criarTagImagem(imagem, classe, loading) {
  const caminho = resolverCaminhoImagem(imagem.src);
  const atributoSrc = caminho ? ' src="' + escaparAtributo(caminho) + '"' : "";
  const atributoClasse = classe ? ' class="' + classe + '"' : "";
  const atributoLoading = loading ? ' loading="' + loading + '"' : "";

  return '<img' + atributoClasse + atributoSrc + ' alt="' + escaparAtributo(imagem.alt) + '"' + atributoLoading + ">";
}

function criarVisualProduto(produto) {
  const imagem = obterImagensProduto(produto)[0];
  const classe = "produto-card-visual" + (imagem.src ? "" : " imagem-pendente");

  return (
    '<div class="' + classe + '">' +
      criarTagImagem(imagem, "produto-card-imagem", "lazy") +
    "</div>"
  );
}

function criarCardProduto(produto) {
  const precoAntigo = produto.precoAntigo > 0
    ? '<span class="preco-antigo">' + formatarPreco(produto.precoAntigo) + "</span>"
    : "";

  return (
    '<article class="produto-card" data-animar>' +
      '<a href="' + montarLinkProduto(produto.id) + '" aria-label="Ver ' + produto.nome + '">' +
        criarVisualProduto(produto) +
      "</a>" +
      '<div class="produto-card-corpo">' +
        '<p class="produto-meta">' + produto.categoria + " / " + produto.genero + "</p>" +
        "<h3>" + produto.nome + "</h3>" +
        '<div class="produto-card-preco">' +
          '<span class="preco">' + formatarPreco(produto.preco) + "</span>" +
          precoAntigo +
        "</div>" +
        '<a class="botao" href="' + montarLinkProduto(produto.id) + '">Ver produto <i class="fa-solid fa-arrow-right"></i></a>' +
      "</div>" +
    "</article>"
  );
}

const NOME_CARRINHO = "boltCarrinho";

function lerCarrinho() {
  const carrinhoSalvo = localStorage.getItem(NOME_CARRINHO);

  if (!carrinhoSalvo) {
    return [];
  }

  return JSON.parse(carrinhoSalvo).map(function (item) {
    return {
      id: item.id,
      nome: item.nome,
      categoria: item.categoria || "Produto",
      preco: item.preco,
      tamanho: item.tamanho,
      quantidade: item.quantidade,
      imagem: item.imagem || {
        src: "",
        alt: item.nome + " - foto do produto"
      }
    };
  });
}

function salvarCarrinho(carrinho) {
  localStorage.setItem(NOME_CARRINHO, JSON.stringify(carrinho));
  atualizarQuantidadeCarrinho();
}

function adicionarAoCarrinho(produto, tamanho) {
  const carrinho = lerCarrinho();

  const itemExistente = carrinho.find(function (item) {
    return item.id === produto.id && item.tamanho === tamanho;
  });

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({
      id: produto.id,
      nome: produto.nome,
      categoria: produto.categoria,
      preco: produto.preco,
      tamanho: tamanho,
      quantidade: 1,
      imagem: obterImagensProduto(produto)[0]
    });
  }

  salvarCarrinho(carrinho);
}

function atualizarQuantidadeCarrinho() {
  const contadores = document.querySelectorAll("[data-contador-carrinho]");
  const carrinho = lerCarrinho();
  let quantidadeTotal = 0;

  carrinho.forEach(function (item) {
    quantidadeTotal += item.quantidade;
  });

  contadores.forEach(function (contador) {
    contador.textContent = quantidadeTotal;
  });
}

document.addEventListener("DOMContentLoaded", atualizarQuantidadeCarrinho);
