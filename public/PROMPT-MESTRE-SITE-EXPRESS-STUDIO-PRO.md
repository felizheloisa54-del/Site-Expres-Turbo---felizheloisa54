# PROMPT MESTRE DE ENGENHARIA & DESIGN DE SOFTWARE
## PROJETO: SITE EXPRESS STUDIO PRO (SAAS B2B "WHITE-LABEL" PARA CRIAÇÃO DE LANDING PAGES LOCAIS)

> **Instrução de Execução para a Inteligência Artificial:**
> Você é um Engenheiro de Software Full-Stack Principal e Lead Product Designer especializado em plataformas SaaS de alta conversão, arquitetura React/TypeScript, back-end Node.js/Express, e padrões visuais do Apple iOS Human Interface Guidelines.
> Sua missão é criar, do zero e de forma 100% funcional, a aplicação completa **"Site Express Studio Pro"**. 
> Não use códigos resumidos, não coloque comentários como `// adicione o restante aqui`, não crie placeholders incompletos e não omita detalhes arquiteturais. Siga todas as especificações e contratos técnicos abaixo.

---

## 1. VISÃO GERAL, PROPOSTA DE VALOR E REGRAS DE NEGÓCIO

### 1.1 O que é o Site Express Studio Pro?
O **Site Express Studio Pro** é uma plataforma SaaS B2B completa desenvolvida para criadores de sites freelancers, agências digitais e gestores de tráfego locais no Brasil. A ferramenta permite importar a ficha oficial de qualquer empresa brasileira cadastrada no **Google Meu Negócio (Google Places API)** ou cadastrá-la manualmente, gerando em menos de 3 minutos uma **Landing Page Institucional de Altíssima Conversão** adaptada a nichos como:
- Clínicas Médicas e Consultórios Odontológicos
- Gastronomia, Bares e Pizzarias
- Escritórios de Advocacia e Contabilidade
- Serviços Automotivos, Estética e Varejo Local

### 1.2 Perfis de Usuário & Controle de Acesso (RBAC)
O sistema possui 3 personas rigorosamente demarcadas:
1. **Dono da Plataforma (Super Admin / Proprietário do SaaS):**
   - Vende as assinaturas do software para os criadores de sites (ex: R$ 97/mês no plano Start, R$ 197/mês no Pro, R$ 297/mês no Agência).
   - Acessa o **Painel do Dono** para criar novos usuários, alterar planos, definir cota máxima de sites (ex: 5, 20 ou 100 sites) e bloquear/desbloquear assinantes por inadimplência.
2. **Criador de Sites (Assinante / Agência / Freelancer):**
   - Assinante que utiliza a ferramenta para construir e gerir os sites dos seus clientes locais.
   - Tem acesso à **Tela 2 (+ Novo Site & Buscador)** e à **Tela 3 (Studio Pro)**.
   - Gerencia a carteira de clientes, visualiza status financeiro (dias até a anuidade vencer), entra em contato direto com o cliente via WhatsApp com 1 clique e aciona o **Killswitch Anti-Inadimplência**.
3. **Cliente Final (Dono da Empresa Local - ex: Dr. Roberto / Pizzaria Bella):**
   - **NÃO POSSUI LOGIN NEM ACESSO AO SISTEMA.**
   - Recebe apenas a URL oficial publicada (ex: `https://app.com/?site=clinica-sorriso`) ou o pacote HTML exportado.
   - Todos os botões do site gerado apontam para o WhatsApp oficial dele com mensagem personalizada pré-preenchida.

---

## 2. ARQUITETURA DE NAVEGAÇÃO EM 3 TELAS DEDICADAS

A experiência do usuário é estruturada em 3 telas bem separadas, impedindo a sobrecarga cognitiva. No topo de todas as telas, existe um **Seletor Global de 3 Telas** (`🌟 1. Vendas & Login | 🏢 2. + Novo Site & Buscador | ⚡ 3. Studio Pro`) que permite navegar instantaneamente entre elas:

### TELA 1: PÁGINA DE VENDAS DE ALTA CONVERSÃO & PORTAL DE ACESSO (AuthScreen)
- **Objetivo:** Converter novos visitantes em assinantes e autenticar criadores e o dono da plataforma.
- **Estrutura Visual:**
  - **Coluna Esquerda (Copy Persuasiva e Gatilhos Mentais):**
    - Tagline em badge: `"SaaS Exclusivo para Criadores de Sites & Agências"`.
    - Título de impacto: `"Crie Sites Profissionais para Empresas Locais em 10 Minutos com Apenas Alguns Cliques"`.
    - Gatilhos mentais:
      - *Velocidade Extrema:* De 2 semanas de desenvolvimento para 3 minutos com importação do Google Maps.
      - *Lucro Alto & Recorrência:* Cobre R$ 800 a R$ 2.500 na criação + anuidade de hospedagem de R$ 300 a R$ 600/ano por cliente.
      - *Proteção Financeira:* Killswitch integrado que suspende o site caso o cliente local não pague.
    - **Carrossel Interativo de Modelos Reais Gerados:**
      - Demonstrações navegáveis de nichos (ex: Odontologia com 4.9★, Pizzaria Artesanal, Clínica Dermatológica, Estética Avançada).
    - **Calculadora Interativa de Faturamento da Agência:**
      - Slider de 1 a 50 clientes mostrando o faturamento mensal e anual estimado.
  - **Coluna Direita (Card de Login & Teste Rápido com Liquid Glass):**
    - Seletor de Perfil estilo iOS: `"Criador de Sites"` vs `"Super Admin (Dono)"`.
    - Campos de E-mail e Senha com validação.
    - Botões de **Atalho Rápido (1-Click Demo Login)** para testes imediatos sem digitar senha:
      - `[Testar como Super Admin (Dono)]`
      - `[Testar como Lucas Mendes (Agência Pro)]`
      - `[Testar como Carla Dias (Freelancer Start)]`
    - Alternador de Tema Diurno / Noturno no cabeçalho.

### TELA 2: NOVO SITE, BUSCADOR GOOGLE & PAINEL OPERACIONAL (DashboardScreen)
- **Top Bar:** Logo oficial, contador de sites do plano (ex: `8 de 25 sites`), Seletor Global de 3 Telas, Badge do Usuário logado, Botão de Chave do Google Places API e Logout.
- **Segmented Control estilo iOS com 3 abas:**
  1. **Aba "+ Novo Site":**
     - Card de Destaque com o **Buscador Google Meu Negócio**: campo com autocomplete que consulta em tempo real a Google Places API (ou o catálogo local inteligente se não houver chave configurada).
     - Card Secundário: **Cadastrar Empresa Manualmente** para comércios que ainda não possuem ficha no Google Maps.
  2. **Aba "Meus Clientes ({quantidade})":**
     - Barra de pesquisa rápida por nome, cidade ou categoria.
     - Tabela / Cards de sites com:
       - Logotipo da empresa, nome comercial, nicho e cidade.
       - Badge de status: `[🟢 No Ar]` ou `[🔴 Suspenso]`.
       - **Botão Killswitch de 1 clique:** Ao clicar, alterna entre Ativo e Suspenso instantaneamente.
       - Contador de dias até o vencimento da anuidade (com alertas para < 30 dias).
       - Botão verde para abrir o WhatsApp do dono da empresa com cobrança ou suporte.
       - Botão `[Editar no Studio]` e botão de menu (Duplicar, Baixar HTML, Excluir).
  3. **Aba "Painel do Dono" (Visível apenas para role = 'admin'):**
     - Gestão completa de assinantes do SaaS:
       - Tabela com Nome, E-mail, Plano, Cota Máxima de Sites, Telefone e Status.
       - Ações: Bloquear/Desbloquear assinante, editar cota de sites, redefinir senha.
       - Modal de criação de novo assinante com envio de dados.

### TELA 3: STUDIO PRO DE CRIAÇÃO E CUSTOMIZAÇÃO (StudioScreen)
- **Cabeçalho em Dois Níveis (Two-Tier Header):**
  - **Nível 1 (Barra Superior Preta Fixa):**
    - Identidade: `⚡ Site Express STUDIO PRO`.
    - Indicador visual: `• Base demo ativa`.
    - Seletor Global de Telas (`1. Vendas/Login | 2. + Novo Site | 3. Studio Pro`).
    - Botão `+ Novo Site` e atalho `Meus Clientes ({qtd})`.
    - Alternador de Tema Claro/Escuro da ferramenta.
  - **Nível 2 (Barra de Ferramentas do Editor):**
    - Botão de retorno `← Meus Clientes`.
    - Nome da empresa em edição acompanhado do badge `[🟢 Ativo no ar]`.
    - **Seletor de Viewport:** `[ Computador (1200px) | Tablet (768px) | Celular (iPhone 390px) ]`.
    - **Dropdown de Paleta de Cores:** `Autoridade Marinho ⌵`, `Esmeralda & Ouro ⌵`, etc.
    - **Dropdown de Tipografia:** `Plus Jakarta Sans ⌵`, `Cormorant Clássico ⌵`, `Inter ⌵`, `Outfit ⌵`, `Playfair ⌵`, `Montserrat ⌵`.
    - Indicador de status: `[✔ Salvo]`.
    - Botão `[↗ Abrir]` (abre o site em nova aba).
    - Botão de Destaque Preto: `[↓ Baixar Site Pronto]` com dropdown para Baixar HTML, Baixar ZIP ou Ver Guia Vercel.
- **Painel Lateral Esquerdo Retrátil (Sidebar):**
  - **Aba Seções (Reordenação & Visibilidade):**
    - Texto orientador no topo: *"Ative, desative e reordene as seções do site. O cabeçalho, rodapé e a barra de WhatsApp são permanentes."*
    - Lista com as **9 Seções Modulares**, cada uma com botões `↑` e `↓` para mover a ordem e interruptor toggle estilo iOS (liga/desliga):
      1. `Hero Editorial / Fotográfico` (com seletor de layout: Caixa 7/5, Fundo Total, Centralizado, Foto Esquerda)
      2. `Bento de Especialidades`
      3. `Como Funciona (3 etapas)`
      4. `Promoção com Cronômetro` (com sub-editor colapsável de tempo e texto)
      5. `Autoridade & Números` (anos de experiência, clientes atendidos, etc.)
      6. `Vídeo Institucional` (com sub-editor colapsável para URL do YouTube/Vimeo/MP4 e badge)
      7. `Avaliações do Google` (com filtro inteligente de 4 e 5 estrelas)
      8. `Localização & Rotas` (endereço, horário e botão traçar rota)
      9. `Dúvidas Frequentes` (perguntas e respostas em sanfona)
  - **Aba Conteúdo & Textos:** Edição de Título, Subtítulo, Mini-Bio, Telefone e Mensagem do WhatsApp.
  - **Aba Produtos / Serviços:** Edição de itens do catálogo **SEM PREÇOS FORÇADOS**, exibindo status de *"● Pronta-Entrega & Atendimento"* e botão de chamada para WhatsApp.
- **Canvas Central:**
  - Renderiza o site com as fontes e cores aplicadas.
  - No modo **Celular**, exibe uma moldura física fiel de iPhone com tela de 390px, Dynamic Island, cantos curvos e a **Barra Flutuante do WhatsApp fixada no rodapé da tela do celular**.

---

## 3. DESIGN SYSTEM & ESTÉTICA VISUAL (PADRÃO APPLE & TAILWIND CSS)

### 3.1 Tokens de Design
- **Tipografia:** Preload do Google Fonts com as 6 famílias recomendadas:
  - Sans-Serif Moderna: `Plus Jakarta Sans`, `Inter`, `Outfit`
  - Serif Editorial / Sofisticada: `Cormorant Garamond`, `Playfair Display`
  - Comercial de Alto Impacto: `Montserrat`
- **Paletas Pré-configuradas:**
  1. *Autoridade Marinho:* Primária `#0F172A`, Destaque `#2563EB`, Fundo `#F8FAFC`.
  2. *Esmeralda & Dourado (Saúde/Clínicas):* Primária `#064E3B`, Destaque `#D97706`, Fundo `#F8FAFC`.
  3. *Âmbar & Terracota (Gastronomia):* Primária `#7C2D12`, Destaque `#EA580C`, Fundo `#FFFBEB`.
  4. *Grafite Minimalista:* Primária `#18181B`, Destaque `#09090B`, Fundo `#FFFFFF`.
  5. *Luxo Champagne:* Primária `#1E1B18`, Destaque `#B45309`, Fundo `#FAF8F5`.
- **Efeito Apple Liquid Glass:**
  - `backdrop-blur-md bg-white/80 border border-white/20 shadow-xs dark:bg-slate-900/80 dark:border-white/10`.
- **Botões e Squircles:**
  - `rounded-2xl` e `rounded-3xl` para cartões, `rounded-xl` para botões e inputs. Touch-target mínimo de 44px de altura.

---

## 4. GERADOR AUTOMÁTICO DE LOGOMARCAS SVG (3 ESTILOS)

Quando uma empresa é importada do Google Places e **não possui foto de perfil/logo cadastrada**, o sistema gera instantaneamente no modal de verificação **3 logotipos vetoriais SVG profissionais**:
1. **Monograma Geométrico:** Iniciais estilizadas com gradiente refinado em moldura geométrica moderna.
2. **Selo de Excelência Dourado:** Brasão circular com estrelas de excelência, louros estilizados e o nome da empresa.
3. **Brasão Minimalista:** Silhueta de escudo refinada com ícone da categoria e tipografia limpa.

O usuário pode alternar e selecionar qualquer um dos 3 estilos com 1 clique antes de confirmar a importação, e o logo é injetado diretamente no cabeçalho do site gerado.

---

## 5. INTEGRAÇÕES DE API & BACK-END EM NODE.JS / EXPRESS (`server.ts`)

### 5.1 Google Cloud Places API (Arquitetura Dual com Auto-Fallback)
O back-end implementa uma rota de busca inteligente (`POST /api/places/search`) e importação (`POST /api/places/import`):
1. **Tenta Primeiro a Places API (New):**
   - Endpoint: `https://places.googleapis.com/v1/places:searchText`
   - Headers: `X-Goog-Api-Key: {apiKey}`, `X-Goog-FieldMask: places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.types,places.regularOpeningHours,places.photos`
2. **Fallback Automático para a Places API Clássica (Legacy):**
   - Caso a chave do cliente não tenha acesso à API nova, o back-end imediatamente recorre à: `https://maps.googleapis.com/maps/api/place/textsearch/json?query={query}&language=pt-BR&key={apiKey}`
3. **Validador e Diagnóstico em Tempo Real (`POST /api/places/test-key`):**
   - Testa a chave contra ambas as APIs e retorna diagnóstico legível para o usuário caso haja erro:
     - `Chave não autorizada`: Oriente a ativar a Places API no Google Cloud Console.
     - `Restrição de Referrer HTTP`: Explica que chaves restritas por domínio de navegador não funcionam em chamadas de servidor (necessário configurar sem restrição ou por IP).
     - `Billing obrigatório`: Avisa sobre a necessidade de vincular cartão no console Google Cloud para ativar o plano gratuito mensal de US$ 200.

### 5.2 Inteligência Artificial Gemini (`@google/genai`)
- Utiliza a biblioteca oficial `@google/genai` com o modelo `gemini-2.5-flash` para:
  - Melhorar a mini-bio e apresentação institucional da empresa.
  - Gerar títulos persuasivos orientados a SEO Semântico local (ex: *"A melhor clínica odontológica em Pinheiros, São Paulo"*).
  - Sugerir perguntas frequentes (FAQ) contextualizadas ao nicho do cliente.

---

## 6. SISTEMA DE PUBLICAÇÃO, VERCEL E EXPORTAÇÃO

### 6.1 Como Funciona a Publicação na Vercel (Gratuita em 1 Minuto)
O usuário tem duas formas de colocar o site no ar:
1. **Opção A: Exportação em HTML Único (Standalone Zero-Dependency):**
   - O utilitário `exportHtml.ts` empacota todo o site em um único arquivo `index.html`.
   - Inclui o script oficial do Tailwind CSS via CDN, estilos inline, ícones SVG puros (convertendo Lucide para inline sem bibliotecas pesadas), fontes do Google e scripts de interação (como sanfona de FAQ e clique no WhatsApp).
   - Para publicar na Vercel: basta criar uma conta gratuita na Vercel, acessar o Dashboard, arrastar a pasta contendo o `index.html` e o site fica ativo com HTTPS e domínio personalizado em segundos.
2. **Opção B: Pacote ZIP Completo:**
   - Utiliza a biblioteca `jszip` para gerar `site-express-{slug}.zip` contendo `index.html`, `README.md` explicativo e dados brutos da empresa.

### 6.2 Link Oficial Hospedado com Killswitch Anti-Inadimplência
- A aplicação possui roteamento por query parameter (`/?site=slug`) e path (`/site/slug`).
- Ao abrir esse link, a landing page é servida diretamente em tela cheia com visual oficial.
- **Funcionamento do Killswitch:**
  - Se na tabela de clientes o criador marcar o site como `suspended`, a URL pública bloqueia o conteúdo e exibe a tela de aviso elegante:
    - *"Site Temporariamente Suspenso - Este site está temporariamente indisponível. Se você é o proprietário desta empresa, entre em contato com a sua agência ou desenvolvedor responsável para regularização."*
  - O criador pode reativar o site a qualquer momento com 1 clique no Dashboard.
