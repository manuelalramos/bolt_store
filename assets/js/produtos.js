const listaProdutos = document.querySelector("#lista-produtos");
const quantidadeProdutos = document.querySelector("#quantidade-produtos");

async function iniciarProdutos() {
  const produtos = await buscarProdutos();
  listaProdutos.innerHTML = produtos.map(criarCardProduto).join("");
  quantidadeProdutos.textContent = produtos.length + " produto(s) encontrado(s)";
}

iniciarProdutos();