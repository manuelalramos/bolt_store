const listaCarrinho = document.querySelector("#lista-carrinho");
const campoSubtotal = document.querySelector("#resumo-subtotal");
const campoFrete = document.querySelector("#resumo-frete");
const campoTotal = document.querySelector("#resumo-total");
const mensagemFrete = document.querySelector("#mensagem-frete");
const botaoFinalizar = document.querySelector("#finalizar-pedido");
const mensagemFinalizacao = document.querySelector("#mensagem-finalizacao");

function iniciarCarrinho() {
  mostrarCarrinho();
}

function mostrarCarrinho() {
  const carrinho = lerCarrinho();

  if (carrinho.length === 0) {
    listaCarrinho.innerHTML =
      '<article class="carrinho-vazio" data-animar>' +
        "<h2>Carrinho vazio</h2>" +
        "<p>Escolha uma peca da vitrine para montar seu pedido.</p>" +
        '<a class="botao" href="../index.html#produtos">Ver produtos <i class="fa-solid fa-arrow-right"></i></a>' +
      "</article>";
  } else {
    listaCarrinho.innerHTML = carrinho.map(criarItemCarrinho).join("");
  }

  atualizarResumo(carrinho);
  prepararAnimacaoScroll();
}

function criarItemCarrinho(item) {
  const imagem = item.imagem || {
    src: "",
    alt: item.nome + " - foto do produto"
  };
  const classeVisual = "item-visual" + (imagem.src ? "" : " imagem-pendente");

  return (
    '<article class="item-carrinho" data-animar>' +
      '<div class="' + classeVisual + '">' +
        criarTagImagem(imagem, "item-imagem", "lazy") +
      "</div>" +
      "<div>" +
        "<h2>" + item.nome + "</h2>" +
        "<p>Tamanho: " + item.tamanho + "</p>" +
        '<p class="preco">' + formatarPreco(item.preco) + "</p>" +
      "</div>" +
      '<div class="item-acoes" data-id="' + item.id + '" data-tamanho="' + item.tamanho + '">' +
        '<div class="controle-quantidade">' +
          '<button data-acao="diminuir" aria-label="Diminuir quantidade"><i class="fa-solid fa-minus"></i></button>' +
          "<span>" + item.quantidade + "</span>" +
          '<button data-acao="aumentar" aria-label="Aumentar quantidade"><i class="fa-solid fa-plus"></i></button>' +
        "</div>" +
        '<button class="botao-remover" data-acao="remover">Remover</button>' +
      "</div>" +
    "</article>"
  );
}

function atualizarResumo(carrinho) {
  let subtotal = 0;

  carrinho.forEach(function (item) {
    subtotal += item.preco * item.quantidade;
  });

  const limiteFreteGratis = 300;
  const frete = subtotal === 0 || subtotal >= limiteFreteGratis ? 0 : 19.9;
  const total = subtotal + frete;

  campoSubtotal.textContent = formatarPreco(subtotal);
  campoFrete.textContent = subtotal === 0 ? formatarPreco(0) : frete === 0 ? "Gratis" : formatarPreco(frete);
  campoTotal.textContent = formatarPreco(total);

  if (subtotal === 0) {
    mensagemFrete.textContent = "Adicione produtos para calcular o frete.";
  } else if (subtotal >= limiteFreteGratis) {
    mensagemFrete.textContent = "Seu pedido ganhou frete gratis.";
  } else {
    mensagemFrete.textContent = "Faltam " + formatarPreco(limiteFreteGratis - subtotal) + " para ganhar frete gratis.";
  }
}

function encontrarItem(carrinho, id, tamanho) {
  return carrinho.findIndex(function (item) {
    return item.id === id && item.tamanho === tamanho;
  });
}

listaCarrinho.addEventListener("click", function (evento) {
  const botao = evento.target.closest("[data-acao]");

  if (!botao) {
    return;
  }

  const acoes = botao.closest(".item-acoes");
  const id = Number(acoes.dataset.id);
  const tamanho = acoes.dataset.tamanho;
  const carrinho = lerCarrinho();
  const posicao = encontrarItem(carrinho, id, tamanho);

  if (posicao === -1) {
    return;
  }

  if (botao.dataset.acao === "aumentar") {
    carrinho[posicao].quantidade += 1;
  }

  if (botao.dataset.acao === "diminuir") {
    carrinho[posicao].quantidade -= 1;

    if (carrinho[posicao].quantidade <= 0) {
      carrinho.splice(posicao, 1);
    }
  }

  if (botao.dataset.acao === "remover") {
    carrinho.splice(posicao, 1);
  }

  salvarCarrinho(carrinho);
  mostrarCarrinho();
});

botaoFinalizar.addEventListener("click", function () {
  const carrinho = lerCarrinho();

  if (carrinho.length === 0) {
    mensagemFinalizacao.textContent = "Adicione um produto antes de finalizar.";
    return;
  }

  localStorage.removeItem(NOME_CARRINHO);
  atualizarQuantidadeCarrinho();
  mostrarCarrinho();
  mensagemFinalizacao.textContent = "Pedido finalizado com sucesso.";
});

iniciarCarrinho();
