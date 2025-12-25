
import React, { useState } from 'react';

interface LandingViewProps {
  onStartAuth: (mode?: 'login' | 'register') => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onStartAuth }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleMobileAuth = (mode: 'login' | 'register') => {
    closeMenu();
    onStartAuth(mode);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-body selection:bg-primary selection:text-background-dark antialiased overflow-x-hidden">
      {/* Navbar - Agora com posição FIXED para garantir que esteja sempre visível */}
      <nav className="fixed top-0 left-0 right-0 z-[100] w-full border-b border-[#23482f] bg-[#112217]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined">storefront</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">MerceariaPro</h1>
          </div>
          
          {/* Desktop Links */}
          <div className="hidden items-center gap-8 md:flex">
            <a className="text-sm font-medium text-white/80 hover:text-primary transition-colors" href="#beneficios">Benefícios</a>
            <a className="text-sm font-medium text-white/80 hover:text-primary transition-colors" href="#funcionalidades">Funcionalidades</a>
            <a className="text-sm font-medium text-white/80 hover:text-primary transition-colors" href="#depoimentos">Clientes</a>
            <button onClick={() => onStartAuth('login')} className="text-sm font-medium text-white/80 hover:text-primary transition-colors">Entrar</button>
            <button 
              onClick={() => onStartAuth('register')}
              className="flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-background-dark transition-all hover:bg-primary-hover hover:scale-105 shadow-[0_0_15px_rgba(19,236,91,0.3)]"
            >
              Criar Conta Grátis
            </button>
          </div>

          {/* Mobile Menu Button - "Fixado" visualmente pela navbar fixa */}
          <button 
            className="md:hidden p-2 text-white hover:text-primary transition-colors z-[110]"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Corrigido para funcionar com a navbar fixa */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[90] md:hidden bg-background-dark/98 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="flex flex-col h-full pt-24 px-8 gap-8">
            <nav className="flex flex-col gap-6 border-b border-border-dark pb-10">
              <a onClick={closeMenu} className="text-3xl font-black text-white hover:text-primary" href="#beneficios">Benefícios</a>
              <a onClick={closeMenu} className="text-3xl font-black text-white hover:text-primary" href="#funcionalidades">Funcionalidades</a>
              <a onClick={closeMenu} className="text-3xl font-black text-white hover:text-primary" href="#depoimentos">Clientes</a>
            </nav>
            
            <div className="flex flex-col gap-4 mt-4">
              <button 
                onClick={() => handleMobileAuth('login')}
                className="w-full py-5 rounded-2xl border border-border-dark text-white font-bold hover:bg-surface-dark transition-colors text-lg"
              >
                Entrar no Sistema
              </button>
              <button 
                onClick={() => handleMobileAuth('register')}
                className="w-full py-5 rounded-2xl bg-primary text-background-dark font-black shadow-[0_0_25px_rgba(19,236,91,0.4)] text-lg"
              >
                CRIAR CONTA GRÁTIS
              </button>
            </div>

            <div className="mt-auto pb-10 text-center">
               <span className="text-[10px] uppercase tracking-[0.3em] font-black text-text-secondary opacity-50">MerceariaPro • Gestão Offline</span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Adicionado pt-20 para compensar a navbar fixa */}
      <section className="relative overflow-hidden pt-28 pb-20 lg:pt-40 lg:pb-32">
        {/* Background Elements */}
        <div className="absolute -top-24 -left-24 size-96 rounded-full bg-primary/20 blur-[128px]"></div>
        <div className="absolute top-1/2 right-0 size-96 rounded-full bg-blue-500/10 blur-[128px]"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="flex flex-col gap-6 max-w-2xl">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex size-2 rounded-full bg-primary"></span>
                </span>
                Novo: Integração com M-Pesa
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl leading-[1.1]">
                Controle total da sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">Mercearia</span>
              </h1>
              <p className="text-lg text-text-secondary leading-relaxed max-w-lg">
                Abandone o papel. O sistema Moçambicano feito para gerenciar vendas, fiados e fornecedores mesmo sem internet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button 
                  onClick={() => onStartAuth('register')}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-bold text-background-dark transition-all hover:bg-primary-hover hover:shadow-[0_0_20px_rgba(19,236,91,0.4)]"
                >
                  Começar Grátis
                  <span className="material-symbols-outlined text-lg font-bold">arrow_forward</span>
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-border-dark bg-surface-dark/50 px-8 py-4 text-base font-bold text-white transition-all hover:bg-surface-dark hover:border-primary/50">
                  <span className="material-symbols-outlined text-lg font-bold">play_circle</span>
                  Vídeo Demonstrativo
                </button>
              </div>
            </div>
            {/* Hero Image / Dashboard Mockup */}
            <div className="relative lg:ml-auto w-full">
              <div className="relative rounded-2xl border border-border-dark bg-[#1a2e22] shadow-2xl overflow-hidden aspect-[4/3] group">
                {/* Decorative Header */}
                <div className="flex items-center gap-2 border-b border-border-dark bg-[#112217] px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="size-3 rounded-full bg-red-500/80"></div>
                    <div className="size-3 rounded-full bg-yellow-500/80"></div>
                    <div className="size-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="ml-4 h-2 w-32 rounded-full bg-white/10"></div>
                </div>
                {/* Dashboard Content Placeholder */}
                <div 
                  className="p-6 bg-cover bg-center h-full w-full relative" 
                  style={{ backgroundImage: "url('https://picsum.photos/seed/shop/800/600')" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e22] via-[#1a2e22]/40 to-transparent"></div>
                  {/* Floating UI Elements */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                      <div className="min-w-[140px] flex-1 rounded-xl bg-[#112217]/90 p-4 backdrop-blur border border-border-dark shadow-2xl">
                        <p className="text-[10px] uppercase font-black text-text-secondary tracking-widest mb-1">Vendas Hoje</p>
                        <p className="text-xl font-black text-white">12.400 MT</p>
                      </div>
                      <div className="min-w-[140px] flex-1 rounded-xl bg-[#112217]/90 p-4 backdrop-blur border border-border-dark shadow-2xl">
                        <p className="text-[10px] uppercase font-black text-text-secondary tracking-widest mb-1">Fiados Pendentes</p>
                        <p className="text-xl font-black text-orange-400">4.550 MT</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 z-20 rounded-2xl bg-surface-dark border border-border-dark p-5 shadow-2xl hidden sm:block">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/20">
                    <span className="material-symbols-outlined text-2xl">task_alt</span>
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">Sincronização OK</p>
                    <p className="text-xs text-text-secondary">Seus dados estão seguros.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Restante das seções (Benefícios, Funcionalidades, etc) permanecem as mesmas mas com padding top ajustado se necessário */}
      <section className="bg-surface-dark py-24 border-y border-border-dark scroll-mt-16" id="beneficios">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 md:text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
              Feito para o seu dia a dia
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Gerenciar uma mercearia exige agilidade. Resolvemos os gargalos que te impedem de crescer.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-3xl bg-[#112217] p-10 transition-all hover:-translate-y-2 hover:shadow-2xl border border-border-dark hover:border-primary/50">
              <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <span className="material-symbols-outlined text-4xl">book</span>
              </div>
              <h3 className="mb-3 text-2xl font-black text-white">Fiado Digital</h3>
              <p className="text-text-secondary leading-relaxed">
                Chega de cadernos perdidos. Registre fiados por cliente, com data de vencimento e histórico completo.
              </p>
            </div>
            <div className="group relative overflow-hidden rounded-3xl bg-[#112217] p-10 transition-all hover:-translate-y-2 hover:shadow-2xl border border-border-dark hover:border-primary/50">
              <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <span className="material-symbols-outlined text-4xl">wifi_off</span>
              </div>
              <h3 className="mb-3 text-2xl font-black text-white">100% Offline</h3>
              <p className="text-text-secondary leading-relaxed">
                A internet caiu? O sistema continua funcionando normalmente. Os dados sincronizam sozinhos quando a rede volta.
              </p>
            </div>
            <div className="group relative overflow-hidden rounded-3xl bg-[#112217] p-10 transition-all hover:-translate-y-2 hover:shadow-2xl border border-border-dark hover:border-primary/50">
              <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <span className="material-symbols-outlined text-4xl">trending_up</span>
              </div>
              <h3 className="mb-3 text-2xl font-black text-white">Lucro Real</h3>
              <p className="text-xl font-normal text-text-secondary leading-relaxed">
                Saiba exatamente quanto você ganhou no fim do dia, descontando o custo dos produtos e as despesas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-dark bg-[#0d1c12] pt-20 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined">storefront</span>
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">MerceariaPro</span>
          </div>
          <p className="text-text-secondary text-sm max-w-md mx-auto mb-10">
            A plataforma líder em Moçambique para modernização de pequenos e médios varejos.
          </p>
          <div className="flex justify-center gap-8 mb-12">
             <a href="#" className="text-gray-500 hover:text-white transition-colors">Facebook</a>
             <a href="#" className="text-gray-500 hover:text-white transition-colors">WhatsApp</a>
             <a href="#" className="text-gray-500 hover:text-white transition-colors">Suporte</a>
          </div>
          <div className="pt-10 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">
            © 2024 MerceariaPro Moçambique • Todos os direitos reservados
          </div>
        </div>
      </footer>
    </div>
  );
};
