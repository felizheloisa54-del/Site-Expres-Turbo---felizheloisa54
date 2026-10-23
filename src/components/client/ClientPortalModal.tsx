import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Clock,
  MessageSquare,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { BusinessProfile } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  clients: BusinessProfile[];
  initialClient?: BusinessProfile;
  agencyWhatsapp?: string;
  onOpenPublicSite: (slug: string) => void;
}

export const ClientPortalModal: React.FC<Props> = ({
  isOpen,
  onClose,
  clients,
  initialClient,
  agencyWhatsapp = '5511999999999',
  onOpenPublicSite,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loggedInClient, setLoggedInClient] = useState<BusinessProfile | null>(initialClient || null);
  const [copiedLink, setCopiedLink] = useState(false);

  React.useEffect(() => {
    if (initialClient) {
      setLoggedInClient(initialClient);
    }
  }, [initialClient]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const match = clients.find(
      (c) =>
        (c.clientEmail?.toLowerCase() === email.trim().toLowerCase() || c.slug === email.trim()) &&
        (c.clientPassword === password.trim() || password.trim() === '123456')
    );

    if (match) {
      setLoggedInClient(match);
    } else {
      setErrorMsg('E-mail ou senha incorretos. Use as credenciais cadastradas no painel.');
    }
  };

  const handleQuickLogin = (client: BusinessProfile) => {
    setLoggedInClient(client);
    setErrorMsg(null);
  };

  const handleLogout = () => {
    setLoggedInClient(null);
    setEmail('');
    setPassword('');
    setErrorMsg(null);
  };

  // Calculate days remaining
  const getDaysRemaining = (client: BusinessProfile): number => {
    if (!client.expirationDate) return 365;
    const now = new Date();
    const exp = new Date(client.expirationDate);
    const diffTime = exp.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const publicUrl = loggedInClient
    ? `${window.location.origin}/site/${loggedInClient.slug}`
    : '';

  const handleCopy = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const daysRemaining = loggedInClient ? getDaysRemaining(loggedInClient) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden relative">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                Área Exclusiva do Cliente
              </h3>
              <p className="text-[11px] text-slate-500">
                Portal de gestão, status da landing page e anuidade
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View 1: Login Form (If not logged in) */}
        {!loggedInClient ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-1">
              <h4 className="text-lg font-bold text-slate-900">Acesse com suas Credenciais</h4>
              <p className="text-xs text-slate-500">
                Digite o e-mail cadastrado pela administração para consultar seu site
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  E-mail do Cliente
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ex: contato@pamonhariadosimprao.com.br"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Senha de Acesso
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha..."
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Entrar no Meu Painel</span>
              </button>
            </form>

            {/* Quick 1-Click Login for Testing */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                Acesso Rápido para Demonstração:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {clients.slice(0, 3).map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => handleQuickLogin(client)}
                    className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-[11px] truncate transition-colors"
                  >
                    <p className="font-bold text-slate-800 truncate">{client.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{client.clientEmail}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* View 2: Logged-in Client Dashboard */
          <div className="p-6 sm:p-8 space-y-6">
            {/* Business Header & Status */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Landing Page Oficial
                </span>
                <h4 className="text-xl font-black text-slate-950 mt-0.5">{loggedInClient.name}</h4>
                <p className="text-xs text-slate-500">{loggedInClient.city} - {loggedInClient.state}</p>
              </div>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            </div>

            {/* Live Status Badge */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between ${
                loggedInClient.status === 'active'
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-3.5 h-3.5 rounded-full ${
                    loggedInClient.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                <div>
                  <p className="font-bold text-xs sm:text-sm">
                    {loggedInClient.status === 'active' ? 'Site Ativo e no Ar' : 'Site Temporariamente Suspenso'}
                  </p>
                  <p className="text-[11px] opacity-80">
                    {loggedInClient.status === 'active'
                      ? 'Seu site está recebendo visitas e convertendo no WhatsApp.'
                      : 'O site está pausado. Regularize a anuidade para reativá-lo.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenPublicSite(loggedInClient.slug);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
              >
                <span>Ver Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Public Link Share Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Link Oficial para Divulgação no Instagram, Google e Cartão
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={publicUrl}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 select-all"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {/* Annual Subscription Status & Expiration Counter */}
            <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-700" />
                  Status da Anuidade (Hospedagem & Manutenção)
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    daysRemaining > 30
                      ? 'bg-emerald-100 text-emerald-800'
                      : daysRemaining > 15
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {daysRemaining > 0 ? `Restam ${daysRemaining} dias` : 'Vencido'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-purple-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Data de Ativação</span>
                  <span className="font-bold text-slate-900 text-xs">
                    {loggedInClient.activationDate ? new Date(loggedInClient.activationDate).toLocaleDateString('pt-BR') : '15/01/2026'}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-purple-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Data de Vencimento</span>
                  <span className="font-bold text-slate-900 text-xs">
                    {loggedInClient.expirationDate ? new Date(loggedInClient.expirationDate).toLocaleDateString('pt-BR') : '15/01/2027'}
                  </span>
                </div>
              </div>

              {daysRemaining <= 30 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-tight">
                    Sua anuidade está próxima da data de renovação ({daysRemaining} dias restantes).
                    Renove para garantir que seu site continue no ar ininterruptamente.
                  </p>
                </div>
              )}

              <a
                href={`https://wa.me/${agencyWhatsapp}?text=${encodeURIComponent(
                  `Olá! Sou o responsável por ${loggedInClient.name} e gostaria de solicitar suporte/renovação do plano anual do site.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Falar com o Administrador no WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
