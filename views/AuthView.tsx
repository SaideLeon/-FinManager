
import React, { useState } from 'react';
import { User } from '../types';
import { Repository } from '../db/repository';

const userRepo = new Repository<User>('users');

interface AuthViewProps {
  onLoginSuccess: (user: User) => void;
  isOnline: boolean;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess, isOnline }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        setMessage({type: 'error', text: 'As senhas não coincidem.'});
        return;
      }
      try {
        const user = await userRepo.save({ name: formData.name, email: formData.email, password: formData.password });
        setMessage({type: 'success', text: 'Conta criada com sucesso!'});
        setTimeout(() => onLoginSuccess(user), 1000);
      } catch (err) {
        setMessage({type: 'error', text: 'Erro ao criar conta.'});
      }
    } else {
      const users = await userRepo.getAll();
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      if (user) {
        onLoginSuccess(user);
      } else {
        setMessage({type: 'error', text: 'Credenciais inválidas ou usuário não encontrado localmente.'});
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background-light dark:bg-background-dark font-display">
      {/* Coluna Esquerda: Branding & Info */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-background-dark border-r border-border-dark flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#13ec5b20] via-transparent to-transparent"></div>
        <div className="relative z-20 flex items-center gap-3 text-white">
          <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
          </div>
          <span className="text-xl font-bold tracking-tight">FinManager</span>
        </div>
        <div className="relative z-20 max-w-lg">
          <h2 className="text-4xl font-extrabold leading-tight mb-4 text-white">
            Tome o controle do seu <span className="text-primary">futuro financeiro</span>.
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Gestão inteligente que funciona em qualquer lugar, com ou sem internet. Seus dados são salvos localmente e sincronizados de forma segura.
          </p>
          <div className="mt-8 flex items-center gap-4">
             <div className="flex -space-x-3">
               {[1,2,3].map(i => <div key={i} className="size-10 rounded-full border-2 border-background-dark bg-surface-highlight"></div>)}
             </div>
             <p className="text-sm text-text-secondary font-medium">Utilizado por centenas de gestores locais.</p>
          </div>
        </div>
        <div className="relative z-20 text-sm text-gray-500">© 2024 FinManager Inc. • PWA & Offline-First</div>
      </div>

      {/* Coluna Direita: Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col bg-background-light dark:bg-surface-dark relative min-h-screen">
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 py-12 overflow-y-auto">
          <div className="w-full max-w-[440px] mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {authMode === 'register' ? 'Crie sua conta' : 'Acesse sua conta'}
              </h1>
              <p className="text-slate-500 dark:text-gray-400">
                {authMode === 'register' ? 'Comece a gerenciar seu negócio hoje.' : 'Bem-vindo de volta! Entre em sua conta.'}
              </p>
            </div>

            <div className="p-1 bg-background-dark/50 border border-border-dark rounded-xl flex shadow-inner">
              <button onClick={() => setAuthMode('login')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${authMode === 'login' ? 'bg-primary text-background-dark shadow-sm' : 'text-gray-400 hover:text-white'}`}>Login</button>
              <button onClick={() => setAuthMode('register')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${authMode === 'register' ? 'bg-primary text-background-dark shadow-sm' : 'text-gray-400 hover:text-white'}`}>Registrar</button>
            </div>

            {message && <div className={`p-4 rounded-xl text-xs font-bold border ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{message.text}</div>}

            <form className="space-y-5" onSubmit={handleAction}>
              {authMode === 'register' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Nome Completo</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 material-symbols-outlined">person</span>
                    <input required className="block w-full rounded-xl border-border-dark bg-input-dark py-3.5 pl-11 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" placeholder="Ex: Ana Souza" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">E-mail</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 material-symbols-outlined">mail</span>
                  <input required type="email" className="block w-full rounded-xl border-border-dark bg-input-dark py-3.5 pl-11 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary" placeholder="seu@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Senha</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 material-symbols-outlined">lock</span>
                  <input required type={showPassword ? 'text' : 'password'} className="block w-full rounded-xl border-border-dark bg-input-dark py-3.5 pl-11 pr-12 text-white focus:border-primary focus:ring-1 focus:ring-primary" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white"><span className="material-symbols-outlined text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span></button>
                </div>
              </div>
              {authMode === 'register' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Confirmar Senha</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 material-symbols-outlined">lock_reset</span>
                    <input required type="password" className="block w-full rounded-xl border-border-dark bg-input-dark py-3.5 pl-11 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" placeholder="Confirme sua senha" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
                  </div>
                </div>
              )}
              <button type="submit" className="w-full py-4 px-4 rounded-xl shadow-lg text-sm font-black text-background-dark bg-primary hover:bg-primary-hover transition-all flex items-center justify-center gap-2 group">
                {authMode === 'register' ? 'CRIAR MINHA CONTA' : 'ACESSAR PAINEL'}
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </form>
            <div className="flex items-center justify-between pt-4">
               <div className="flex items-center gap-2">
                  <div className={`size-2 rounded-full ${isOnline ? 'bg-primary' : 'bg-orange-400'}`}></div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{isOnline ? 'Conectado' : 'Modo Offline'}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
