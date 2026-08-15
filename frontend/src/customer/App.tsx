// ---------------------------------------------------------------------------
// App (customer frontend)
// ---------------------------------------------------------------------------
// Entry point for the customer app. Responsibilities:
//   1. Fetch homepage stats while showing the animated splash screen.
//   2. Define the routes: "/" (home), "/impact" (story), "/login" (auth).
// The home page is a stack of independent section components.
// ---------------------------------------------------------------------------

import { AnimatePresence, motion } from 'motion/react';
import { Route, Routes } from 'react-router-dom';

import { useStats } from './hooks/useStats';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { PromoBanner } from './components/PromoBanner';
import { Recommendations } from './components/Recommendations';
import { MenuCustomization } from './components/menu/MenuCustomization';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { ImpactCounter } from './components/ImpactCounter';
import { SplashScreen } from './components/SplashScreen';

import { ImpactStory } from './pages/ImpactStory';
import { Login } from './pages/Login';

import type { Stats } from './types';

/**
 * Home page — the marketing landing page, assembled from independent
 * section components stacked top-to-bottom.
 */
const Home = ({ stats }: { stats: Stats | null }) => (
  <>
    <Hero />
    <PromoBanner />
    <Recommendations />
    <MenuCustomization />
    <HowItWorks />
    <Testimonials />
    <ImpactCounter stats={stats} />
  </>
);

export default function App() {
  const { stats, loading } = useStats();

  return (
    <div className="min-h-screen">
      {/* Splash screen — visible while stats load (see useStats) */}
      <AnimatePresence>{loading && <SplashScreen key="splash" />}</AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="min-h-screen"
        >
          <Routes>
            {/* Routes wrapped in the shared Navbar + Footer layout */}
            <Route path="/" element={<Layout><Home stats={stats} /></Layout>} />
            <Route path="/impact" element={<Layout><ImpactStory /></Layout>} />

            {/* Standalone route (no Navbar/Footer) */}
            <Route path="/login" element={<Login />} />
          </Routes>
        </motion.div>
      )}
    </div>
  );
}
