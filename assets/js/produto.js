const areaProduto = document.querySelector("#produto-detalhe");
const areaRelacionados = document.querySelector("#produtos-relacionados");

let produtoAtual = null;
let tamanhoSelecionado = "";
let imagemSelecionada = 0;

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
  tamanhoSelecionado = "";
  imagemSelecionada = 0;

  const precoAntigo = produto.precoAntigo > 0
    ? '<span class="preco-antigo">' + formatarPreco(produto.precoAntigo) + "</span>"
    : "";

  areaProduto.innerHTML =
    criarGaleriaProduto(produto) +
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
  prepararGaleriaProduto(produto);
  prepararBotaoAdicionar();
}

function criarGaleriaProduto(produto) {
  const imagens = obterImagensProduto(produto);
  const imagemPrincipal = imagens[0];
  const classeFoto = "produto-foto" + (imagemPrincipal.src ? "" : " imagem-pendente");

  const miniaturas = imagens.map(function (imagem, indice) {
    const classeMiniatura = "produto-miniatura" +
      (indice === 0 ? " ativo" : "") +
      (imagem.src ? "" : " imagem-pendente");

    return (
      '<button type="button" class="' + classeMiniatura + '" data-imagem-indice="' + indice + '" aria-label="Ver ' + escaparAtributo(imagem.alt) + '">' +
        criarTagImagem(imagem, "produto-miniatura-imagem", "lazy") +
      "</button>"
    );
  }).join("");

  return (
    '<div class="produto-galeria" data-animar>' +
      '<div class="' + classeFoto + '">' +
        criarTagImagem(imagemPrincipal, "produto-imagem-principal", "eager") +
      "</div>" +
      '<div class="produto-galeria-controles" aria-label="Galeria de imagens do produto">' +
        '<button type="button" data-galeria="anterior" aria-label="Imagem anterior"><i class="fa-solid fa-arrow-left"></i></button>' +
        '<div class="produto-miniaturas">' + miniaturas + "</div>" +
        '<button type="button" data-galeria="proxima" aria-label="Proxima imagem"><i class="fa-solid fa-arrow-right"></i></button>' +
      "</div>" +
    "</div>"
  );
}

function prepararGaleriaProduto(produto) {
  const imagens = obterImagensProduto(produto);
  const foto = document.querySelector(".produto-foto");
  const imagemPrincipal = document.querySelector(".produto-imagem-principal");
  const miniaturas = document.querySelectorAll("[data-imagem-indice]");
  const botaoAnterior = document.querySelector("[data-galeria='anterior']");
  const botaoProxima = document.querySelector("[data-galeria='proxima']");

  function atualizarGaleria(indice) {
    imagemSelecionada = (indice + imagens.length) % imagens.length;
    const imagem = imagens[imagemSelecionada];
    const caminho = resolverCaminhoImagem(imagem.src);

    if (caminho) {
      imagemPrincipal.setAttribute("src", caminho);
    } else {
      imagemPrincipal.removeAttribute("src");
    }

    imagemPrincipal.setAttribute("alt", imagem.alt);
    foto.classList.toggle("imagem-pendente", !imagem.src);

    miniaturas.forEach(function (miniatura) {
      const estaAtiva = Number(miniatura.dataset.imagemIndice) === imagemSelecionada;
      miniatura.classList.toggle("ativo", estaAtiva);
    });
  }

  miniaturas.forEach(function (miniatura) {
    miniatura.addEventListener("click", function () {
      atualizarGaleria(Number(miniatura.dataset.imagemIndice));
    });
  });

  botaoAnterior.addEventListener("click", function () {
    atualizarGaleria(imagemSelecionada - 1);
  });

  botaoProxima.addEventListener("click", function () {
    atualizarGaleria(imagemSelecionada + 1);
  });
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
