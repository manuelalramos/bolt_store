const botaoMenu = document.querySelector("#botao-menu");
const menu = document.querySelector("#menu");
const linksMenu = document.querySelectorAll("#menu a");
const campoAno = document.querySelector("#ano");
const botoesVoltarTopo = document.querySelectorAll(".voltar-topo");

function alternarMenu() {
  const menuAberto = menu.classList.toggle("ativo");
  const icone = botaoMenu.querySelector("i");

  botaoMenu.classList.toggle("ativo");
  document.body.classList.toggle("menu-aberto");
  botaoMenu.setAttribute("aria-expanded", menuAberto);

  if (icone) {
    icone.classList.toggle("fa-bars", !menuAberto);
    icone.classList.toggle("fa-xmark", menuAberto);
  }
}

if (botaoMenu && menu) {
  botaoMenu.addEventListener("click", alternarMenu);
}

linksMenu.forEach(function (link) {
  link.addEventListener("click", function () {
    if (menu.classList.contains("ativo")) {
      alternarMenu();
    }
  });
});

if (campoAno) {
  campoAno.textContent = new Date().getFullYear();
}

botoesVoltarTopo.forEach(function (botao) {
  botao.addEventListener("click", function (evento) {
    evento.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});