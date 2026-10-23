import React, { useState, useEffect } from 'react';
import { KeyRound, ShieldCheck, AlertCircle, Check, Trash2, ExternalLink, Sparkles, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
  onKeyUpdated: (key: string | null) => void;
}

export const GoogleApiKeyModal: React.FC<Props> = ({
  isOpen,
  onClose,
  isDark = false,
  onKeyUpdated,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const savedKey = localStorage.getItem('SITE_EXPRESS_GOOGLE_PLACES_KEY') || '';
      setApiKey(savedKey);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = apiKey.trim();
    if (trimmed) {
      localStorage.setItem('SITE_EXPRESS_GOOGLE_PLACES_KEY', trimmed);
      onKeyUpdated(trimmed);
    } else {
      localStorage.removeItem('SITE_EXPRESS_GOOGLE_PLACES_KEY');
      onKeyUpdated(null);
    }
    onClose();
  };

  const handleClear = () => {
    localStorage.removeItem('SITE_EXPRESS_GOOGLE_PLACES_KEY');
    setApiKey('');
    setTestResult(null);
    onKeyUpdated(null);
  };

  const handleTestKey = async () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      setTestResult({ success: false, message: 'Digite ou cole uma chave de API para testar.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/places/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: trimmed }),
      });
      const data = await response.json();

      if (data.valid) {
        setTestResult({ success: true, message: data.message || 'Chave validada com sucesso no Google Places!' });
      } else {
        setTestResult({
          success: false,
          message: data.message || 'A chave informada não foi aceita pela API do Google Places.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Falha de conexão ao testar a chave.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-[24px] shadow-2xl border flex flex-col overflow-hidden ${
          isDark ? 'bg-[#1C1C1E] border-white/10 text-white' : 'bg-white border-black/10 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between border-black/5 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Chave Google Cloud Places API</h3>
              <p className="text-xs opacity-60">Buscar qualquer empresa real do Google Maps</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-[10px] hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold block">
              Sua Chave de API (Places API New / Places API)
            </label>
            <div className="relative">
              <input
                type="text"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestResult(null);
                }}
                placeholder="AIzaSy..."
                className={`w-full px-3.5 py-2.5 rounded-[12px] border text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-[#007AFF]/20 ${
                  isDark ? 'bg-[#2C2C2E] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
              {apiKey && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 p-1"
                  title="Limpar chave"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Test connection button */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleTestKey}
              disabled={isTesting || !apiKey.trim()}
              className="px-3.5 py-2 rounded-[10px] bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#007AFF]" />
                  <span>Testando com Google...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#007AFF]" />
                  <span>Testar Conexão</span>
                </>
              )}
            </button>

            {testResult && (
              <span
                className={`text-xs font-bold flex items-center gap-1.5 ${
                  testResult.success ? 'text-[#34C759]' : 'text-[#FF3B30]'
                }`}
              >
                {testResult.success ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span className="truncate max-w-[240px]">{testResult.message}</span>
              </span>
            )}
          </div>

          {/* Guidance Info Card */}
          <div
            className={`p-4 rounded-[16px] border text-xs space-y-2 ${
              isDark ? 'bg-black/30 border-white/5 text-slate-300' : 'bg-slate-50 border-slate-200/80 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100">
              <ShieldCheck className="w-4 h-4 text-[#34C759]" />
              <span>Como funciona e onde conseguir a chave:</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-[11px] opacity-80 leading-relaxed">
              <li>
                Acesse o <strong>Google Cloud Console</strong> e ative a biblioteca <strong>Places API</strong>.
              </li>
              <li>
                Crie uma credencial de <strong>Chave de API</strong> e cole neste campo.
              </li>
              <li>
                <strong>Modo Sem Chave (Catálogo Inteligente):</strong> Se você não tiver chave no momento, o aplicativo utiliza o catálogo com empresas brasileiras pré-cadastradas para você testar tudo com fotos reais e sem limites.
              </li>
            </ul>

            <a
              href="https://console.cloud.google.com/apis/library/places-backend.googleapis.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#007AFF] font-bold text-[11px] hover:underline pt-1"
            >
              <span>Abrir Google Cloud Console</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-[12px] text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-[12px] bg-[#007AFF] hover:bg-[#0062cc] text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            Salvar Configuração
          </button>
        </div>
      </div>
    </div>
  );
};
