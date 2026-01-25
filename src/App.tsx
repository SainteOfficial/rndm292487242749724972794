import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import { AnimatedBackground } from './components/AnimatedBackground';
import PageTransition from './components/PageTransition';

// Pages
import Home from './pages/Home';
import Showroom from './pages/Showroom';
import CarDetails from './pages/CarDetails';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Gallery from './pages/Gallery';
import Legal from './pages/Legal';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';

// Supabase
import { supabase } from './lib/supabase';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

// Animated Routes Wrapper
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <Home />
          </PageTransition>
        } />
        <Route path="/showroom" element={
          <PageTransition>
            <Showroom />
          </PageTransition>
        } />
        <Route path="/car/:id" element={
          <PageTransition>
            <CarDetails />
          </PageTransition>
        } />
        <Route path="/contact" element={
          <PageTransition>
            <Contact />
          </PageTransition>
        } />
        <Route path="/faq" element={
          <PageTransition>
            <FAQ />
          </PageTransition>
        } />
        <Route path="/gallery" element={
          <PageTransition>
            <Gallery />
          </PageTransition>
        } />
        <Route path="/legal" element={
          <PageTransition>
            <Legal />
          </PageTransition>
        } />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </AnimatePresence>
  );
};

// Main App Component
function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize app
    const init = async () => {
      // Check auth state
      const { data: { session } } = await supabase.auth.getSession();

      // Auth state listener
      supabase.auth.onAuthStateChange((_event, session) => {
        // Handle auth changes if needed
      });

      // Simulate minimum loading time for smooth transition
      setTimeout(() => setIsLoading(false), 500);
    };

    init();
  }, []);

  // Loading Screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex items-center justify-center">
        <div className="relative">
          {/* Logo */}
          <img
            src="/logov2.png"
            alt="Autosmaya"
            className="h-16 w-auto opacity-0 animate-[fadeIn_0.5s_ease_forwards]"
          />

          {/* Loading indicator */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
            <div className="w-8 h-0.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-[#14A79D] rounded-full animate-[loading_1s_ease_infinite]" />
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fadeIn {
            to { opacity: 1; }
          }
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="relative min-h-screen bg-[#050505]">
        {/* Animated Background */}
        <AnimatedBackground />

        {/* Navigation */}
        <Navbar />

        {/* Scroll Handler */}
        <ScrollToTop />

        {/* Main Content */}
        <main className="relative z-10">
          <AnimatedRoutes />
        </main>

        {/* Footer */}
        <Footer />

        {/* Back to Top */}
        <BackToTop />

        {/* Toast Notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0a0a0a',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '16px',
            },
            success: {
              iconTheme: {
                primary: '#14A79D',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;