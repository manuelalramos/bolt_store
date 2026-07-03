const listaProdutos = document.querySelector("#lista-produtos");
const quantidadeProdutos = document.querySelector("#quantidade-produtos");
const botoesCategoria = document.querySelectorAll("[data-categoria]");
const filtroGenero = document.querySelector("#filtro-genero");
const campoBusca = document.querySelector("#campo-busca");

let produtos = [];
let categoriaAtual = "Todos";

async function iniciarProdutos() {
  produtos = await buscarProdutos();
  mostrarProdutos();
}

function mostrarProdutos() {
  const generoAtual = filtroGenero.value;
  const buscaAtual = campoBusca.value.toLowerCase().trim();

  const produtosFiltrados = produtos.filter(function (produto) {
    const passaCategoria = categoriaAtual === "Todos" || produto.categoria === categoriaAtual;
    const passaGenero = generoAtual === "Todos" || produto.genero === generoAtual;
    const passaBusca = produto.nome.toLowerCase().includes(buscaAtual);

    return passaCategoria && passaGenero && passaBusca;
  });

  if (produtosFiltrados.length === 0) {
    listaProdutos.innerHTML = '<div class="estado-vazio">Nenhum produto encontrado.</div>';
  } else {
    listaProdutos.innerHTML = produtosFiltrados.map(criarCardProduto).join("");
  }

  quantidadeProdutos.textContent = produtosFiltrados.length + " produto(s) encontrado(s)";
  prepararAnimacaoScroll();
}

function selecionarCategoria(categoria) {
  categoriaAtual = categoria;

  botoesCategoria.forEach(function (botao) {
    botao.classList.toggle("ativo", botao.dataset.categoria === categoria);
  });

  mostrarProdutos();
}

botoesCategoria.forEach(function (botao) {
  botao.addEventListener("click", function () {
    selecionarCategoria(botao.dataset.categoria);
  });
});

filtroGenero.addEventListener("change", mostrarProdutos);
campoBusca.addEventListener("input", mostrarProdutos);

iniciarProdutos();