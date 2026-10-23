/**
 * PRD & PRP Document Utilities
 * Exports Markdown and HTML versions of the Project Requirements Plan / Document
 */

export const PRP_RAW_MARKDOWN = `# PRP — Plano de Requisitos do Projeto
## Plataforma: Site Express Studio Pro
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

O criador de sites cobra de R$ 500 a R$ 1.500 de criação por cliente local, mais uma mensalidade de R$ 90 a R$ 150 de manutenção e hospedagem, tornando o ROI da assinatura imediato para a agência.

---

## 2. Matriz de Perfis e Permissões (RBAC)

- **Super Admin (Dono da Plataforma):** Gerencia quem pode usar a ferramenta (gera logins e senhas), define cotas de sites e bloqueia agências inadimplentes.
- **Criador de Sites (Assinante / Agência):** Cria sites para comércios locais (Google Maps ou Manual), acessa a gestão dos seus próprios clientes, ativa/desativa sites (Killswitch) e edita no Studio Pro.
- **Cliente Local (Dono da Empresa):** NÃO TEM LOGIN NEM ACESSO AO SISTEMA. Recebe apenas a URL da página no ar e os leads direto no WhatsApp dele.

---

## 3. Jornada do Usuário em 3 Telas

1. **Tela 1: Portal de Autenticação (AuthScreen):** Acesso exclusivo para o criador ou Super Admin, com alternador iOS e modo diurno/noturno.
2. **Tela 2: Dashboard Central & Hub Operacional (DashboardScreen):**
   - Aba "Novo Site & Início": busca no Google Maps e cadastro manual.
   - Aba "Gestão de Sites": controle de clientes, Killswitch de 1 clique, dias até o vencimento e WhatsApp direto.
   - Aba "Painel do Dono": gestão de assinantes pelo Super Admin.
3. **Tela 3: Studio Pro de Edição Visual (StudioScreen):** Edição em tempo real, Logo Studio, paleta extraída, seção de vídeo Apple e exportação.

---

## 4. Design System Apple iOS (Tokens & Diretrizes)

- **Tipografia:** SF Pro, -apple-system, BlinkMacSystemFont, sans-serif.
- **Cores Semânticas:** #007AFF (Azul), #34C759 (Verde), #FF9500 (Laranja), #FF3B30 (Vermelho).
- **Superfícies:** Liquid Glass (blur 20px, saturação 190%), bordas de 1px translúcidas.
- **Geometria:** Squircles suaves (12px para botões, 20px para containers e modais).
- **Touch Target:** Mínimo de 44x44pt para qualquer elemento tátil.

---

## 5. Módulos Funcionais

- **Google Places Autocomplete:** Importação automática de dados de comércios locais.
- **Cadastro Manual:** Formulário completo para empresas fora do Google Maps.
- **Logo Studio:** Upload com remoção de fundo, gerador de 3 variações de logotipo e favicon SVG.
- **Seção de Vídeo Apple:** Player cinematográfico opcional com suporte a MP4 e YouTube.
- **Killswitch de Inadimplência:** Bloqueio e reativação de sites com 1 clique.

---

## 6. Publicação & Exportação

- **1. URL Pública por Slug:** \`https://seu-dominio.com/?site=nome-do-cliente\`
- **2. Exportação Standalone HTML:** Arquivo \`index.html\` único, zero dependências, pronto para Vercel ou cPanel.
- **3. Pacote ZIP:** Código completo para agências técnicas.
`;

export const PRD_RAW_MARKDOWN = PRP_RAW_MARKDOWN;

export function downloadPrdMarkdown() {
  const blob = new Blob([PRP_RAW_MARKDOWN], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Site-Express-Studio-Pro-PRP.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadPrdHtml() {
  const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PRP — Site Express Studio Pro</title>
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
      max-width: 860px;
      margin: 0 auto;
      background: #ffffff;
      padding: 48px;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.06);
    }
    h1 { color: #007aff; font-size: 32px; margin-top: 0; }
    h2 { color: #1c1c1e; font-size: 24px; border-bottom: 2px solid #f2f2f7; padding-bottom: 8px; margin-top: 36px; }
    h3 { color: #3c3c43; font-size: 18px; margin-top: 24px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
    th, td { padding: 12px 16px; border: 1px solid #e5e5ea; text-align: left; }
    th { background: #f2f2f7; font-weight: 600; }
    code, pre { background: #f2f2f7; border-radius: 8px; font-family: ui-monospace, SFMono-Regular, monospace; }
    pre { padding: 16px; overflow-x: auto; font-size: 13px; }
    .badge { display: inline-block; background: #007aff; color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <span class="badge">Documento Oficial</span>
      <span style="font-size:12px; color:#8e8e93;">Versão 1.0.0</span>
    </div>
    <h1>Site Express Studio Pro — PRP</h1>
    <p><strong>Plano de Requisitos do Projeto & Especificação Funcional</strong></p>
    <hr style="border:0; border-top:1px solid #e5e5ea; margin: 24px 0;" />
    
    <h2>1. Visão Executiva & Modelo de Negócio</h2>
    <p>O <strong>Site Express Studio Pro</strong> é uma plataforma SaaS B2B focada em criadores de sites profissionais e agências locais. O sistema permite criar landing pages em menos de 3 minutos integrando Google Places ou cadastro manual.</p>
    <p><strong>Modelo de Monetização:</strong> Venda de assinaturas recorrentes para criadores (R$ 97 a R$ 297/mês), gerando receita previsível para o dono da ferramenta.</p>

    <h2>2. Matriz de Perfis e Permissões</h2>
    <table>
      <thead>
        <tr><th>Perfil</th><th>Função</th><th>Acesso</th></tr>
      </thead>
      <tbody>
        <tr><td><strong>Super Admin</strong></td><td>Dono da ferramenta; cria e gerencia os logins dos assinantes.</td><td>Painel Administrativo Exclusivo</td></tr>
        <tr><td><strong>Criador de Sites</strong></td><td>Assinante; cria e gerencia sites de clientes locais.</td><td>Dashboard e Studio Pro</td></tr>
        <tr><td><strong>Cliente Local</strong></td><td>Dono do comércio/consultório; <strong>não acessa o sistema</strong>.</td><td>Apenas recebe leads no WhatsApp</td></tr>
      </tbody>
    </table>

    <h2>3. Fluxo do Sistema em 3 Telas</h2>
    <ol>
      <li><strong>Tela 1: Autenticação</strong> — Login para Criador e Admin, com tema Diurno/Noturno.</li>
      <li><strong>Tela 2: Dashboard Central</strong> — Busca no Google Maps, Cadastro Manual, Gestão com Killswitch e WhatsApp direto.</li>
      <li><strong>Tela 3: Studio Pro de Edição</strong> — Layouts Hero, Logo Studio, Seção de Vídeo Apple e exportação.</li>
    </ol>

    <h2>4. Design System Apple iOS</h2>
    <p>Construído com tipografia SF Pro, cores semânticas Apple, efeito Liquid Glass e cantos squircle de 12px e 20px, garantindo acabamento premium e zero aspecto genérico de IA.</p>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Site-Express-Studio-Pro-PRP.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
