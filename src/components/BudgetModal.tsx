import React, { useState } from 'react';
import { X, Sparkles, MessageCircle, Send, CheckCircle, Calculator, ShieldCheck, PhoneCall } from 'lucide-react';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAmbiente?: string;
  onBudgetCreated?: () => void;
}

const AMBIENTES = [
  'Cozinha',
  'Quarto / Suíte',
  'Closet',
  'Sala de Estar / TV',
  'Home Office',
  'Banheiro / Lavabo',
  'Espaço Gourmet / Varanda',
  'Móveis Corporativos',
  'Apartamento Completo',
  'Outro',
];

const ACABAMENTOS = [
  '100% MDF Madeirado Nobre',
  'Laca Acetinada Fosca / Matt',
  'MDF Naval Ultra (Anti-Umidade)',
  'Portas em Vidro Reflecta Bronze/Fumê',
  'Painéis Ripados Usinados',
  'Quero orientação do projetista',
];

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  defaultAmbiente,
  onBudgetCreated,
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    cidade: '',
    ambiente: defaultAmbiente || 'Cozinha',
    acabamento: '100% MDF Madeirado Nobre',
    medidas: '',
    descricao: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState<{
    whatsappUrl: string;
    budgetId: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.nome.trim() || !formData.telefone.trim() || !formData.descricao.trim()) {
      setErrorMsg('Por favor, preencha seu nome, WhatsApp e uma breve descrição do projeto.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          telefone: formData.telefone,
          email: formData.email,
          cidade: formData.cidade,
          ambiente: formData.ambiente,
          medidas: formData.medidas,
          descricao: `[Acabamento: ${formData.acabamento}] ${formData.descricao}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar orçamento');
      }

      setSuccessData({
        whatsappUrl: data.whatsappUrl,
        budgetId: data.budget.id,
      });

      if (onBudgetCreated) {
        onBudgetCreated();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro de conexão com o servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenWhatsApp = () => {
    if (successData?.whatsappUrl) {
      window.open(successData.whatsappUrl, '_blank');
    }
  };

  const handleResetAndClose = () => {
    setSuccessData(null);
    setFormData({
      nome: '',
      telefone: '',
      email: '',
      cidade: '',
      ambiente: 'Cozinha',
      acabamento: '100% MDF Madeirado Nobre',
      medidas: '',
      descricao: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="fixed inset-0" onClick={handleResetAndClose} />

      <div className="relative z-10 w-full max-w-2xl bg-[#111111] border border-[#D4AF37]/40 rounded-2xl shadow-2xl shadow-black my-8">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-black via-[#141414] to-black border-b border-[#D4AF37]/25 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-[#D4AF37] font-display-rs">
                SOLICITAÇÃO DE ORÇAMENTO PERSONALIZADO
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
              Transforme seu ambiente com a{' '}
              <span className="text-gold-gradient font-serif-luxury">RS Móveis</span>
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 font-light">
              Preencha os dados abaixo para receber uma estimativa técnica e atendimento no WhatsApp.
            </p>
          </div>

          <button
            id="close-budget-modal-btn"
            onClick={handleResetAndClose}
            className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-[#D4AF37] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {successData ? (
            /* Success View */
            <div className="text-center py-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>

              <h4 className="text-2xl font-serif-luxury font-bold text-white mb-2">
                Solicitação Registrada com Sucesso!
              </h4>

              <p className="text-sm text-neutral-300 max-w-md mx-auto mb-6">
                Seu orçamento foi salvo em nosso sistema sob o código <strong className="text-[#D4AF37]">{successData.budgetId}</strong>. Para agilizar seu atendimento e enviar plantas ou fotos do ambiente, clique no botão abaixo:
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  id="budget-success-whatsapp-btn"
                  onClick={handleOpenWhatsApp}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>CONVERSAR NO WHATSAPP AGORA</span>
                </button>

                <button
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-lg border border-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Fechar
                </button>
              </div>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-1.5">
                    Nome Completo <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: João Silva"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-[#D4AF37] text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-1.5">
                    WhatsApp (com DDD) <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 99999-8888"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-[#D4AF37] text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                {/* E-mail */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-1.5">
                    E-mail
                  </label>
                  <input
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-[#D4AF37] text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                {/* Cidade */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-1.5">
                    Cidade / Bairro
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: São Paulo - Morumbi"
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-[#D4AF37] text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Ambiente & Acabamento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-1.5">
                    Ambiente a Planejar <span className="text-[#D4AF37]">*</span>
                  </label>
                  <select
                    value={formData.ambiente}
                    onChange={(e) => setFormData({ ...formData, ambiente: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-[#D4AF37] text-sm text-white focus:outline-none transition-colors"
                  >
                    {AMBIENTES.map((amb) => (
                      <option key={amb} value={amb}>
                        {amb}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-1.5">
                    Preferência de Acabamento
                  </label>
                  <select
                    value={formData.acabamento}
                    onChange={(e) => setFormData({ ...formData, acabamento: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-[#D4AF37] text-sm text-white focus:outline-none transition-colors"
                  >
                    {ACABAMENTOS.map((acab) => (
                      <option key={acab} value={acab}>
                        {acab}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Medidas aproximadas */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-1.5">
                  Medidas Aproximadas ou Metragem (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Parede de 3.80m x 2.60m ou Aprox. 20m²"
                  value={formData.medidas}
                  onChange={(e) => setFormData({ ...formData, medidas: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-[#D4AF37] text-sm text-white focus:outline-none transition-colors"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-1.5">
                  Detalhes e Ideias do Projeto <span className="text-[#D4AF37]">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Descreva o que você gostaria: cores preferidas, se precisa de ilha, torres para eletrodomésticos, led embutido, etc."
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-[#D4AF37] text-sm text-white focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Guarantees note */}
              <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <p className="text-[11px] text-neutral-400">
                  Seus dados estão protegidos. Orçamento gratuito sem compromisso com visita técnica inclusa na sua região.
                </p>
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="budget-modal-submit-btn"
                  className="w-full py-4 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#e3be47] hover:to-[#ca9614] text-black font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/25 transition-all duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Registrando solicitação...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>ENVIAR E RECEBER ATENDIMENTO WHATSAPP</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
