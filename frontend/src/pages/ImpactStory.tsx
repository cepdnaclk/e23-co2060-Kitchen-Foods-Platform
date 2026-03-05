import React from 'react';
import { motion } from 'motion/react';
import { Heart, Users, TrendingUp, ChefHat, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ImpactStory: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="pt-32 pb-24 bg-brand-cream min-h-screen text-stone-900">
            {/* Header Section */}
            <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center mb-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-stone-900/5 text-brand-primary mb-8"
                >
                    <Heart size={36} />
                </motion.div>
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-brand-primary font-mono text-sm uppercase tracking-[0.3em] mb-4 block font-bold"
                >
                    Our Mission
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-8"
                >
                    Empowering Homes.<br />
                    <span className="italic text-brand-primary">Elevating Lives.</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto"
                >
                    Kitchen Foods isn't just about sharing incredible culinary heritage. It’s a movement to create financial independence for housewives and unemployed women across the country.
                </motion.p>
            </div>

            {/* Main Content Images */}
            <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-24">
                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="rounded-[40px] overflow-hidden aspect-[4/3] relative group"
                    >
                        <img
                            src="/images/chef_impact_1.png"
                            alt="Woman cooking in kitchen"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="rounded-[40px] overflow-hidden aspect-[4/3] relative group hidden md:block"
                    >
                        <img
                            src="/images/chef_impact_2.png"
                            alt="Hands preparing fresh food"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    </motion.div>
                </div>
            </div>

            {/* Article Body */}
            <div className="max-w-3xl mx-auto px-6 lg:px-12">
                <article className="prose prose-lg prose-stone max-w-none">
                    <p className="text-xl leading-relaxed text-stone-600 mb-8 font-medium">
                        Every day, millions of women pour their heart, culture, and generations of culinary secrets into the meals they prepare for their families. Yet, this labor of love is rarely recognized as the highly skilled economic driver that it truly is.
                    </p>

                    <h2 className="text-3xl font-serif font-bold text-stone-900 mt-16 mb-6">A Platform Built for Independence</h2>
                    <p className="text-lg leading-relaxed text-stone-600 mb-8">
                        We started Kitchen Foods to bridge the gap between incredible, authentic home cooking and the people who crave it. But our underlying mission is deeply personal: we want to transform kitchens from spaces of unpaid labor into launchpads for female entrepreneurship.
                    </p>
                    <p className="text-lg leading-relaxed text-stone-600 mb-12">
                        By providing an easy-to-use digital storefront, logistics support, and marketing, housewives can immediately begin generating income. They set their own hours, decide their own menus, and run their businesses entirely from the comfort of their homes.
                    </p>

                    {/* Impact Stats */}
                    <div className="grid sm:grid-cols-3 gap-6 my-16">
                        <div className="bg-white p-8 rounded-3xl border border-stone-900/10 text-center shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto mb-4">
                                <Users size={24} />
                            </div>
                            <div className="text-4xl font-bold font-serif text-stone-900 mb-2">42</div>
                            <div className="text-sm font-bold text-stone-500 uppercase tracking-widest">Women Onboarded</div>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-stone-900/10 text-center shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto mb-4">
                                <TrendingUp size={24} />
                            </div>
                            <div className="text-4xl font-bold font-serif text-stone-900 mb-2">LKR 350k</div>
                            <div className="text-sm font-bold text-stone-500 uppercase tracking-widest">Income Generated</div>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-stone-900/10 text-center shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto mb-4">
                                <ChefHat size={24} />
                            </div>
                            <div className="text-4xl font-bold font-serif text-stone-900 mb-2">1,250+</div>
                            <div className="text-sm font-bold text-stone-500 uppercase tracking-widest">Meals Shared</div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-serif font-bold text-stone-900 mt-16 mb-6">Changing the Narrative</h2>
                    <p className="text-lg leading-relaxed text-stone-600 mb-8">
                        Many of our chefs are mothers or individuals previously classified as "unemployed." Today, they are registered micro-business owners. This financial autonomy brings profound changes beyond just supplementary income—it fosters confidence, community respect, and a protective financial safety net for their families.
                    </p>

                    <blockquote className="border-l-4 border-brand-primary pl-6 py-2 my-12 bg-white/50 rounded-r-2xl">
                        <p className="text-2xl font-serif text-stone-900 italic mb-4">
                            "Before Kitchen Foods, my cooking was just a chore. Now, it's my career. Being able to contribute financially without leaving my children has changed our lives."
                        </p>
                        <footer className="text-sm font-bold uppercase tracking-wider text-brand-primary">— Chef Piyawathi</footer>
                    </blockquote>

                    <p className="text-lg leading-relaxed text-stone-600 mb-8">
                        When you order from Kitchen Foods, you aren't just getting an incredibly delicious, customized meal. You are directly participating in the economic empowerment of a woman in your community.
                    </p>
                </article>

                {/* Call to Action */}
                <div className="mt-20 p-12 bg-stone-900 rounded-[40px] text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    </div>
                    <h3 className="text-3xl font-serif font-bold mb-6 relative z-10">Know someone who loves to cook?</h3>
                    <p className="text-white/60 mb-8 max-w-lg mx-auto relative z-10">
                        Help us grow our community. If you know a talented home cook looking to turn their passion into income, encourage them to apply.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-4 bg-brand-primary text-white rounded-full font-bold flex items-center gap-3 hover:shadow-2xl hover:shadow-brand-primary/40 transition-all group mx-auto relative z-10"
                    >
                        Become a Chef
                        <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center">
                            <ArrowRight size={16} className="-rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};
