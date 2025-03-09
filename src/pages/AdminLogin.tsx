import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Mail, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/admin');
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      navigate('/admin');
      toast.success('Erfolgreich angemeldet');
    } catch (error: any) {
      console.error('Error logging in:', error);
      setError('Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.');
      toast.error('Anmeldung fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#16181f]/60 backdrop-blur-md rounded-lg p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Admin Login
        </h1>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center text-red-500">
            <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-2">
              E-Mail
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a1c25] text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-300 mb-2">
              Passwort
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1a1c25] text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#14A79D] to-[#EBA530] text-white py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-[#14A79D]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Anmeldung...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Als Admin anmelden
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;