// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
// Full-height hero section at the top of the homepage. Thin container that
// lays out the two columns: text content (left) and the animated image
// mosaic (right). All visuals live in ./hero/.
// ---------------------------------------------------------------------------

import React from 'react';
import { HeroContent } from './hero/HeroContent';
import { HeroImageMosaic } from './hero/HeroImageMosaic';

export const Hero: React.FC = () => (
  <section
    className="relative min-h-screen flex items-center overflow-hidden"
    style={{ background: 'linear-gradient(135deg, #fdf8f3 0%, #f5f0e8 50%, #f0ebe0 100%)' }}
  >
    {/* Ambient blobs */}
    <div
      className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full opacity-30 pointer-events-none"
      style={{ background: 'radial-gradient(circle, #F27D26 0%, transparent 70%)', filter: 'blur(80px)' }}
    />
    <div
      className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none"
      style={{ background: 'radial-gradient(circle, #d4521a 0%, transparent 70%)', filter: 'blur(100px)' }}
    />

    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-2 gap-16 items-center pt-28 pb-16">
      <HeroContent />
      <HeroImageMosaic />
    </div>
  </section>
);
