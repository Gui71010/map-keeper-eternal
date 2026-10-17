import { useState } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, Mail, MessageCircle, Send, CheckCircle2, User, AtSign, MessageSquare } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { supabase } from '@/integrations/supabase/client';
import GalaxyParticles from '@/components/GalaxyParticles';
import adminTeamImg from '@/assets/admin-team.jpg';

const ContatoPage = () => {
  const { isAdmin, content, updateContent } = useAdmin();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim()) return;
    setSending(true);
    try {
      await supabase.from('feedback').insert({ type: 'contato', name, email, message } as any);
    } catch (e) {
      console.error(e);
    }
    setSending(false);
    setSent(true);
  };

  const links = [
    { label: 'LinkedIn', icon: Linkedin, href: content.linkedinUrl, field: 'linkedinUrl' as const, color: 'text-sky-400' },
    { label: 'GitHub', icon: Github, href: content.githubUrl, field: 'githubUrl' as const, color: 'text-foreground' },
    { label: 'E-mail', icon: Mail, href: `mailto:${content.contactEmail}`, field: 'contactEmail' as const, color: 'text-amber-400' },
    { label: 'WhatsApp', icon: MessageCircle, href: `https://wa.me/${content.whatsappNumber}`, field: 'whatsappNumber' as const, color: 'text-teal-light' },
  ];

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden border border-border/40">
        <img src={adminTeamImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/60" />
        <GalaxyParticles />
        <div className="relative z-10 px-8 md:px-16 py-14 md:py-20 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display font-bold text-4xl md:text-5xl text-foreground">
            Vamos <span className="text-gradient">conversar?</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Tem um projeto, uma oportunidade ou quer trocar uma ideia sobre dados e automação? Me chama por qualquer canal abaixo.
          </motion.p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact links */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          <h2 className="font-display font-semibold text-2xl text-foreground mb-6">Canais de contato</h2>
          {links.map((link, i) => (
            <motion.div key={link.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.08 }}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card rounded-2xl p-5 border border-border/40 flex items-center gap-4 hover:border-accent/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-card/80 border border-border/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <link.icon className={`w-6 h-6 ${link.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-foreground">{link.label}</p>
                  {isAdmin ? (
                    <input
                      className="w-full bg-transparent outline-none border-b border-border/40 focus:border-accent text-sm text-muted-foreground mt-0.5"
                      value={link.href.replace('mailto:', '').replace('https://wa.me/', '')}
                      onClick={(e) => e.preventDefault()}
                      onChange={(e) => updateContent({ [link.field]: e.target.value } as any)}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground truncate">{link.href.replace('mailto:', '').replace('https://wa.me/', '')}</p>
                  )}
                </div>
                <Send className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
              </a>
            </motion.div>
          ))}
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-3xl p-8 border border-border/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 gradient-accent" />
          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center py-16">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}>
                <CheckCircle2 className="w-16 h-16 text-accent mb-4" />
              </motion.div>
              <h3 className="font-display font-bold text-2xl text-foreground">Mensagem enviada!</h3>
              <p className="mt-2 text-muted-foreground">Obrigado pelo contato. Retorno em breve.</p>
              <button onClick={() => { setSent(false); setName(''); setEmail(''); setMessage(''); }} className="mt-6 px-5 py-2.5 rounded-xl bg-card/70 border border-border/50 text-sm text-foreground hover:border-accent/50 transition-colors">
                Enviar outra mensagem
              </button>
            </motion.div>
          ) : (
            <>
              <h2 className="font-display font-semibold text-2xl text-foreground mb-6">Envie uma mensagem</h2>
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" className="w-full pl-11 pr-4 py-3 rounded-xl bg-card/60 border border-border/50 text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-accent" />
                </div>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Seu e-mail" type="email" className="w-full pl-11 pr-4 py-3 rounded-xl bg-card/60 border border-border/50 text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-accent" />
                </div>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-muted-foreground" />
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Sua mensagem..." rows={5} className="w-full pl-11 pr-4 py-3 rounded-xl bg-card/60 border border-border/50 text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-accent resize-y" />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={sending || !name.trim() || !message.trim()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl gradient-accent text-primary-foreground font-semibold shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send className="w-4 h-4" />
                  {sending ? 'Enviando...' : 'Enviar mensagem'}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ContatoPage;
