// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------
// Shared page shell for routed pages: Navbar on top, page content in the
// middle, Footer at the bottom. Also handles hash-based smooth scrolling
// (e.g. navigating to "/#menu" from another page).
// ---------------------------------------------------------------------------

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  // After a navigation that carries a #hash, scroll to that element.
  // The small delay lets the page render before we measure the target.
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </>
  );
};
