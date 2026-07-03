const areaProduto = document.querySelector("#produto-detalhe");
const areaRelacionados = document.querySelector("#produtos-relacionados");

let produtoAtual = null;
let tamanhoSelecionado = "";

async function iniciarPaginaProduto() {
  const parametros = new URLSearchParams(window.location.search);
  const idProduto = Number(parametros.get("id"));
  const produtos = await buscarProdutos();

  produtoAtual = produtos.find(function (produto) {
    return produto.id === idProduto;
  });

  if (!produtoAtual) {
    areaProduto.innerHTML = '<div class="estado-vazio">Produto nao encontrado.</div>';
    areaRelacionados.innerHTML = "";
    return;
  }

  mostrarProduto(produtoAtual);
  mostrarRelacionados(produtos);
  prepararAnimacaoScroll();
}

function mostrarProduto(produto) {
  const precoAntigo = produto.precoAntigo > 0
    ? '<span class="preco-antigo">' + formatarPreco(produto.precoAntigo) + "</span>"
    : "";

  areaProduto.innerHTML =
    '<div class="produto-foto" data-animar aria-label="Espaco para foto do produto"></div>' +
    '<article class="produto-info" data-animar>' +
      '<p class="produto-meta">' + produto.categoria + " / " + produto.genero + "</p>" +
      "<h1>" + produto.nome + "</h1>" +
      '<div class="produto-precos">' +
        '<span class="preco">' + formatarPreco(produto.preco) + "</span>" +
        precoAntigo +
      "</div>" +
      '<p class="descricao">' + produto.descricao + "</p>" +
      '<div class="opcoes-bloco">' +
        "<p>Selecione o tamanho</p>" +
        '<div class="opcoes-lista" id="lista-tamanhos"></div>' +
      "</div>" +
      '<button class="botao botao-largo" id="botao-adicionar">Adicionar ao carrinho <i class="fa-solid fa-cart-plus"></i></button>' +
      '<p class="mensagem-produto" id="mensagem-produto"></p>' +
      '<div class="produto-detalhes">' +
        "<details open>" +
          "<summary>Detalhes</summary>" +
          "<p>Peca com caimento moderno, pensada para looks teen e uso no dia a dia.</p>" +
        "</details>" +
        "<details>" +
          "<summary>Entrega</summary>" +
          "<p>O prazo aparece no fechamento do pedido. Frete gratis acima de R$ 299,00.</p>" +
        "</details>" +
        "<details>" +
          "<summary>Trocas</summary>" +
          "<p>Voce pode solicitar troca caso o tamanho nao fique ideal.</p>" +
        "</details>" +
      "</div>" +
    "</article>";

  criarBotoesTamanho(produto);
  prepararBotaoAdicionar();
}

function criarBotoesTamanho(produto) {
  const listaTamanhos = document.querySelector("#lista-tamanhos");

  listaTamanhos.innerHTML = produto.tamanhos.map(function (tamanho) {
    return '<button class="botao-tamanho" data-tamanho="' + tamanho + '">' + tamanho + "</button>";
  }).join("");

  document.querySelectorAll("[data-tamanho]").forEach(function (botao) {
    botao.addEventListener("click", function () {
      tamanhoSelecionado = botao.dataset.tamanho;

      document.querySelectorAll("[data-tamanho]").forEach(function (outroBotao) {
        outroBotao.classList.remove("ativo");
      });

      botao.classList.add("ativo");
    });
  });
}

function prepararBotaoAdicionar() {
  const botaoAdicionar = document.querySelector("#botao-adicionar");
  const mensagemProduto = document.querySelector("#mensagem-produto");

  botaoAdicionar.addEventListener("click", function () {
    mensagemProduto.classList.remove("sucesso");

    if (tamanhoSelecionado === "") {
      mensagemProduto.textContent = "Selecione um tamanho antes de adicionar ao carrinho.";
      return;
    }

    adicionarAoCarrinho(produtoAtual, tamanhoSelecionado);
    mensagemProduto.textContent = "Produto adicionado ao carrinho.";
    mensagemProduto.classList.add("sucesso");
  });
}

function mostrarRelacionados(produtos) {
  const relacionados = produtos.filter(function (produto) {
    return produto.categoria === produtoAtual.categoria && produto.id !== produtoAtual.id;
  }).slice(0, 4);

  areaRelacionados.innerHTML = relacionados.map(criarCardProduto).join("");
}

iniciarPaginaProduto();