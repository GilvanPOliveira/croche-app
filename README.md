<div align="left">
  <img src="./src/assets\image\logo\logo.png" width="25%" />
</div>

# 🧶 VaCrochetando – Vane Alves Crochê

Aplicação **SPA em Angular** pensada para organizar e apresentar o catálogo de peças de crochê, aulas e encomendas personalizadas da marca **Vane Alves Crochê**.

O projeto reúne:

- Catálogo de peças com filtros por categoria e tipo  
- Página de detalhes com tamanhos, imagens e navegação entre peças  
- Carrinho de encomendas com suporte a **customização completa**  
- Seção de aulas em formato de vitrine  
- Design system próprio (cores, tipografia, cards, botões, etc.)

## 📚 Sobre o Projeto

O objetivo deste projeto é servir como uma vitrine digital + sistema de encomendas para o universo do crochê:

- Mostrar peças já prontas, separadas por **categorias** e **tipos**
- Permitir que a cliente navegue nos detalhes da peça, veja imagens, tamanhos e descrição
- Facilitar o **pedido de encomendas** (inclusive com variação de tamanhos e peças customizadas)
- Centralizar também as **aulas** em um único lugar, com um layout limpo e responsivo

Toda a aplicação é construída com **Angular (standalone components)** e utiliza **JSON** para descrever as peças, customizações e demais dados.


## ✨ Funcionalidades

### 🧵 Catálogo de Peças (`/pecas`)

- Listagem de todas as peças disponíveis (exceto a peça especial de customização)
- Filtros por:
  - **Categoria** (ex.: Blusas, Acessórios, Criação, etc.)
  - **Tipo** (ex.: Cropped, Bandana, Top, etc.)
- Filtros mantêm o estado na navegação:
  - Ao voltar da página de detalhe, a tela de peças retorna com a mesma categoria/tipo selecionados
- Página utiliza **OnPush** e `PecasService` com cache para melhor performance

### 🧶 Detalhe da Peça (`/pecas/...`)

- Exibe:
  - Nome, imagem principal, descrição, preço
  - Tamanhos disponíveis e informações adicionais
- Integração com encomendas:
  - Adiciona a peça ao **carrinho**, respeitando tamanho/medidas/customização
- Mantém contexto:
  - Ao voltar, preserva filtros da lista
  - Integração futura para preservar também o tamanho selecionado

### 🧺 Encomendas (`/encomendas`)

- Lista todas as encomendas feitas, incluindo:
  - Peças “normais”
  - Peças **customizadas**
  - **Aulas** compradas
- Cada item:
  - Exibe imagem, nome, preço e quantidade
  - Permite **aumentar/diminuir quantidade** ou **remover** apenas aquele item  
    (a lógica de remoção foi ajustada para usar o **índice do item**, não apenas o `id`)
- Resumo da customização:
  - Linhas/cores selecionadas
  - Medidas informadas (busto, cintura, altura, etc.)
  - Observações adicionais
- Totalizador:
  - Soma o valor de todos os itens com base na quantidade
- Estado vazio:
  - Botões para:
    - Ver peças
    - Criar customização
    - Ver aulas

### 🎨 Customização Completa

- Existe uma peça especial no catálogo, **“Crie sua própria peça”**:
  - `id: 1`
  - `slug: "crie-sua-propria-peca"`
  - `tipo: "customizado"`
- Essa peça:
  - **Não aparece** na listagem geral de `/pecas`
  - É acessada apenas pelo botão **“Criar customização”** na tela de encomendas
- A partir dessa peça, a cliente pode:
  - Escolher linhas e cores
  - Informar medidas detalhadas
  - Adicionar observações
- A customização é salva junto com o item no carrinho via `EncomendasService`

### 🎓 Aulas (`/aulas`)

- Grid de aulas, cada uma com:
  - Card com título, descrição e imagem
- Layout responsivo e centralizado, com cards estilizados usando o design system global
- Aulas também podem ser adicionadas ao carrinho de encomendas, com exibição correta na página `/encomendas`

### 🧾 Persistência de Dados

- O estado do carrinho/encomendas é salvo em **`localStorage`**:
  - Ao recarregar a página, os itens da cliente permanecem
- O `EncomendasService` expõe:
  - `carrinho$` como `BehaviorSubject<ItemCarrinho[]>`
  - Métodos para adicionar, remover, limpar, aumentar/diminuir quantidade e salvar customizações

## 🛠 Tecnologias Utilizadas

[![My Skills](https://skillicons.dev/icons?i=html,css,angular,typescript,n&perline=10)](https://github.com/GilvanPOliveira)

## 📬 Contato

Se tiver dúvidas ou sugestões, fique à vontade para entrar em contato:
- E-mail: gilvanoliveira06@gmail.com
- Portifólio: [Gilvan Oliveira](https://gilvanpoliveira.github.io/)