import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { SiteSettings } from '../types';

interface ContactSectionProps {
  settings?: SiteSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: 'Dúvida Geral / Orçamento',
    mensagem: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.nome.trim() || !formData.mensagem.trim()) {
      setErrorMsg('Preencha seu nome e a mensagem que deseja nos enviar.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar mensagem');
      }

      setSuccess(true);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        assunto: 'Dúvida Geral / Orçamento',
        mensagem: '',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao comunicar com o servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contato" className="py-24 bg-[#0d0d0d] relative overflow-hidden border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Form Only */}
          <div className="p-8 sm:p-10 rounded-2xl bg-[#121212] border border-[#D4AF37]/30 shadow-2xl">
              <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white mb-2">
                Envie uma Mensagem
              </h3>
              <p className="text-xs text-neutral-400 mb-6">
                Retornamos em até 2 horas em dias úteis.
              </p>

              {success ? (
                <div className="p-6 rounded-xl bg-neutral-900 border border-[#D4AF37]/50 text-center animate-fadeIn">
                  <CheckCircle2 className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-white mb-1">Mensagem Enviada com Sucesso!</h4>
                  <p className="text-xs text-neutral-300 mb-4">
                    Nossa equipe já recebeu seu contato e retornará em breve.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-5 py-2 rounded-lg bg-[#D4AF37] text-black font-bold text-xs uppercase"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-1.5">
                        Seu Nome <span className="text-[#D4AF37]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nome completo"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-[#D4AF37] text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-1.5">
                        Telefone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="(11) 99999-8888"
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-[#D4AF37] text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-1.5">
                        E-mail
                      </label>
                      <input
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-[#D4AF37] text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-1.5">
                        Assunto
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Orçamento de Cozinha, Parceria..."
                        value={formData.assunto}
                        onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-[#D4AF37] text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-1.5">
                      Mensagem <span className="text-[#D4AF37]">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Como podemos ajudar no seu projeto?"
                      value={formData.mensagem}
                      onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-[#D4AF37] text-sm text-white focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#e3be47] hover:to-[#ca9614] text-black font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 transition-all duration-200 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Enviando...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>ENVIAR MENSAGEM</span>
                      </>
                    )}
                  </button>
                </form>
              )}
              </div>
          </div>
        </div>
    </section>
  );
};
