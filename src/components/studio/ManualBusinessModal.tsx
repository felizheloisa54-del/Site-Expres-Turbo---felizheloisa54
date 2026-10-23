import React, { useState } from 'react';
import { X, Building2, MapPin, Phone, MessageSquare, Clock, Star, Image, Check, Sparkles } from 'lucide-react';
import { BusinessProfile, ArchetypeId, ThemeMode } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (biz: BusinessProfile) => void;
  themeMode: ThemeMode;
}

export const ManualBusinessModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  themeMode,
}) => {
  const isDark = themeMode === 'dark';

  const [name, setName] = useState('');
  const [archetype, setArchetype] = useState<ArchetypeId>('servicos');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [openingHours, setOpeningHours] = useState('Segunda a Sexta: 08:00 às 18:00');
  const [shortBio, setShortBio] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim() || !city.trim()) return;

    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const cleanWhatsapp = whatsapp.replace(/\D/g, '');

    const newBusiness: BusinessProfile = {
      id: `manual-${Date.now()}`,
      name: name.trim(),
      slug: slug || `empresa-${Date.now().toString().slice(-4)}`,
      archetype,
      category: category.trim() || 'Comércio & Serviços Locais',
      city: city.trim(),
      state: state.trim().toUpperCase(),
      address: address.trim() || `${neighborhood || 'Centro'}, ${city}`,
      neighborhood: neighborhood.trim() || 'Centro',
      zipCode: '00000-000',
      phone: phone.trim() || whatsapp.trim(),
      whatsapp: cleanWhatsapp.startsWith('55') ? cleanWhatsapp : `55${cleanWhatsapp}`,
      mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(`${name} ${city}`)}`,
      wazeUrl: `https://waze.com/ul?q=${encodeURIComponent(`${name} ${city}`)}`,
      rating: 5.0,
      reviewCount: 32,
      openingHours: openingHours.trim(),
      isOpenNow: true,
      coverImage,
      secondaryImage: coverImage,
      galleryImages: [
        coverImage,
        'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      ],
      logoUrl: logoUrl.trim() || undefined,
      logoHeight: 44,
      manualCreated: true,

      // Copywriting
      eyebrowText: `ATENDIMENTO DE EXCELÊNCIA EM ${city.toUpperCase()}`,
      headline: `${name} — Qualidade e Compromisso em`,
      highlightWord: city,
      subheadline:
        shortBio ||
        `Estrutura moderna, atendimento ágil e os melhores serviços da região com garantia de satisfação.`,
      shortBio:
        shortBio ||
        `${name} é referência em ${city} e região pela excelência e confiabilidade dos seus serviços.`,
      aboutStory: `Fundada com a missão de entregar o melhor atendimento e os mais altos padrões de qualidade, a ${name} atende clientes em ${city} com pontualidade, transparência e dedicação diária.`,
      ctaText: 'Solicitar Atendimento no WhatsApp',
      ctaWhatsappMessage: `Olá! Vim pelo site da ${name} e gostaria de saber mais informações.`,
      secondaryCtaText: 'Ver Localização no Mapa',

      credentials: [
        { label: 'Atendimento Rápido', value: 'Resposta em Minutos' },
        { label: 'Satisfação', value: 'Nota 5.0 no Google' },
        { label: 'Localização', value: `${city} - ${state}` },
        { label: 'Garantia', value: 'Serviço Confiável' },
      ],

      features: [
        {
          id: 'mf1',
          title: 'Atendimento Direto e Personalizado',
          description: 'Orçamento rápido sem burocracia diretamente no WhatsApp oficial.',
          iconName: 'CheckCircle',
          badge: 'Destaque',
          actionText: 'Falar no WhatsApp',
        },
        {
          id: 'mf2',
          title: 'Pontualidade e Eficiência',
          description: 'Compromisso com prazos e o mais alto nível de execução.',
          iconName: 'Clock',
          badge: 'Garantido',
          actionText: 'Consultar Horários',
        },
        {
          id: 'mf3',
          title: 'Preço Justo e Transparência',
          description: 'Condições facilitadas de pagamento e atendimento humanizado.',
          iconName: 'Shield',
          badge: 'Vantagem',
          actionText: 'Saber Mais',
        },
      ],

      catalogItems: [
        {
          id: 'mc1',
          name: 'Serviço Principal / Especialidade',
          category: 'Mais Pedido',
          description: 'Solução completa sob medida com garantia de qualidade.',
          price: 150.0,
          originalPrice: 190.0,
          image: coverImage,
          badge: 'Mais Vendido',
        },
        {
          id: 'mc2',
          name: 'Atendimento Expresso',
          category: 'Geral',
          description: 'Agilidade para quem precisa de resolução rápida no mesmo dia.',
          price: 90.0,
          image: coverImage,
        },
      ],

      categories: ['Mais Pedido', 'Geral', 'Especialidades'],

      reviews: [
        {
          id: 'mr1',
          author: 'Mariana Silveira',
          initials: 'MS',
          rating: 5,
          date: 'Há 1 semana',
          comment: 'Atendimento impecável! Resolveram minha demanda com rapidez e muita educação. Super recomendo a todos em ' + city + '.',
          avatarColor: 'bg-emerald-600',
        },
        {
          id: 'mr2',
          author: 'Carlos Eduardo Santos',
          initials: 'CS',
          rating: 5,
          date: 'Há 2 semanas',
          comment: 'Excelente experiência. Fui atendido super rápido pelo WhatsApp e o serviço ficou de primeiríssima qualidade.',
          avatarColor: 'bg-blue-600',
        },
      ],

      faq: [
        {
          id: 'mq1',
          question: `Como funciona o atendimento da ${name}?`,
          answer: 'Você pode entrar em contato diretamente pelo WhatsApp para tirar dúvidas, solicitar um orçamento ou agendar um horário.',
        },
        {
          id: 'mq2',
          question: 'Quais são as formas de pagamento aceitas?',
          answer: 'Aceitamos PIX, cartões de crédito e débito com total segurança e praticidade.',
        },
      ],

      promoBanner: {
        enabled: true,
        title: 'Condição Especial de Inauguração do Site',
        subtitle: 'Mencione que veio pelo site e garanta atendimento prioritário hoje',
        oldPrice: 190,
        promoPrice: 150,
        hoursRemaining: 18,
        badge: 'OFERTA LIMITADA',
      },

      videoSection: {
        enabled: false,
        title: 'Conheça Nossa Estrutura',
        subtitle: 'Assista ao vídeo e veja nossos bastidores',
        videoUrl: '',
        posterUrl: coverImage,
      },

      heroLayout: 'boxed',
      reviewsAutoplay: true,
      activationDate: new Date().toISOString(),
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onConfirm(newBusiness);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in select-none">
      <div
        className={`rounded-3xl max-w-2xl w-full border shadow-2xl overflow-hidden transition-all my-8 ${
          isDark ? 'bg-[#111726] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Top Bar */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark ? 'border-slate-800 bg-[#0E1322]' : 'border-slate-100 bg-slate-50/80'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base leading-tight">
                Cadastrar Empresa Manualmente
              </h3>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Para empresas que ainda não possuem perfil no Google Meu Negócio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="font-bold block mb-1">Nome da Empresa / Estabelecimento *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Pamonharia da Vovó, Auto Elétrica Londrina, Dra. Camila Odonto..."
                className={`w-full p-2.5 rounded-xl border text-xs font-semibold focus:outline-hidden ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600'
                }`}
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Arquétipo / Modelo de Site</label>
              <select
                value={archetype}
                onChange={(e) => setArchetype(e.target.value as ArchetypeId)}
                className={`w-full p-2.5 rounded-xl border text-xs font-semibold focus:outline-hidden ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600'
                }`}
              >
                <option value="servicos">Clínica / Saúde / Serviços Gerais</option>
                <option value="gastronomia">Gastronomia / Restaurante / Lanchonete</option>
                <option value="produtos">Comércio / Produtos / Loja Local</option>
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">Ramo de Atuação / Categoria</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Consultório Odontológico, Hamburgueria Artesanal..."
                className={`w-full p-2.5 rounded-xl border text-xs focus:outline-hidden ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600'
                }`}
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Cidade *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: Londrina, Goiânia, Campinas..."
                className={`w-full p-2.5 rounded-xl border text-xs focus:outline-hidden ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600'
                }`}
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Estado (UF)</label>
              <input
                type="text"
                maxLength={2}
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase())}
                placeholder="Ex: SP, PR, GO, MG..."
                className={`w-full p-2.5 rounded-xl border text-xs uppercase focus:outline-hidden ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600'
                }`}
              />
            </div>

            <div>
              <label className="font-bold block mb-1">WhatsApp para Pedidos / Agendamento *</label>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Ex: 43 99948-9000 ou 5543999489000"
                className={`w-full p-2.5 rounded-xl border text-xs font-mono focus:outline-hidden ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600'
                }`}
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Telefone Fixo (Opcional)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: (43) 3348-9000"
                className={`w-full p-2.5 rounded-xl border text-xs focus:outline-hidden ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600'
                }`}
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Endereço Completo</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: Av. Ayrton Senna, 550"
                className={`w-full p-2.5 rounded-xl border text-xs focus:outline-hidden ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600'
                }`}
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Bairro</label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Ex: Gleba Palhano"
                className={`w-full p-2.5 rounded-xl border text-xs focus:outline-hidden ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600'
                }`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold block mb-1">Horário de Funcionamento</label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                placeholder="Ex: Seg a Sex: 08:00 às 18:00 | Sáb: 08:00 às 12:00"
                className={`w-full p-2.5 rounded-xl border text-xs focus:outline-hidden ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600'
                }`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold block mb-1">URL da Logomarca do Cliente (Opcional)</label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://... (ou deixe em branco para usar logotipo tipográfico oficial)"
                className={`w-full p-2.5 rounded-xl border text-xs font-mono focus:outline-hidden ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600'
                }`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold block mb-1">Descrição Curta / Diferencial da Empresa</label>
              <textarea
                rows={2}
                value={shortBio}
                onChange={(e) => setShortBio(e.target.value)}
                placeholder="Resumo dos serviços, história ou diferencial de atendimento..."
                className={`w-full p-2.5 rounded-xl border text-xs focus:outline-hidden ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600'
                }`}
              />
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border text-[11px] flex items-center gap-2 ${
              isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>
              O site será gerado com estrutura completa, fotos reais de apoio, botão de WhatsApp e seções prontas para edição no estúdio.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs ${
                isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Gerar Site e Abrir Estúdio</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
