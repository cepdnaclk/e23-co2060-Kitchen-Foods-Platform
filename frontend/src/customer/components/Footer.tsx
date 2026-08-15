// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
// Dark site footer with the brand blurb, link columns (Platform / Company)
// and the legal bar. Some links are placeholders ("#") — only /impact is
// wired to a real route.
// ---------------------------------------------------------------------------

import React from 'react';
import { ChefHat, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950 text-stone-400 py-20 border-t border-stone-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand + mission */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
                <ChefHat size={22} />
              </div>
              <span className="text-2xl font-bold font-serif tracking-tight text-white">Kitchen Foods</span>
            </div>
            <p className="text-stone-450 max-w-sm mb-8 leading-relaxed">
              Empowering local women through authentic culinary heritage. Join our community and taste the
              love in every bite.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors cursor-pointer border border-stone-800">
                <Globe size={18} />
              </div>
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="font-bold mb-6 text-white uppercase tracking-wider text-xs">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/impact" className="hover:text-brand-primary transition-colors">Find Chefs</Link></li>
              <li><Link to="/impact" className="hover:text-brand-primary transition-colors">Our Impact</Link></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">How it Works</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Safety Standards</a></li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-bold mb-6 text-white uppercase tracking-wider text-xs">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-brand-primary transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Impact Report</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Careers</a></li>
            </ul>
          </div>
        </div>

        {/* Legal bar */}
        <div className="pt-12 border-t border-stone-900 flex flex-col md:flex-row justify-between items-center gap-6 text-stone-500 text-sm">
          <p>© 2026 Kitchen Foods. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-brand-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
