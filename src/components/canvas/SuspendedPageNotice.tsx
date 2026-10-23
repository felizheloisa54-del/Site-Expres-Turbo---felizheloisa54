import React from 'react';
import { ShieldAlert, PhoneCall, AlertTriangle, Lock } from 'lucide-react';
import { BusinessProfile } from '../../types';

interface Props {
  business: BusinessProfile;
  onReactivate?: () => void;
}

export const SuspendedPageNotice: React.FC<Props> = ({ business, onReactivate }) => {
  return (
    <div className="min-h-[600px] flex items-center justify-center p-6 bg-slate-900 text-slate-100 selection:bg-rose-500 selection:text-white">
      <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950/60 px-3 py-1 rounded-full border border-rose-500/20">
            Acesso Temporariamente Suspenso
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight pt-2">
            Site Temporariamente Indisponível
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            A página oficial de <strong className="text-slate-200">{business.name}</strong> encontra-se
            em processo de atualização ou regularização administrativa.
          </p>
        </div>

        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Informação ao Administrador do Negócio:</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Para reativar a veiculação pública do seu domínio imediatamente ou renovar sua hospedagem,
            entre em contato com a equipe de gestão pelo canal direto.
          </p>
        </div>

        {onReactivate && (
          <button
            onClick={onReactivate}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors shadow-sm"
          >
            Reativar Site no Studio (Apenas Demonstração)
          </button>
        )}

        <div className="text-[10px] text-slate-600 pt-2 border-t border-slate-900">
          Site Express Studio Pro • Protocolo de Gestão Administrativa
        </div>
      </div>
    </div>
  );
};
