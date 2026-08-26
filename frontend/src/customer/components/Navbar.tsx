// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------
// Fixed top navigation bar. Shows the brand, desktop links (Home / Menu /
// Chefs / About / Contact), and either the user menu (when logged in) or a
// "Login / Sign Up" button. Includes an animated mobile drawer.
//
// The logged-in user is read from localStorage ("user", set at login) and
// refreshed on every route change so the avatar/name stay in sync.
// ---------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChefHat, Utensils } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserMenu } from './UserMenu';

interface User {
  uid: string;
  full_name: string;
  email: string;
  role: string;
}

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Sync the user from localStorage whenever the route changes.
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setUser(null);
      return;
    }
    try {
      const stored = localStorage.getItem('user');
      setUser(stored ? JSON.parse(stored) : null);
    } catch {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  /**
   * Handle in-page anchor links (e.g. "#menu"). If we're already on the
   * homepage we smooth-scroll; otherwise we navigate home first and let
   * the Layout component handle the hash.
   */
  const handleNavClick = (e: React.MouseEvent<HTMLElement>, hash: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/' + hash);
    } else {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-cream/80 backdrop-blur-md border-b border-stone-900/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xl font-serif font-bold tracking-tight text-stone-900">
              Kitchen Foods
            </Link>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10 text-sm font-medium text-stone-900/70">
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <a href="#menu" onClick={(e) => handleNavClick(e, '#menu')} className="hover:text-brand-primary transition-colors cursor-pointer">Menu</a>
            <Link to="/impact" className="hover:text-brand-primary transition-colors">Chefs</Link>
            <a href="#how-it-works" onClick={(e) => handleNavClick(e, '#how-it-works')} className="hover:text-brand-primary transition-colors cursor-pointer">About</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Contact</a>
          </div>

          {/* Right side: auth state + mobile toggle */}
          <div className="flex items-center gap-4">
            {user ? (
              <UserMenu user={user} onLogout={handleLogout} />
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex px-6 py-2.5 text-brand-primary border-2 border-brand-primary text-sm font-bold rounded-full items-center gap-2 hover:bg-brand-primary hover:text-white active:scale-95 transition-all"
              >
                Login / Sign Up
              </Link>
            )}

            <button
              className="md:hidden text-stone-900 p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <Utensils size={24} /> : <ChefHat size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-cream border-b border-stone-900/5 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-serif text-stone-900/70 hover:text-brand-primary">Home</Link>
              <a href="#menu" onClick={(e) => handleNavClick(e, '#menu')} className="text-lg font-serif text-stone-900/70 hover:text-brand-primary cursor-pointer">Menu</a>
              <Link to="/impact" onClick={() => setIsMenuOpen(false)} className="text-lg font-serif text-stone-900/70 hover:text-brand-primary">Chefs</Link>
              <a href="#how-it-works" onClick={(e) => handleNavClick(e, '#how-it-works')} className="text-lg font-serif text-stone-900/70 hover:text-brand-primary cursor-pointer">About</a>

              {user ? (
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-stone-900/5 bg-white/60 active:scale-[0.98] transition-transform"
                >
                  <span className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold">
                    {user.full_name.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase() || 'U'}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-stone-900 truncate">{user.full_name}</p>
                    <p className="text-xs text-stone-500 truncate">{user.email}</p>
                  </div>
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-4 border-2 border-brand-primary text-brand-primary text-center font-bold rounded-2xl"
                >
                  Login / Sign Up
                </Link>
              )}

              <button onClick={(e) => handleNavClick(e, '#menu')} className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl">
                Order Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
