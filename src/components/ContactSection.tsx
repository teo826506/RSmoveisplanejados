import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, CheckCircle2 } from 'lucide-react';
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

  const whatsappNumero = settings?.whatsappNumero || '5511999998888';
  const telefonePrincipal = settings?.telefonePrincipal || '(11) 99999-8888';
  const telefoneFixo = settings?.telefoneFixo || '(11) 3456-7890';
  const emailPrincipal = settings?.emailPrincipal || 'contato@rsplanejados.com.br';
  const emailProjetos = settings?.emailProjetos || 'orcamentos@rsplanejados.com.br';
  const endereco = settings?.endereco || 'São Paulo, SP - Atendimento em toda Grande SP, Alphaville, Litoral e Interior';

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

  const handleWhatsAppGeneral = () => {
    const text = encodeURIComponent(
      'Olá! Gostaria de conversar com um especialista da RS Móveis Planejados em MDF.'
    );
    window.open(`https://wa.me/${whatsappNumero}?text=${text}`, '_blank');
  };

  return (
    <section id="contato" className="py-24 bg-[#0d0d0d] relative overflow-hidden border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Info Side Left */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">
                      Atendimento Direto & WhatsApp
                    </h4>
                    <p className="text-sm font-semibold text-white">{telefonePrincipal}</p>
                    <p className="text-xs text-neutral-400">{telefoneFixo} (Comercial)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">
                      E-mail Institucional
                    </h4>
                    <p className="text-sm font-semibold text-white">{emailPrincipal}</p>
                    <p className="text-xs text-neutral-400">{emailProjetos}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">
                      Região de Atendimento
                    </h4>
                    <p className="text-sm font-semibold text-white">{endereco}</p>
                    <p className="text-xs text-neutral-400">Visitas técnicas sob agendamento prévio</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">
                      Horário de Funcionamento
                    </h4>
                    <p className="text-sm font-semibold text-white">Segunda a Sexta: 08h às 19h</p>
                    <p className="text-xs text-neutral-400">Sábados: 09h às 14h</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleWhatsAppGeneral}
              className="w-full py-3.5 px-6 rounded-lg bg-neutral-900 border border-emerald-500/40 hover:border-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all group"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Chamar no WhatsApp Comercial</span>
            </button>
          </div>

          {/* Form Side Right */}
          <div className="lg:col-span-7">
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
      </div>
    </section>
  );
};
