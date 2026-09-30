# 🌟 ONG Esperança - Portal Institucional

Portal web desenvolvido como parte de um trabalho acadêmico, com o objetivo de apresentar os projetos sociais, facilitar a Central de Doações e gerenciar o cadastro de voluntários de uma ONG fictícia focada em comunidades urbanas.

---

## 🚀 Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando tecnologias web modernas, priorizando a performance, semântica e acessibilidade:

*   **HTML5 Semântico:** Estrutura das páginas seguindo as diretrizes de acessibilidade (ARIA).
*   **CSS3 Moderno:** Estilização responsiva com Flexbox, Grid e variáveis customizadas, mantendo um design limpo e adaptável a dispositivos móveis.
*   **JavaScript (ES6+):** Validação de formulários em tempo real (com verificação robusta de CPF, idade mínima e máscara de campos), consumo assíncrono de API externa (ViaCEP) e manipulação dinâmica da central de doações.

---

## 📂 Estrutura do Projeto

```text
/
├── css/
│   └── style.css       # Estilos globais e responsividade
├── js/
│   └── main.js         # Lógica, validações, API e interatividade
├── images/             # Imagens e ilustrações do projeto
├── index.html          # Página Inicial
├── projetos.html       # Página de Projetos Sociais
├── doacoes.html        # Central de Doações (Financeira e Itens)
└── cadastro.html       # Cadastro de Voluntários com busca de CEP
