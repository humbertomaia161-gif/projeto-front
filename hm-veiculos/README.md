# HM Veículos

Projeto Integrador de Front-end: página de uma loja de carros de João Pessoa, Paraíba. A página usa JavaScript puro para processar, classificar e mostrar o estoque.

## Estrutura

```
projeto-integrador-frontend-seunome/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    └── script.js
```

## O que o JavaScript faz

- **Dados:** array `carros` com 8 objetos (marca, modelo, ano, preco, km, categoria).
- **Processa:** `calcularPrecoFinal(preco, descontoPercentual = 5)` calcula o preço com desconto (parâmetro com valor padrão).
- **Classifica:** `classificarFaixa(precoFinal)` devolve `economico`, `intermediario` ou `premium`.
- **Formata:** `formatarPreco(valor)` mostra o valor em reais.
- **Array:** `map` (processar cada carro), `filter` (destaques premium) e `reduce` (resumo e agrupamento). O `sort` é feito em uma cópia do array.
- **DOM:** `querySelector`, `createElement`, `textContent`, `append` e `classList.add`.
- **Botões interativos:** filtro por faixa (Todos, Econômico, Intermediário, Premium, Favoritos), ordenação (menor preço, maior preço, mais novo, menor km), desconto de 0%, 5% ou 10%, campo de busca por marca ou modelo e botão para limpar os filtros. Cada cartão tem os botões "Favoritar" e "Tenho interesse". O estado fica no objeto `estado` e a função `renderizar()` redesenha a página a cada clique.
- **Desafio extra:** agrupamento por categoria com `reduce` e fábrica com closure (`criarCalculadoraDesconto`).

## Como rodar

Abra o `index.html` no navegador e confira o Console (F12): não deve haver erros.

## Git

```bash
git checkout -b feature/js-funcoes-dom
git add .
git commit -m "feat: estrutura HTML e CSS da HM Veículos"
git commit -m "feat: funções de cálculo e classificação"
git commit -m "feat: exibição dos carros e resumo no DOM"
git push -u origin feature/js-funcoes-dom
```

Depois, abra um Pull Request da branch `feature/js-funcoes-dom` para a `main` no GitHub.
