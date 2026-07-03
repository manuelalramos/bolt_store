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

    return await resposta.json();
  } catch (erro) {
    const respostaLocal = await fetch(caminhoBase() + "dbTeste.json");
    const banco = await respostaLocal.json();
    return banco.produtos;
  }
}

function criarVisualProduto(produto) {
  return (
    '<div class="produto-card-visual" aria-label="Espaco para foto de ' + produto.nome + '"></div>'
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