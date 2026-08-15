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
  <div className="min-h-screen w-full flex bg-brand-cream text-stone-900">
    <BrandingPanel />
    <AuthForm />
  </div>
);
