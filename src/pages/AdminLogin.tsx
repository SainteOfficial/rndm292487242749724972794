import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Mail, AlertTriangle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/admin');
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/admin');
      toast.success('Erfolgreich angemeldet');
    } catch (error: any) {
      setError('Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.');
      toast.error('Anmeldung fehlgeschlagen');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
      {/* Subtle decorative elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#14A79D]/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-[#EBA530]/3 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.img
            src="/logov2.png"
            alt="Autosmaya"
            className="h-10 mx-auto mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">Admin</h1>
          <p className="text-white/30 text-sm mt-1">Melden Sie sich an um fortzufahren</p>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/8 border border-red-500/15 text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-white/30 text-xs uppercase tracking-wider mb-2">E-Mail</label>
            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${focusedField === 'email' ? 'text-[#14A79D]' : 'text-white/20'}`} />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                placeholder="admin@autosmaya.de"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-[#14A79D]/40 focus:bg-white/[0.04] transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/30 text-xs uppercase tracking-wider mb-2">Passwort</label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${focusedField === 'password' ? 'text-[#14A79D]' : 'text-white/20'}`} />
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-[#14A79D]/40 focus:bg-white/[0.04] transition-all duration-300"
              />
            </div>
          </div>

          <motion.button
            type="submit" disabled={loading}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            className="w-full relative flex items-center justify-center gap-3 px-6 py-4 rounded-xl overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed group mt-2"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#14A79D] to-[#14A79D]/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            {loading ? (
              <div className="relative z-10 flex items-center gap-2 text-white">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                <span className="text-sm font-medium">Anmeldung...</span>
              </div>
            ) : (
              <span className="relative z-10 flex items-center gap-2 text-white text-sm font-semibold">
                <Lock className="w-4 h-4" /> Anmelden <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;