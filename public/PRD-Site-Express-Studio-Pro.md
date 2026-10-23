# DOCUMENTO DE REQUISITOS DE PRODUTO (PRD)
## Projeto: Site Express Studio Pro
**Versão:** 1.0.0  
**Status:** Aprovado para Engenharia  
**Data:** Outubro de 2026  
**Autor:** Equipe de Engenharia e Arquitetura de Produto

---

## 1. Visão Geral e Propósito (Executive Summary)

O **Site Express Studio Pro** é uma plataforma SaaS B2B "white-label" desenvolvida para **agências digitais, freelancers e criadores de sites profissionais**. O objetivo central da ferramenta é permitir a criação, customização e publicação de landing pages de altíssima conversão para comércios e prestadores de serviços locais (clínicas de saúde, restaurantes/gastronomia, varejo e serviços especializados) em **menos de 3 minutos**, utilizando dados reais do Google Maps ou inserção manual rápida.

Diferente de construtores genéricos com interface visual carregada ou com "aspecto artificial de IA", o Site Express Studio Pro adota a filosofia do **Apple iOS Design System** (SF Pro, Liquid Glass, cantos squircle suaves, botões com feedback tátil e ergonomia fluida) e organiza a jornada em **3 telas estritamente separadas e sem poluição**.

---

## 2. Personas e Matriz de Acesso

| Persona | Perfil | Objetivos Principais | Interface / Acesso |
| :--- | :--- | :--- | :--- |
| **Dono da Plataforma (Super Admin)** | Proprietário do SaaS Site Express | Criar logins de assinantes, gerenciar cotas de sites (ex: 20 a 100 sites), monitorar inadimplência e revogar acessos de criadores. | Tela 1 (Login Admin) ➔ Tela 2 (Aba Exclusiva: Painel do Dono) |
| **Criador de Sites (Assinante / Agência)** | Designer, freelancer ou agência local | Importar dados de clientes em segundos, ajustar copy e paleta, adicionar logotipo e vídeo, e publicar ou exportar o site para o cliente. | Tela 1 (Login Assinante) ➔ Tela 2 (Dashboard / Gestão de Sites) ➔ Tela 3 (Studio de Edição) |
| **Cliente da Empresa Local (Dono do Negócio)** | Médico, dentista, dono de pizzaria, mecânico | **Não acessa o sistema de edição.** Apenas usufrui da landing page no ar e recebe leads no seu WhatsApp. Contrata a agência criadora. | Visualizador da Landing Page Pública (`?site=slug` ou domínio próprio) |

---

## 3. Arquitetura da Experiência em 3 Telas

O produto elimina a sobrecarga cognitiva dividindo a operação em três momentos claros e lineares:

```
┌─────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
│         TELA 1          │      │         TELA 2          │      │         TELA 3          │
│   Autenticação Limpa    │ ───► │  Dashboard & Gestão     │ ───► │  Studio Pro de Edição   │
│   (Criador / Admin)     │      │  (Busca, Criação, Ação) │      │  (Canvas, Logo, Vídeo)  │
└─────────────────────────┘      └─────────────────────────┘      └─────────────────────────┘
```

### Tela 1: Autenticação Segura (AuthScreen)
- **Design:** Fundo imersivo com efeito Apple Liquid Glass, logotipo refinado Site Express com insignia vetorial e suporte nativo ao tema Diurno/Noturno.
- **Segmented Control iOS:** Alternador rápido entre *Criador de Sites* e *Super Admin*.
- **Credenciais Rápidas de Teste:** Atalhos de 1 clique para pré-carregar credenciais (Super Admin, Lucas Mendes, Carla Dias) facilitando demonstrações e validações imediatas.

### Tela 2: Dashboard Central & Hub Operacional (DashboardScreen)
- **Top Bar:** Identidade do criador logado, plano contratado, contador de cotas de sites (ex: *8 de 50 sites ativos*), alternador Diurno/Noturno e botão de encerramento de sessão.
- **Segmented Control iOS Nativo:**
  1. **Novo Site:** Hero de boas-vindas objetivo, barra de busca inteligente do Google Places integrada e botão para *Cadastro Manual* (empresas não listadas no Google Maps).
  2. **Gestão de Sites:** Tabela operacional limpa com busca em tempo real, status ativo/inativo, **Killswitch de 1 clique**, contador de dias até o vencimento da anuidade, atalho direto de mensagem no WhatsApp do cliente e botão "Editar Site".
  3. **Painel do Dono (Exclusivo Super Admin):** Listagem de assinantes do SaaS, modal de cadastro de novos assinantes (nome, e-mail, senha, plano, WhatsApp) e controle de ativação/bloqueio de agências.

### Tela 3: Studio Pro de Edição Visual (StudioScreen)
- **Barra Superior Ergonômica:** Botão de retorno imediato ao Dashboard ("← Voltar"), botão de abertura do *Logo & Identidade Studio*, seletor de Viewport (Desktop 1200px, Tablet 768px, Mobile iPhone 390px com frame fiel), e botões de ação ("Ver Site", "Publicar Link", "Exportar ZIP/HTML").
- **Canvas de Pré-visualização Responsivo:** Renderização em tempo real da landing page com todos os blocos ativos.
- **Painéis Laterais Retráteis:** Controle pontual de seções, textos de alta conversão, paleta de cores gerada a partir da logomarca, layout do cabeçalho hero e seção de vídeo institucional.

---

## 4. Especificações do Design System (Apple iOS Tokens)

A interface do Site Express Studio Pro obedece rigorosamente aos tokens de design do iOS:

- **Tipografia:** Família `SF Pro, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.
  - Escala hierárquica clara (Large Title 34px, Title1 28px, Headline 17px semi-bold, Body 17px regular, Footnote 13px).
- **Cores Semânticas:**
  - `systemBlue`: `#007AFF` (Light) / `#0A84FF` (Dark)
  - `systemGreen`: `#34C759` (Light) / `#30D158` (Dark)
  - `systemOrange`: `#FF9500` (Light) / `#FF9F0A` (Dark)
  - `systemRed`: `#FF3B30` (Light) / `#FF453A` (Dark)
  - `systemBackground`: `#FFFFFF` e `#F2F2F7` (Light) / `#000000` e `#1C1C1E` (Dark)
- **Efeitos de Vidro Líquido (Liquid Glass):**
  - `backdrop-filter: blur(20px) saturate(190%)`
  - Bordas translúcidas sutis de 1px (`rgba(255, 255, 255, 0.4)` no modo claro / `rgba(255, 255, 255, 0.1)` no modo escuro).
- **Geometria Squircle:**
  - Raios de curvatura Apple com transições suaves (`12px` para botões e inputs, `20px` para cartões e modais).
- **Alvo Mínimo de Toque (Touch Target):**
  - Mínimo de 44x44pt para qualquer elemento interativo, garantindo navegação sem erros em tablets e celulares.

---

## 5. Módulos Funcionais Detalhados

### 5.1. Importação Inteligente & Cadastro Manual
- **Google Places Autocomplete:** Pesquisa de empresas com retorno instantâneo de Nome, Categoria, Endereço, Cidade, Telefone, Nota Google Maps, Total de Avaliações e Horário de Funcionamento.
- **Cadastro Manual:** Modal projetado para empresas recém-abertas ou sem ficha no Google Maps, com formulário passo a passo (Dados Principais, Contato & WhatsApp, Diferenciais de Mercado, Horários).
- **Seed Inteligente de Dados:** Categorias pré-mapeadas geram automaticamente serviços pertinentes, depoimentos fictícios de validação e CTAs direcionados.

### 5.2. Módulo de Gestão de Clientes & Killswitch
- **Killswitch Operacional de 1 Clique:**
  - Permite desativar instantaneamente um site se o cliente atrasar a mensalidade ou anuidade.
  - Quando desativado (`isActive: false`), o acesso público à URL do site exibe uma tela amigável de "Serviço Temporariamente Indisponível" com canal para regularização.
- **Comunicação por WhatsApp:** Botão com deep-link para abrir o WhatsApp Web/App diretamente no número do dono do negócio com texto de prospecção ou lembrete de renovação pré-formatado.
- **Indicador de Vencimento:** Badge dinâmico informando se o plano do cliente está regular, vencendo nos próximos 15 dias ou expirado.

### 5.3. Logo Studio & Harmonização de Cores
- **Upload de Logomarca Própria:** Suporte a arquivos PNG, JPEG, SVG e WebP.
- **Tratamento de Fundo:** Opções integradas de transparência e remoção de fundo escuro/claro para encaixe harmonioso na barra de navegação da landing page.
- **Gerador de 3 Variações de Logo (Caso a Empresa Não Tenha):**
  1. *Versão Minimalista Monograma:* Emblema geométrico com as iniciais da empresa e badge elegante.
  2. *Versão Tipográfica Moderna:* Logotipo estilizado com tipografia refinada e subtítulo da categoria.
  3. *Versão Ícone & Marca:* Emblema circular com cor temática e slogan comercial.
- **Extração & Harmonização de Cores:** Botão para aplicar automaticamente as cores da logomarca como paleta primária do site (Hero, Botões de Ação, Destaques e Rodapé).
- **Favicon Dinâmico:** Geração de favicon vetorial SVG para inserção no cabeçalho HTML da página.

### 5.4. Seção de Vídeo Institucional (Apple Media Player)
- **Campos de Configuração:**
  - Chave de ativação opcional (o criador escolhe se o site terá vídeo ou não).
  - Título e subtítulo da seção de apresentação.
  - Suporte duplo: Arquivo MP4 direto (hospedado ou CDN) ou Link de incorporação do YouTube.
  - Imagem de capa (Poster/Thumbnail).
  - Badge temático no estilo Apple ("Tour Virtual", "Vídeo Institucional", "Apresentação da Clínica").
- **Player com Estética Apple:** Borda arredondada squircle, botão central de Play com animação de pulso suave e moldura de vidro líquido.

---

## 6. Viabilidade Técnica: Geração de Vídeo por IA vs. Abordagem Recomendada

Durante a definição de requisitos, avaliou-se a viabilidade de **geração de vídeos promocionais automáticos por IA**:

| Aspecto | Geração de Vídeo por IA (Veo / Gemini Omni Flash) | Abordagem Recomendada (Apple Player + MP4/YouTube) |
| :--- | :--- | :--- |
| **Custo de Infraestrutura** | **Alto e Cobrado por Minuto:** APIs de vídeo generativo (como Google Veo / Imagen Video) não possuem cota gratuita no AI Studio e demandam créditos pagos por renderização. | **Zero Custo Adicional:** Utilização de vídeos institucionais gravados pelo próprio cliente ou hospedados gratuitamente no YouTube/Vimeo/Cloudflare Stream. |
| **Tempo de Resposta** | 45 a 180 segundos por vídeo de 5 segundos. | Instantâneo (renderização nativa no navegador). |
| **Fidelidade Real do Negócio** | Baixa: IAs generativas criam vídeos fictícios com pessoas e ambientes sintéticos que não representam o consultório ou loja real do cliente. | 100% Real: Mostra a equipe real, a fachada real e os produtos autênticos da empresa local. |
| **Conclusão Técnica** | **Inviável para plano gratuito.** | **Solução ideal e de padrão internacional adotada no sistema.** |

---

## 7. Arquitetura de Publicação e Distribuição dos Sites

O Site Express Studio Pro oferece **três caminhos complementares de publicação**:

### 1. Publicação Interna Instantânea por Slug (Sem Custos Adicionais)
- Cada site gerado recebe um identificador único seguro (slug), ex: `clinica-sorriso-ouro-preto`.
- O site é servido diretamente pelo próprio app via parâmetro de rota:  
  `https://seu-dominio.com/?site=clinica-sorriso-ouro-preto`
- O layout carrega em modo tela cheia, com todas as tags de SEO, favicon e metatags ativas, sem nenhuma barra da ferramenta.

### 2. Exportação Standalone (HTML + CSS Único, Zero Dependências)
- Botão "Exportar HTML": Gera um arquivo `index.html` autônomo e compilado.
- Contém todo o CSS Tailwind embutido, imagens otimizadas, SVG da logo e lógica de envio do formulário para o WhatsApp.
- **Compatibilidade:** Pode ser arrastado e solto diretamente na **Vercel**, **Netlify**, **HostGator**, **cPanel** ou qualquer hospedagem tradicional sem necessidade de rodar Node.js ou banco de dados.

### 3. Pacote ZIP para Desenvolvedores
- Permite o download do código-fonte completo da landing page pronto para deploys customizados com Git.

---

## 8. Stack Tecnológica e Arquitetura de Código

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons.
- **Backend:** Node.js com Express e proxy seguro para requisições de IA e dados externos.
- **Inteligência Artificial:** Google GenAI SDK (`@google/genai`) utilizando o modelo `gemini-2.5-flash` para geração de copies de vendas, reescrita de chamadas e enriquecimento de diferenciais.
- **Persistência de Dados:** Estrutura escalável em `localStorage` para navegação offline/demonstrações com compatibilidade total para conexão com Firebase Firestore / Cloud SQL quando provisionado em produção.

---

## 9. Métricas de Sucesso e KPIs

1. **Tempo de Criação:** Redução do tempo de entrega de uma landing page profissional para menos de 3 minutos.
2. **Taxa de Conversão Mobile:** Manutenção de 100% de responsividade na visualização do iPhone (390px) com o botão fixo do WhatsApp gerando leads imediatos.
3. **Usabilidade B2B:** Zero confusão entre o papel do dono da plataforma (gestão de assinantes) e o criador de sites (criação e entrega para seus clientes).
