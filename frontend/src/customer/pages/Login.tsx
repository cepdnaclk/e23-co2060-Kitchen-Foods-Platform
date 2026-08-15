// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
// Split-screen auth page: branding on the left, the sign-in / sign-up form
// on the right. This route renders WITHOUT the Navbar/Footer layout so the
// page feels like its own destination.
// ---------------------------------------------------------------------------

import React from 'react';
import { BrandingPanel } from '../components/login/BrandingPanel';
import { AuthForm } from '../components/login/AuthForm';

export const Login: React.FC = () => (
  <div
    className="relative min-h-screen w-full flex bg-brand-cream text-stone-900 overflow-hidden"
    style={{ background: 'linear-gradient(135deg, #fdf8f3 0%, #f5f0e8 50%, #f0ebe0 100%)' }}
  >
    {/* Ambient blobs — same language as the Hero section */}
    <div
      className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-25 pointer-events-none"
      style={{ background: 'radial-gradient(circle, #F27D26 0%, transparent 70%)', filter: 'blur(80px)' }}
    />
    <div
      className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
      style={{ background: 'radial-gradient(circle, #d4521a 0%, transparent 70%)', filter: 'blur(100px)' }}
    />

    <BrandingPanel />
    <AuthForm />
  </div>
);
