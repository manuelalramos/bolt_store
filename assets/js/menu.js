const botaoMenu = document.querySelector("#botao-menu");
const menu = document.querySelector("#menu");
const linksMenu = document.querySelectorAll("#menu a");
const campoAno = document.querySelector("#ano");
const botoesVoltarTopo = document.querySelectorAll(".voltar-topo");
const formulariosNewsletter = document.querySelectorAll("[data-newsletter-form]");

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

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

formulariosNewsletter.forEach(function (formulario) {
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const campoEmail = formulario.querySelector("input[type='email']");
    const mensagem = formulario.querySelector("[data-newsletter-mensagem]");
    const email = campoEmail.value.trim();

    mensagem.classList.remove("sucesso");

    if (email === "") {
      mensagem.textContent = "Digite seu e-mail.";
      campoEmail.focus();
      return;
    }

    if (!validarEmail(email)) {
      mensagem.textContent = "Digite um e-mail valido.";
      campoEmail.focus();
      return;
    }

    mensagem.textContent = "E-mail cadastrado com sucesso.";
    mensagem.classList.add("sucesso");
    formulario.reset();
  });
});

function prepararAnimacaoScroll() {
  const elementos = document.querySelectorAll("[data-animar]");

  if (elementos.length === 0) {
    return;
  }

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visivel");
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.14 });

  elementos.forEach(function (elemento) {
    observador.observe(elemento);
  });
}

prepararAnimacaoScroll();