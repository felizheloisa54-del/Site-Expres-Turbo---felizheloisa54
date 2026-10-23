# PRP — Plano de Requisitos do Projeto
## Plataforma: Site Express Studio Pro
**Documento:** Product Requirements Proposal & Project Specification  
**Versão:** 1.0.0 — Final  
**Classificação:** Estratégia de Produto, Arquitetura & Engenharia B2B  
**Idioma:** Português (Brasil)  

---

## 1. Visão Executiva & Modelo de Negócio

### 1.1. O que é o Site Express Studio Pro
O **Site Express Studio Pro** é uma plataforma SaaS (Software as a Service) voltada para o mercado de **criadores de sites profissionais, freelancers e agências digitais**. O sistema resolve o gargalo mais crítico dessas agências: o tempo e custo elevados para construir páginas de vendas para comércios locais (clínicas médicas, odontologia, gastronomia/pizzarias, estética, oficinas e serviços especializados).

Com o Site Express, o criador gera uma **landing page pronta para conversão em menos de 3 minutos**, integrando dados do Google Maps ou cadastro manual, ajustando identidade visual no padrão Apple iOS e entregando um site rápido com botão de WhatsApp direto para o cliente final.

### 1.2. Modelo de Monetização (Como o Dono Lucra)
O proprietário da ferramenta vende o acesso à ferramenta sob modelo de **assinatura recorrente mensal ou anual**:
- **Plano Freelancer Iniciante:** R$ 97/mês (Até 10 sites ativos simultâneos).
- **Plano Criador Pro:** R$ 197/mês (Até 30 sites ativos simultâneos).
- **Plano Agência Scale:** R$ 297 a R$ 497/mês (Sites ilimitados + suporte prioritário).

O criador de sites, por sua vez, cobra de R$ 500 a R$ 1.500 de criação por cliente local, mais uma mensalidade de R$ 90 a R$ 150 de manutenção e hospedagem, tornando o ROI da assinatura imediato para a agência.

---

## 2. Matriz de Perfis e Permissões (RBAC)

O sistema possui uma segregação rigorosa de responsabilidades para evitar que o cliente final acesse configurações indevidas:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          SUPER ADMIN (DONO)                           │
│  • Gerencia quem pode usar a ferramenta (Gera Logins e Senhas)         │
│  • Define cotas de sites (Ex: 20 sites para o Lucas, 50 para a Carla)  │
│  • Bloqueia agências inadimplentes na ferramenta                       │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     CRIADOR DE SITES (ASSINANTE)                       │
│  • Cria sites para comércios locais (Google Maps ou Manual)            │
│  • Acessa a Gestão dos seus próprios clientes                          │
│  • Ativa / Desativa o site do cliente (Killswitch de pagamento)        │
│  • Abre o WhatsApp do cliente para avisar vencimento                   │
│  • Edita cores, fotos, logos, seções e vídeo no Studio Pro             │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 CLIENTE LOCAL (DONO DA PIZZARIA/CLÍNICA)               │
│  • NÃO TEM LOGIN NEM ACESSO AO SISTEMA                                 │
│  • Recebe apenas a URL da página no ar (Ex: ?site=dr-samuel)           │
│  • Recebe contatos e pedidos de clientes direto no WhatsApp dele       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Jornada do Usuário em 3 Telas

Para garantir foco extremo e eliminar a poluição visual, o fluxo da plataforma é estritamente dividido em **3 etapas lineares**:

### Tela 1: Portal de Autenticação (AuthScreen)
- **Objetivo:** Ponto de entrada exclusivo para quem opera o sistema.
- **Estrutura:**
  - Logotipo oficial Site Express Studio Pro com badge de status.
  - Alternador de perfil nativo iOS (Criador vs. Super Admin).
  - Campos de E-mail e Senha protegidos.
  - Botão de alternância de tema Diurno (Claro) e Noturno (Escuro).
  - Atalhos rápidos de demonstração (Super Admin, Lucas Mendes, Carla Dias).

### Tela 2: Dashboard Central & Hub de Operações (DashboardScreen)
- **Objetivo:** Gestão dos clientes e criação rápida sem distrações.
- **Top Bar:** Identificação do usuário logado, badge de plano, medidor de cotas de sites, botão de tema e botão de logout.
- **Segmented Control iOS (Abas):**
  1. **Aba "Novo Site & Início":** Hero moderno e clean com barra de busca do Google Maps e botão destacado para **Cadastro Manual** de empresas que ainda não estão no mapa.
  2. **Aba "Gestão de Sites":** Tabela operacional para o criador acompanhar seus sites ativos. Exibe o nome do cliente, nicho, cidade, data de expiração, status (Ativo/Inativo), botão direto de **WhatsApp** para cobrar ou avisar renovação, botão **Killswitch** (desativa o site com 1 clique) e botão **Editar Site**.
  3. **Aba "Painel do Dono" (Visível apenas para Super Admin):** Listagem de assinantes do SaaS, modal para cadastrar novo assinante com senha, cota de sites e botão para bloquear assinante caso atrase a mensalidade do software.

### Tela 3: Studio Pro de Edição Visual (StudioScreen)
- **Objetivo:** Refinamento estético e entrega final da landing page.
- **Top Bar:** Botão "← Voltar ao Dashboard", botão "Logo & Cores", alternador de visualização responsiva (Desktop 1200px, Tablet 768px, iPhone Mobile 390px fiel), botão de modo Noturno/Diurno e botões de exportação ("Ver Site", "Publicar Link", "Exportar HTML/ZIP").
- **Canvas Central:** Pré-visualização instantânea da página renderizada em tempo real com todas as alterações aplicadas.
- **Sidebar de Controles:** Ajuste cirúrgico de textos de conversão, layout do Hero (Central, Divisão 2 colunas, Fundo Imersivo), diferenciais, galeria, depoimentos, formulário e seção de vídeo.

---

## 4. Design System Apple iOS (Tokens & Diretrizes Visuais)

A interface do aplicativo não tem "cara de IA" e foi construída com base nos tokens oficiais do ecossistema Apple iOS:

```
TOKENS DE DESIGN IMPLEMENTADOS:
├── Tipografia: SF Pro, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
│   ├── Large Title: 34px (Negrito)
│   ├── Title 1: 28px (Negrito)
│   ├── Headline: 17px (Semi-bold, peso 600)
│   ├── Body: 17px (Regular, legibilidade perfeita)
│   └── Footnote / Caption: 12-13px
├── Cores Semânticas do Sistema:
│   ├── systemBlue: #007AFF (Ações primárias, links, botões principais)
│   ├── systemGreen: #34C759 (Status ativo, confirmações, WhatsApp)
│   ├── systemOrange: #FF9500 (Alertas de vencimento próximo, atenção)
│   ├── systemRed: #FF3B30 (Killswitch, exclusão, bloqueios)
│   ├── Background Claro: #FFFFFF (Primário), #F2F2F7 (Secundário iOS)
│   └── Background Escuro: #000000 (Primário OLED), #1C1C1E (Cards Noturnos)
├── Efeitos e Superfícies:
│   ├── Liquid Glass: backdrop-filter: blur(20px) saturate(190%)
│   ├── Bordas: Bordas translúcidas de 1px com rgba(255,255,255,0.1 a 0.4)
│   └── Squircles: border-radius de 12px (botões) e 20px (cards/modais)
└── Ergonomia:
    └── Touch Target Mínimo: 44 x 44 pt para qualquer botão ou clique
```

---

## 5. Especificações Funcionais Detalhadas

### 5.1. Módulo de Importação Inteligente (Google Places)
- Campo com preenchimento em tempo real ao digitar o nome ou nicho da empresa.
- Puxa automaticamente: Razão/Nome Fantasia, Categoria comercial, Endereço completo, Telefone/WhatsApp, Avaliação no Google (estrelas) e Total de avaliações reais.
- Popula o layout instantaneamente sem necessidade de digitação.

### 5.2. Módulo de Cadastro Manual Completo
- Modal limpo para cadastrar empresas que não possuem perfil no Google Maps ou que estão iniciando agora.
- Divide o cadastro em 4 blocos simples:
  1. Identificação básica (Nome, Nicho/Categoria e Cidade).
  2. Contato comercial (WhatsApp com DDD, Telefone fixo, E-mail).
  3. Diferenciais (Até 4 pontos fortes que a empresa tem).
  4. Horários de funcionamento e endereço físico.

### 5.3. Módulo Logo Studio & Harmonização de Paleta
- **Upload de Logo:** Aceita PNG, JPG, WebP e SVG com arrastar e soltar.
- **Tratamento de Fundo:** Aplica filtros para remoção de fundo e harmonização visual para que a logo não fique com caixa branca recortada na navbar.
- **Gerador de 3 Versões de Logo (Para empresas sem logo):**
  1. *Versão Monograma Minimalista:* Iniciais com formato geométrico e badge premium.
  2. *Versão Tipográfica Moderna:* Tipografia equilibrada com a categoria em caixa alta.
  3. *Versão Emblema & Marca:* Símbolo circular elegante com cor primária.
- **Sincronizador de Cores:** Botão que extrai os tons da logo e redefine automaticamente os botões, títulos e contrastes da landing page.
- **Favicon Dinâmico:** Gera o ícone da aba do navegador em formato SVG para conferir acabamento profissional.

### 5.4. Módulo de Vídeo Institucional (Player Apple)
- Opção ativável/desativável no painel lateral do Studio.
- Suporta tanto vídeo direto em formato `.mp4` quanto links de incorporação do YouTube.
- Renderiza em um container com proporção cinematográfica 16:9, cantos arredondados squircle e botão central de Play com efeito Liquid Glass e pulso sutil.
- Permite adicionar imagem de poster (capa) e badge temático ("Conheça Nossa Estrutura", "Tour Virtual", "Vídeo Institucional").

### 5.5. Módulo de Gestão de Clientes & Killswitch
- O criador acompanha a data de vencimento de cada cliente criado.
- **Botão WhatsApp:** Abre a conversa com o cliente no WhatsApp com mensagem profissional pronta sobre a renovação ou ajustes no site.
- **Killswitch de Inadimplência:** Se o cliente não pagar a anuidade/mensalidade para o criador de sites, o criador clica no switch vermelho. O site sai do ar instantaneamente e exibe uma tela elegante informando que o serviço está suspenso temporariamente. Ao receber o pagamento, reativa com 1 clique.

---

## 6. Arquitetura de Publicação e Entrega dos Sites

Para atender tanto criadores leigos quanto agências técnicas, o PRP define 3 formas de publicação:

| Formato | Como Funciona | Para quem é indicado |
| :--- | :--- | :--- |
| **1. Publicação Direta por Slug** | O app hospeda a página via URL limpa: `https://meuapp.com/?site=nome-do-cliente` | Ideal para entregas imediatas, sem configurar domínios complexos ou servidores. |
| **2. Exportação HTML Standalone** | Botão gera um arquivo `index.html` único com todo CSS, scripts, imagens e integração de WhatsApp embutidos. | Perfeito para subir na **Vercel** (grátis), Netlify, ou na hospedagem HostGator/cPanel do cliente. |
| **3. Pacote ZIP Completo** | Baixa o código-fonte compilado e organizado com todos os ativos. | Para agências que desejam versionar no GitHub ou criar pipelines CI/CD. |

---

## 7. Análise de Viabilidade Técnica: Vídeo por IA vs. Vídeo Real

| Critério | Vídeo Gerado por IA (Veo / Imagen Video) | Vídeo Real Institucional (MP4 / YouTube) |
| :--- | :--- | :--- |
| **Custo de API** | **Elevado:** Cobrado por segundo de renderização; não há cota gratuita. | **Zero:** Sem custo adicional de API para você ou para a agência. |
| **Tempo de Espera** | 1 a 3 minutos para gerar um clipe de 5 segundos. | Imediato (carregamento instantâneo via streaming). |
| **Verossimilhança** | Mostra consultórios ou restaurantes fictícios gerados por IA, o que gera desconfiança no cliente local. | Mostra o espaço físico real, a equipe real e os produtos verdadeiros do cliente. |
| **Decisão de Projeto** | Descartado no plano gratuito por inviabilidade técnica e financeira. | **Implementado com sucesso com Player Apple.** |

---

## 8. Stack Tecnológica de Produção

- **Core Frontend:** React 19 com TypeScript em arquitetura baseada em componentes funcionais.
- **Estilização:** Tailwind CSS v4 com customização de tokens semânticos Apple iOS.
- **Backend de Apoio:** Node.js com Express para proxy seguro e rotas de utilidade.
- **Motor de Inteligência Artificial:** Google GenAI SDK (`@google/genai`) utilizando o modelo `gemini-2.5-flash` para geração e aprimoramento de textos de conversão.
- **Ícones:** Lucide React adaptados com curvaturas e pesos consistentes.
- **Manipulação de Arquivos & Exportação:** JSZip e gerador nativo de bundles HTML.

---

## 9. Próximos Passos e Recomendações de Go-To-Market

1. **Apresentação Comercial:** Utilize as credenciais rápidas na Tela 1 para demonstrar a plataforma para agências parceiras.
2. **Definição dos Preços:** Sugere-se iniciar com uma oferta de lançamento de R$ 97/mês para os primeiros 20 criadores cadastrados.
3. **Escalar no Google:** Utilizar a busca rápida do Google Places como principal chamariz nas demonstrações de vendas.
