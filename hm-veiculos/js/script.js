// HM Veículos - João Pessoa/PB
// Padrão da atividade: processar -> classificar -> mostrar

// ---------- 1. DADOS ----------
const carros = [
  { id: 1, marca: "Fiat", modelo: "Mobi", ano: 2021, preco: 42000, km: 38000, categoria: "Hatch" },
  { id: 2, marca: "Chevrolet", modelo: "Onix", ano: 2022, preco: 61000, km: 27000, categoria: "Hatch" },
  { id: 3, marca: "Volkswagen", modelo: "Polo", ano: 2023, preco: 89000, km: 15000, categoria: "Hatch" },
  { id: 4, marca: "Toyota", modelo: "Corolla", ano: 2020, preco: 118000, km: 52000, categoria: "Sedan" },
  { id: 5, marca: "Honda", modelo: "Civic", ano: 2019, preco: 96000, km: 64000, categoria: "Sedan" },
  { id: 6, marca: "Jeep", modelo: "Compass", ano: 2023, preco: 165000, km: 12000, categoria: "SUV" },
  { id: 7, marca: "Hyundai", modelo: "Creta", ano: 2022, preco: 112000, km: 30000, categoria: "SUV" },
  { id: 8, marca: "Fiat", modelo: "Toro", ano: 2021, preco: 135000, km: 41000, categoria: "Picape" }
];

const rotulos = {
  economico: "Econômico",
  intermediario: "Intermediário",
  premium: "Premium"
};

// Estado da tela: o que o visitante escolheu nos botões.
const estado = {
  faixa: "todos",
  ordem: "menor",
  desconto: 5,
  busca: "",
  favoritos: new Set(),
  interesses: new Set()
};

// ---------- 2. FUNÇÕES QUE CALCULAM (não mexem na página) ----------

// Processa: calcula o preço com desconto. O desconto tem valor padrão de 5%.
function calcularPrecoFinal(preco, descontoPercentual = 5) {
  return preco - (preco * descontoPercentual) / 100;
}

// Classifica: três faixas, da menor para a maior.
function classificarFaixa(precoFinal) {
  if (precoFinal < 60000) {
    return "economico";
  }
  if (precoFinal < 110000) {
    return "intermediario";
  }
  return "premium";
}

// Formata um número como moeda brasileira.
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Desafio extra: fábrica com closure. Recebe o desconto e devolve a função já ajustada.
function criarCalculadoraDesconto(descontoPercentual) {
  return function (preco) {
    return calcularPrecoFinal(preco, descontoPercentual);
  };
}

// Gera uma nova lista com o resultado de cada carro (map), sem alterar o original.
// Carros de antes de 2022 ganham 5 pontos extras de desconto (via closure).
function processarCarros(lista, desconto = 5) {
  const calcularAntigo = criarCalculadoraDesconto(desconto + 5);
  const calcularNovo = criarCalculadoraDesconto(desconto);

  return lista.map(function (carro) {
    const precoFinal = carro.ano < 2022
      ? calcularAntigo(carro.preco)
      : calcularNovo(carro.preco);
    return {
      ...carro,
      precoFinal: precoFinal,
      faixa: classificarFaixa(precoFinal)
    };
  });
}

// Separa um subconjunto (filter).
function filtrarPorFaixa(lista, faixa) {
  return lista.filter(function (carro) {
    return carro.faixa === faixa;
  });
}

// Aplica os filtros escolhidos nos botões e na busca (filter).
function filtrarCarros(lista, filtros, favoritos) {
  const texto = filtros.busca.trim().toLowerCase();

  return lista.filter(function (carro) {
    const nome = (carro.marca + " " + carro.modelo).toLowerCase();
    const passaBusca = nome.includes(texto);

    let passaFaixa = true;
    if (filtros.faixa === "favoritos") {
      passaFaixa = favoritos.has(carro.id);
    } else if (filtros.faixa !== "todos") {
      passaFaixa = carro.faixa === filtros.faixa;
    }

    return passaBusca && passaFaixa;
  });
}

// Ordena uma CÓPIA da lista (sort altera o array original).
function ordenarCarros(lista, ordem) {
  const copia = [...lista];

  if (ordem === "maior") {
    return copia.sort(function (a, b) { return b.precoFinal - a.precoFinal; });
  }
  if (ordem === "novo") {
    return copia.sort(function (a, b) { return b.ano - a.ano; });
  }
  if (ordem === "km") {
    return copia.sort(function (a, b) { return a.km - b.km; });
  }
  return copia.sort(function (a, b) { return a.precoFinal - b.precoFinal; });
}

// Resumo com reduce: total, média, quantidade e carro mais caro.
function gerarResumo(lista) {
  if (lista.length === 0) {
    return null;
  }

  const total = lista.reduce(function (soma, carro) {
    return soma + carro.precoFinal;
  }, 0);
  const maisCaro = lista.reduce(function (maior, carro) {
    return carro.precoFinal > maior.precoFinal ? carro : maior;
  }, lista[0]);

  return {
    quantidade: lista.length,
    total: total,
    media: total / lista.length,
    maisCaro: maisCaro
  };
}

// Desafio extra: agrupa por categoria com reduce.
function agruparPorCategoria(lista) {
  return lista.reduce(function (grupos, carro) {
    if (!grupos[carro.categoria]) {
      grupos[carro.categoria] = [];
    }
    grupos[carro.categoria].push(carro);
    return grupos;
  }, {});
}

// ---------- 3. FUNÇÕES QUE MEXEM NA PÁGINA ----------

// Cria um botão pequeno com texto e classe.
function criarBotao(texto, classe, aoClicar) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.classList.add("botao", classe);
  botao.textContent = texto;
  botao.addEventListener("click", aoClicar);
  return botao;
}

// Monta o cartão de um carro e o devolve.
function criarCartao(carro) {
  const ehFavorito = estado.favoritos.has(carro.id);
  const temInteresse = estado.interesses.has(carro.id);

  const cartao = document.createElement("article");
  cartao.classList.add("cartao", carro.faixa);
  if (ehFavorito) {
    cartao.classList.add("favorito");
  }

  const titulo = document.createElement("h3");
  titulo.textContent = carro.marca + " " + carro.modelo;

  const detalhe = document.createElement("p");
  detalhe.classList.add("detalhe");
  detalhe.textContent = carro.ano + " • " + carro.km.toLocaleString("pt-BR") + " km • " + carro.categoria;

  const precoAntigo = document.createElement("p");
  precoAntigo.classList.add("preco-antigo");
  precoAntigo.textContent = formatarPreco(carro.preco);

  const precoFinal = document.createElement("p");
  precoFinal.classList.add("preco-final");
  precoFinal.textContent = formatarPreco(carro.precoFinal);

  const selo = document.createElement("span");
  selo.classList.add("selo", carro.faixa);
  selo.textContent = rotulos[carro.faixa];

  const acoes = document.createElement("div");
  acoes.classList.add("acoes");

  const botaoFavorito = criarBotao(
    ehFavorito ? "♥ Favoritado" : "♡ Favoritar",
    "botao-favorito",
    function () { alternarNoConjunto(estado.favoritos, carro.id); }
  );
  if (ehFavorito) {
    botaoFavorito.classList.add("ativo");
  }

  const botaoInteresse = criarBotao(
    temInteresse ? "✓ Interesse enviado" : "Tenho interesse",
    "botao-interesse",
    function () { alternarNoConjunto(estado.interesses, carro.id); }
  );
  if (temInteresse) {
    botaoInteresse.classList.add("ativo");
  }

  acoes.append(botaoFavorito, botaoInteresse);
  cartao.append(titulo, detalhe, precoAntigo, precoFinal, selo, acoes);
  return cartao;
}

function mostrarCartoes(lista, area) {
  area.textContent = "";

  if (lista.length === 0) {
    const vazio = document.createElement("p");
    vazio.classList.add("vazio");
    vazio.textContent = "Nenhum veículo encontrado com esses filtros.";
    area.append(vazio);
    return;
  }

  lista.forEach(function (carro) {
    area.append(criarCartao(carro));
  });
}

function mostrarResumo(resumo, totalFavoritos, area) {
  area.textContent = "";

  const linhas = [];
  if (resumo === null) {
    linhas.push("Nenhum veículo para resumir.");
  } else {
    linhas.push("Veículos mostrados: " + resumo.quantidade);
    linhas.push("Valor total: " + formatarPreco(resumo.total));
    linhas.push("Preço médio: " + formatarPreco(resumo.media));
    linhas.push(
      "Mais caro: " + resumo.maisCaro.marca + " " + resumo.maisCaro.modelo +
      " (" + formatarPreco(resumo.maisCaro.precoFinal) + ")"
    );
  }
  linhas.push("Favoritos: " + totalFavoritos);

  linhas.forEach(function (texto) {
    const p = document.createElement("p");
    p.textContent = texto;
    area.append(p);
  });
}

function mostrarCategorias(grupos, area) {
  area.textContent = "";

  Object.keys(grupos).forEach(function (categoria) {
    const bloco = document.createElement("div");
    bloco.classList.add("grupo");

    const titulo = document.createElement("h3");
    titulo.textContent = categoria + " (" + grupos[categoria].length + ")";

    const lista = document.createElement("ul");
    grupos[categoria].forEach(function (carro) {
      const item = document.createElement("li");
      item.textContent = carro.marca + " " + carro.modelo + " - " + formatarPreco(carro.precoFinal);
      lista.append(item);
    });

    bloco.append(titulo, lista);
    area.append(bloco);
  });
}

// Marca como "ativo" o botão do grupo cujo data-atributo vale o valor atual.
function marcarAtivo(grupo, atributo, valor) {
  grupo.querySelectorAll("button").forEach(function (botao) {
    botao.classList.toggle("ativo", botao.dataset[atributo] === String(valor));
  });
}

// ---------- 4. EXECUÇÃO E EVENTOS ----------
const areaResumo = document.querySelector("#resumo");
const areaResultado = document.querySelector("#resultado");
const areaDestaques = document.querySelector("#destaques");
const areaCategorias = document.querySelector("#categorias");
const areaContagem = document.querySelector("#contagem");
const grupoFiltros = document.querySelector("#filtros");
const grupoOrdens = document.querySelector("#ordens");
const grupoDescontos = document.querySelector("#descontos");
const campoBusca = document.querySelector("#busca");
const botaoLimpar = document.querySelector("#limpar");

function alternarNoConjunto(conjunto, id) {
  if (conjunto.has(id)) {
    conjunto.delete(id);
  } else {
    conjunto.add(id);
  }
  renderizar();
}

// Recalcula tudo e redesenha a página sempre que um botão muda o estado.
function renderizar() {
  const processados = processarCarros(carros, estado.desconto);
  const visiveis = ordenarCarros(filtrarCarros(processados, estado, estado.favoritos), estado.ordem);
  const premium = ordenarCarros(filtrarPorFaixa(processados, "premium"), "menor");

  mostrarResumo(gerarResumo(visiveis), estado.favoritos.size, areaResumo);
  mostrarCartoes(visiveis, areaResultado);
  mostrarCartoes(premium, areaDestaques);
  mostrarCategorias(agruparPorCategoria(ordenarCarros(processados, "menor")), areaCategorias);

  areaContagem.textContent = "Mostrando " + visiveis.length + " de " + carros.length + " veículos";
  marcarAtivo(grupoFiltros, "faixa", estado.faixa);
  marcarAtivo(grupoOrdens, "ordem", estado.ordem);
  marcarAtivo(grupoDescontos, "desconto", estado.desconto);
}

function ligarGrupo(grupo, atributo, aoEscolher) {
  grupo.querySelectorAll("button").forEach(function (botao) {
    botao.addEventListener("click", function () {
      aoEscolher(botao.dataset[atributo]);
      renderizar();
    });
  });
}

function iniciar() {
  const areas = [
    areaResumo, areaResultado, areaDestaques, areaCategorias, areaContagem,
    grupoFiltros, grupoOrdens, grupoDescontos, campoBusca, botaoLimpar
  ];
  if (areas.some(function (area) { return area === null; })) {
    console.error("Algum elemento não foi encontrado no HTML.");
    return;
  }

  ligarGrupo(grupoFiltros, "faixa", function (valor) { estado.faixa = valor; });
  ligarGrupo(grupoOrdens, "ordem", function (valor) { estado.ordem = valor; });
  ligarGrupo(grupoDescontos, "desconto", function (valor) { estado.desconto = Number(valor); });

  campoBusca.addEventListener("input", function () {
    estado.busca = campoBusca.value;
    renderizar();
  });

  botaoLimpar.addEventListener("click", function () {
    estado.faixa = "todos";
    estado.ordem = "menor";
    estado.desconto = 5;
    estado.busca = "";
    campoBusca.value = "";
    renderizar();
  });

  renderizar();
}

iniciar();
