/**
 * Mega-Prompt Content & Download Utilities
 * Enables 1-click download of the complete system reproduction prompt in Markdown and HTML.
 */

export const MEGA_PROMPT_TEXT = `Você é um Arquiteto de Software Full-Stack Sênior e Lead Product Designer especializado no Apple iOS Human Interface Guidelines e em plataformas SaaS de alta escala. Sua missão é construir do zero a aplicação completa "Site Express Studio Pro", um SaaS B2B "white-label" de altíssima conversão projetado para criadores de sites profissionais, freelancers e agências digitais que atendem empresas locais brasileiras (clínicas, médicos, odontologia, gastronomia/pizzarias, varejo e serviços).

Leia todas as instruções abaixo e gere o código completo, funcional e sem atalhos ou placeholders incompletos.

---

### 1. MODELO DE NEGÓCIO E PERFIS DE USUÁRIO (RBAC)

O software possui uma estrutura de monetização B2B muito clara:
1. Dono da Plataforma (Super Admin):
   - É o proprietário do SaaS que vende as assinaturas mensais (R$ 97 a R$ 297/mês) para os criadores de sites.
   - Possui uma aba exclusiva chamada "Painel do Dono" onde cadastra novos criadores (nome, e-mail, senha, plano, cota de sites), controla ativação/bloqueio por inadimplência e visualiza métricas da base.
2. Criador de Sites (Assinante / Agência):
   - É o assinante da ferramenta. Ele entra com seu login e senha na ferramenta.
   - Cria landing pages para seus clientes locais em menos de 3 minutos via busca do Google Maps ou cadastro manual.
   - Controla a lista dos seus clientes na aba "Gestão de Sites", podendo ativar ou desativar o site do cliente com 1 clique (Killswitch de cobrança), ver dias restantes até o vencimento da anuidade e clicar no botão de WhatsApp para falar direto com o dono do negócio.
3. Cliente Local (Dono da Pizzaria, Médico, etc.):
   - NÃO POSSUI LOGIN NEM SENHA. Ele NUNCA mexe no código nem no editor.
   - Ele apenas recebe a URL do site no ar (ex: https://meuapp.com/?site=clinica-sorriso) e recebe os leads diretamente no WhatsApp dele.

---

### 2. ARQUITETURA DA EXPERIÊNCIA EM 3 TELAS (SEM POLUIÇÃO)

O aplicativo NUNCA deve misturar tudo em uma única página. A experiência divide-se em 3 telas bem demarcadas:

#### TELA 1: AUTENTICAÇÃO LIMPA (AuthScreen)
- Visual sofisticado com efeito Apple Liquid Glass (backdrop-filter: blur(20px) saturate(190%)).
- Logotipo oficial vetorial do Site Express.
- Segmented control no estilo iOS para alternar entre "Criador de Sites" e "Super Admin".
- Botão no topo para alternar entre Modo Diurno (Claro) e Noturno (Escuro).
- Botões de atalho rápido de demonstração (Super Admin, Lucas Mendes, Carla Dias) que preenchem e autenticam com 1 clique.

#### TELA 2: DASHBOARD CENTRAL & HUB OPERACIONAL (DashboardScreen)
- Top bar com logotipo, badge do usuário e plano (ex: "8 de 50 sites criados"), alternador de tema e botão de logout.
- Segmented Control nativo Apple iOS com 3 abas:
  - Aba 1: Novo Site & Início: Hero limpo explicando o funcionamento e dois caminhos de entrada destacados em cartões squircle:
    - Opção A: Buscar Empresa no Google Places: Barra de busca com preenchimento automático em tempo real, trazendo nome, notas 4/5 estrelas, endereço, telefone e nicho.
    - Opção B: Cadastrar Empresa Manualmente: Modal completo para empresas que ainda não estão no Google Maps (dados básicos, WhatsApp com DDD, diferenciais e horários).
  - Aba 2: Gestão de Sites: Tabela operacional limpa com busca, filtro por nicho, indicador de status (Ativo/Inativo), Killswitch operacional de 1 clique (se o cliente não pagar o criador, o site sai do ar e mostra aviso de suspensão), contador de dias até o vencimento, atalho direto para o WhatsApp do cliente e botão "Editar Site".
  - Aba 3: Painel do Dono (Exclusivo Super Admin): Listagem de assinantes do SaaS com status, controle de cota máxima de sites e modal para criação rápida de novo assinante com senha.

#### TELA 3: STUDIO PRO DE EDIÇÃO VISUAL (StudioScreen)
- Barra superior minimalista:
  - Botão "← Voltar ao Dashboard" com confirmação de salvamento.
  - Botão "Logo & Identidade Visual" (abre modal especializado).
  - Seletor de Viewport: Desktop (1200px), Tablet (768px) e Mobile (iPhone 390px fiel com moldura física).
  - Botão de Modo Noturno/Diurno da ferramenta.
  - Botões de Ação: "Ver Site no Ar", "Copiar Link Público" e "Exportar HTML/ZIP".
- Canvas Central: Renderização interativa do site em tempo real com todos os blocos ativos.
- Painel Lateral de Ferramentas Retrátil com abas:
  - Informações e Textos de Conversão.
  - Layout do Hero (Centralizado, Dividido em 2 Colunas ou Fundo Imersivo).
  - Seções Comerciais (Diferenciais, Galeria, Avaliações Google, Formulário).
  - Seção de Vídeo Institucional Apple: Chave opcional para ativar/desativar vídeo, suporte a arquivo .mp4 leve ou link do YouTube, campo de poster/capa e badge temático ("Tour Virtual", "Vídeo Institucional").

---

### 3. DESIGN SYSTEM OFICIAL (APPLE iOS TOKENS)

Todo o design da ferramenta DEVE obedecer com rigor aos seguintes tokens do Apple iOS:
- Tipografia: SF Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif.
- Cores Semânticas: #007AFF (Azul), #34C759 (Verde), #FF9500 (Laranja), #FF3B30 (Vermelho).
- Superfícies: Liquid Glass (blur 20px, saturação 190%), bordas de 1px translúcidas.
- Geometria: Squircles suaves (12px para botões, 20px para containers e modais).
- Touch Target: Mínimo de 44x44pt para qualquer elemento tátil.

---

### 4. MÓDULO LOGO STUDIO & IDENTIDADE VISUAL
- Modal dedicado acessível no editor.
- Upload de Logo: Suporte a PNG, JPG e SVG.
- Tratamento de Fundo: Aplica filtros e transparência para remover fundos brancos ou escuros indesejados na navbar.
- Gerador de 3 Variações de Logo (caso a empresa não tenha uma):
  1. Versão Monograma Minimalista: Iniciais com formato geométrico e badge premium.
  2. Versão Tipográfica Moderna: Logotipo estilizado com a categoria em caixa alta.
  3. Versão Emblema & Marca: Símbolo circular elegante.
- Sincronização de Cores: Botão de 1 clique que extrai os tons da logo e redefine toda a paleta primária do site.
- Favicon Dinâmico: Gera o ícone SVG correspondente para a aba do navegador.

---

### 5. RESPONSIVIDADE NO STUDIO (MOBILE IPHONE 390px)
- Na prévia mobile do editor, renderize uma moldura física fiel de iPhone (390px x 844px) com cantos arredondados e Dynamic Island.
- A barra de contato fixa do WhatsApp deve ser posicionada como sticky bottom-0 w-full dentro do container interno do celular, com efeito Liquid Glass e botão tátil de WhatsApp que abre o chat real.

---

### 6. FERRAMENTAS, APIS E IAS A UTILIZAR
- Frontend: React 19 + TypeScript + Tailwind CSS v4.
- Ícones: lucide-react.
- Backend: Node.js com Express para proxy e utilitários.
- IA Recomendada: Google GenAI SDK (@google/genai) com gemini-2.5-flash para copywriting comercial e diferenciais.
- Vídeo: Player Apple com HTML5 Video / YouTube Embed (sem APIs generativas caras de vídeo).
- Exportação: JSZip + Standalone HTML (arquivo único para deploy na Vercel).

---

### 7. ARQUITETURA DE PUBLICAÇÃO DOS SITES
1. Publicação Instantânea via Slug: URLs com ?site=slug carregam a landing page em tela cheia com Killswitch ativo.
2. Exportação Standalone: Arquivo index.html único pronto para drag-and-drop na Vercel ou cPanel.`;

export function downloadMegaPromptMarkdown() {
  const blob = new Blob([MEGA_PROMPT_TEXT], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'MEGA_PROMPT_SITE_EXPRESS_REPRODUCAO.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadMegaPromptHtml() {
  const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mega Prompt de Reprodução — Site Express Studio Pro</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      color: #1c1c1e;
      background: #f2f2f7;
      padding: 40px 20px;
      margin: 0;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      padding: 48px;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.06);
    }
    h1 { color: #007aff; font-size: 28px; margin-top: 0; }
    .copy-btn {
      background: #007aff;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin: 16px 0;
      transition: background 0.2s;
    }
    .copy-btn:hover { background: #0062cc; }
    pre {
      background: #1c1c1e;
      color: #30d158;
      padding: 24px;
      border-radius: 14px;
      overflow-x: auto;
      font-size: 13px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      white-space: pre-wrap;
      line-height: 1.5;
    }
    .badge {
      display: inline-block;
      background: rgba(0, 122, 255, 0.1);
      color: #007aff;
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="container">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <span class="badge">Master Prompt Oficial</span>
      <span style="font-size:12px; color:#8e8e93;">Pronto para Copiar & Colar</span>
    </div>
    <h1>🚀 Mega-Prompt de Reprodução Integral</h1>
    <p>Cole este prompt no <strong>Claude 3.7 Sonnet, Cursor, ChatGPT o3-mini/GPT-4o, v0 ou Bolt</strong> para reconstruir 100% da ferramenta <strong>Site Express Studio Pro</strong>.</p>
    
    <button class="copy-btn" onclick="copyPrompt()">
      📋 Copiar Todo o Prompt
    </button>
    <span id="copied-badge" style="display:none; color:#34c759; font-weight:700; margin-left:12px;">Copiado com sucesso!</span>

    <pre id="prompt-content">${MEGA_PROMPT_TEXT.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  </div>

  <script>
    function copyPrompt() {
      const text = document.getElementById('prompt-content').innerText;
      navigator.clipboard.writeText(text).then(() => {
        const badge = document.getElementById('copied-badge');
        badge.style.display = 'inline';
        setTimeout(() => { badge.style.display = 'none'; }, 2500);
      });
    }
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'MEGA_PROMPT_SITE_EXPRESS_REPRODUCAO.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
