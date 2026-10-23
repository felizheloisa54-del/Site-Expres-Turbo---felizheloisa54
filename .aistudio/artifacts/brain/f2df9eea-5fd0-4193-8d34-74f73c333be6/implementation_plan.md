# Plano de Auditoria & Correção Completa: Site Express Studio Pro

Auditoria detalhada e plano de correção técnica ponta a ponta para resolver problemas de responsividade mobile, player de vídeo institucional, links de WhatsApp, exibição de logomarca e cronômetro de promoções no preview e no HTML exportado.

## Decisões Confirmadas com o Usuário

- **Responsividade Mobile:** Prioridade máxima na renderização de celular (iPhone 390px, visualização pública e HTML exportado).
- **Player de Vídeo Institucional:** Adição de seção nativa com suporte a YouTube (conversão automática para embed), Vimeo e MP4 com proporção 16:9 responsiva.
- **Redirecionamento do WhatsApp:** Higienização rigorosa dos números (remoção de parênteses, traços e espaços, prefixando com `55`) para garantir abertura imediata em `https://wa.me/55...`.
- **Cores, Tipografia e Logo:** Exibição proporcional e sem distorção dos logotipos SVG gerados e aplicação consistente da paleta selecionada e fontes do Google.
- **Promoção com Cronômetro:** Contador regressivo em tempo real (`HH:MM:SS`) sincronizado no Studio e no HTML autônomo.
- **Escopo:** Revisão ponta a ponta em Busca, Edição, Preview e Exportação.

---

## 1. Visão Geral & Objetivos da Correção

Garantir que as landing pages geradas tenham padrão de qualidade profissional (Apple / Tailwind CSS), funcionando perfeitamente em qualquer smartphone ou desktop, tanto dentro do Studio quanto nos links compartilhados e no arquivo HTML baixado para publicação na Vercel.

---

## 2. Experiência do Usuário & Design Visual

### A. Responsividade Mobile nos Sites Gerados
- **Grid Fluido:** Ajustar todas as seções (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) com `gap` e `padding` proporcionais ao tamanho de tela (`px-4 sm:px-6 lg:px-8`).
- **Navegação no Celular:**
  - Ocultar links de navegação secundários em telas pequenas para evitar quebra de linha no cabeçalho.
  - Manter o logotipo e o botão de ação principal (WhatsApp) sempre acessíveis em uma única linha.
- **Barra Flutuante do WhatsApp:** Fixada no rodapé da visualização mobile (`fixed bottom-0` ou `sticky bottom-0`) com efeito Liquid Glass e touch-target de 44px.
- **Detecção de Viewport Pública:** Na rota pública `?site=slug` ou `/site/slug`, detectar automaticamente o tamanho real da janela (`window.innerWidth < 768`) para aplicar o modo mobile nativo.

### B. Player de Vídeo Institucional
- Inserir a seção dedicada de **Vídeo Institucional** em `RenderedLandingPage.tsx` e sincronizar com `exportHtml.ts`.
- Suporte a:
  - URLs do YouTube (`watch?v=ID` ou `youtu.be/ID` convertidos dinamicamente para `embed/ID`).
  - URLs do Vimeo.
  - Vídeos diretos `.mp4` com atributo `controls` e `poster` personalizado.
- Envoltório com proporção de tela `aspect-video` (16:9), cantos curvos (`rounded-3xl`) e sem transbordamento horizontal em telas estreitas.

### C. Redirecionamento Preciso do WhatsApp
- Criar a função utilitária `cleanWhatsAppNumber(phone: string)`:
  - Remove todos os caracteres não numéricos (`(`, `)`, `-`, ` `, `+`).
  - Adiciona o DDI `55` se o número tiver 10 ou 11 dígitos.
  - Monta o link oficial: `https://wa.me/5511999999999?text=Mensagem%20Codificada`.

### D. Cores, Tipografia & Logomarca
- **Logotipos SVG:** Renderização com `max-h-12 w-auto object-contain` para preservar a proporção geométrica de monogramas, selos dourados e brasões.
- **Paletas Dinâmicas:** Sincronizar as variáveis de cor (`theme.primaryColor`, `theme.accentColor`, `theme.backgroundColor`) em todos os botões de ação (CTAs), destaques, bordas ativas e ícones das 9 seções.
- **Tipografia:** Garantir que o seletor de fontes (`Plus Jakarta Sans`, `Cormorant Garamond`, `Inter`, `Outfit`, `Playfair Display`, `Montserrat`) aplique a classe CSS e a propriedade inline `fontFamily` de forma consistente no corpo e nos títulos.

### E. Cronômetro de Ofertas
- Manter o cálculo de tempo restante decrementando a cada 1 segundo (`setInterval` de 1000ms).
- Exibição tabular com formato `07:45:22` e ícone de relógio animado.
- Inclusão do script JavaScript autônomo no `exportHtml.ts` para que o cronômetro funcione no site exportado na Vercel.

---

## 3. Arquitetura Técnica & Mapeamento de Componentes

```
┌────────────────────────────────────────────────────────┐
│                        App.tsx                         │
│   (Gerencia Telas: Vendas/Login, Dashboard, Studio)    │
│   (Detecta Viewport Mobile na Rota Pública ?site=slug) │
└───────────────────────────┬────────────────────────────┘
                            │
       ┌────────────────────┼────────────────────┐
       ▼                    ▼                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  AuthScreen  │     │  Dashboard   │     │  Studio Pro  │
│ (Vendas/Log) │     │ (Buscador)   │     │ (Editor)     │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                 │
                        ┌────────────────────────┴────────────────────────┐
                        ▼                                                 ▼
             ┌─────────────────────┐                           ┌─────────────────────┐
             │  SidebarPanels.tsx  │                           │ CanvasContainer.tsx │
             │ (Seções, Vídeo,     │                           │ (Moldura iPhone,    │
             │  Cores, Fontes)     │                           │  Desktop, Tablet)   │
             └──────────┬──────────┘                           └──────────┬──────────┘
                        │                                                 │
                        └────────────────────────┬────────────────────────┘
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │   RenderedLandingPage.tsx   │
                                  │  - WhatsApp Link Limpo      │
                                  │  - Vídeo Player 16:9        │
                                  │  - 9 Seções Modulares       │
                                  │  - Logos SVG sem Distorção  │
                                  │  - Cronômetro Real          │
                                  └──────────────┬──────────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │        exportHtml.ts        │
                                  │  (Geração de HTML Vercel    │
                                  │   com todas as correções)   │
                                  └─────────────────────────────┘
```

---

## 4. Plano de Execução Passo a Passo

1. **Utilitário de WhatsApp (`src/utils/phoneUtils.ts`):**
   - Implementar sanitização universal de telefone para o padrão WhatsApp internacional brasileiro (`55XXXXXXXXXXX`).
2. **Atualização do `RenderedLandingPage.tsx`:**
   - Adicionar o bloco completo do **Vídeo Institucional** (YouTube, Vimeo e MP4 com 16:9 responsivo).
   - Aplicar a limpeza de link do WhatsApp em todos os botões de CTA da página.
   - Ajustar o dimensionamento do logotipo no cabeçalho (SVG / imagem) com proporção preservada.
   - Garantir responsividade total nas 9 seções com classes Tailwind fluidas (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, `text-sm sm:text-base`).
   - Sincronizar as cores da paleta nos botões e bordas de destaque.
3. **Atualização do `exportHtml.ts`:**
   - Atualizar a geração de links do WhatsApp com número limpo.
   - Garantir a inclusão da seção de vídeo institucional no HTML exportado com player responsivo.
   - Garantir a injeção do cronômetro JavaScript em tempo real.
   - Incluir a barra flutuante de WhatsApp mobile fixada no rodapé da página.
4. **Ajuste no `App.tsx` para Links Públicos:**
   - Permitir detecção de tamanho de tela para o modo público (`?site=slug`), renderizando a versão mobile de forma nativa quando acessado por smartphone.
5. **Verificação & Testes:**
   - Executar `lint_applet` e `compile_applet`.
   - Reiniciar o servidor de desenvolvimento e testar todos os fluxos.
