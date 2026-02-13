import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import PageTransition from './components/PageTransition';

import Home from './pages/Home';
import Showroom from './pages/Showroom';
import CarDetails from './pages/CarDetails';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Gallery from './pages/Gallery';
import Legal from './pages/Legal';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';

import { supabase } from './lib/supabase';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/showroom" element={<PageTransition><Showroom /></PageTransition>} />
        <Route path="/car/:id" element={<PageTransition><CarDetails /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
        <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
        <Route path="/legal" element={<PageTransition><Legal /></PageTransition>} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await supabase.auth.getSession();
      supabase.auth.onAuthStateChange(() => { });
      setTimeout(() => setIsLoading(false), 800);
    };
    init();
  }, []);

  return (
    <>
      {/* Loading screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <img src="/logov2.png" alt="Autosmaya" className="h-12 mb-8" />
              <div className="w-12 h-[1.5px] bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#14A79D] rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="relative min-h-screen bg-[#050505]">
          <Navbar />
          <ScrollToTop />
          <main className="relative z-10">
            <AnimatedRoutes />
          </main>
          <Footer />
          <BackToTop />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0a0a0a',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.04)',
                borderRadius: '12px',
                padding: '14px 16px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
              },
              success: { iconTheme: { primary: '#14A79D', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </div>
      </Router>
    </>
  );
}

export default App;