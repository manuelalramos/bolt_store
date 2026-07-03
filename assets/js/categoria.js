const listaCategoria = document.querySelector("#lista-categoria");
const quantidadeCategoria = document.querySelector("#quantidade-categoria");
const botoesGeneroCategoria = document.querySelectorAll("[data-genero-categoria]");
const categoriaDaPagina = document.body.dataset.categoriaPagina;

let produtosDaCategoria = [];
let generoSelecionado = "Todos";

async function iniciarCategoria() {
  const produtos = await buscarProdutos();

  produtosDaCategoria = produtos.filter(function (produto) {
    return produto.categoria === categoriaDaPagina;
  });

  mostrarCategoria();
}

function mostrarCategoria() {
  const filtrados = produtosDaCategoria.filter(function (produto) {
    return generoSelecionado === "Todos" || produto.genero === generoSelecionado;
  });

  if (filtrados.length === 0) {
    listaCategoria.innerHTML = '<div class="estado-vazio">Nenhum produto encontrado nesse filtro.</div>';
  } else {
    listaCategoria.innerHTML = filtrados.map(criarCardProduto).join("");
  }

  quantidadeCategoria.textContent = filtrados.length + " produto(s)";
  prepararAnimacaoScroll();
}

botoesGeneroCategoria.forEach(function (botao) {
  botao.addEventListener("click", function () {
    generoSelecionado = botao.dataset.generoCategoria;

    botoesGeneroCategoria.forEach(function (outroBotao) {
      outroBotao.classList.remove("ativo");
    });

    botao.classList.add("ativo");
    mostrarCategoria();
  });
});

iniciarCategoria();