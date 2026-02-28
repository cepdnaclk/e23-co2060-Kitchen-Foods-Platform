import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChefHat, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Utensils, 
  Heart, 
  ChevronRight, 
  Star,
  Globe,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

// --- Types ---
interface Chef {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  image_url: string;
  verified: boolean;
}

interface Stats {
  active_chefs: number;
  meals_served: number;
  income_generated: number;
}

// --- Components ---

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <span className="text-xl font-serif font-bold tracking-tight text-white">Kitchen Foods</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-sm font-medium text-white/70">
            {['Home', 'Menu', 'Chefs', 'About', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-brand-primary transition-colors">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:flex px-6 py-2.5 bg-brand-primary text-white text-sm font-bold rounded-full items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-primary/20">
              Order Now
            </button>
            
            <button 
              className="md:hidden text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <Utensils size={24} /> : <ChefHat size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-dark border-b border-white/5 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {['Home', 'Menu', 'Chefs', 'About', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  className="text-lg font-serif text-white/70 hover:text-brand-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl">
                Order Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const headline = "Savor Every Moment with Every Bite";
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-brand-dark">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={container}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-serif font-bold leading-[1.2] mb-6 text-white flex flex-wrap"
            >
              {headline.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  variants={child}
                  className="mr-3"
                >
                  {word === "Every" && index === 5 ? (
                    <span className="text-brand-primary italic">Every</span>
                  ) : word === "Bite" ? (
                    <span className="text-brand-primary italic">Bite</span>
                  ) : (
                    word
                  )}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p 
              variants={child}
              className="text-base md:text-lg text-white/60 mb-8 max-w-md leading-relaxed"
            >
              Experience gourmet dining crafted with passion, fresh ingredients, and unforgettable flavors.
            </motion.p>
            
            <motion.div 
              variants={child}
              className="flex flex-wrap gap-6 mb-12"
            >
              <button className="px-8 py-4 bg-brand-primary text-white rounded-full font-bold flex items-center gap-3 hover:shadow-2xl hover:shadow-brand-primary/40 transition-all group">
                Find Food Now
                <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center">
                  <ArrowRight size={16} className="-rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </button>
            </motion.div>
          </motion.div>

          {/* Decorative Arrow */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute top-1/4 -right-12 hidden xl:block"
          >
            <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/20">
              <path d="M10 10C40 10 60 40 110 70" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M105 70L112 72L110 65" stroke="currentColor" strokeWidth="2" />
            </svg>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          className="relative flex justify-center lg:justify-end lg:-mt-10"
        >
          <div className="relative w-full max-w-[500px] aspect-square">
            {/* Plate Shadow */}
            <div className="absolute inset-10 bg-black/60 blur-[80px] rounded-full"></div>
            
            {/* Main Plate Image */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
              className="relative z-10 w-full h-full rounded-full overflow-hidden border-[12px] border-white/5 shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1000" 
                alt="Savory Gourmet Steak"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Floating Garnish/Seeds Effect */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [0, -20, 0],
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{ 
                    duration: 3 + Math.random() * 2, 
                    repeat: Infinity, 
                    delay: Math.random() * 2 
                  }}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{ 
                    top: `${Math.random() * 100}%`, 
                    left: `${Math.random() * 100}%` 
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};


const ChefCard = ({ chef }: { chef: Chef }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group glass rounded-[40px] overflow-hidden hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500"
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={chef.image_url} 
          alt={chef.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        {chef.verified && (
          <div className="absolute top-6 right-6 bg-brand-primary px-4 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold text-white shadow-lg">
            <ShieldCheck size={14} />
            Verified
          </div>
        )}
      </div>
      <div className="p-8">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-serif font-bold text-white">{chef.name}</h3>
          <div className="flex items-center gap-1 text-brand-primary">
            <Star size={18} className="fill-current" />
            <span className="font-bold text-white">{chef.rating}</span>
          </div>
        </div>
        <p className="text-white/50 text-sm mb-6">{chef.specialty}</p>
        <button className="w-full py-4 bg-white/5 text-white font-bold rounded-2xl group-hover:bg-brand-primary transition-all flex items-center justify-center gap-2">
          View Menu
          <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
};

const DiscoverySlider = ({ chefs }: { chefs: Chef[] }) => {
  return (
    <section className="py-32 bg-brand-dark relative overflow-hidden text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <span className="text-brand-primary font-mono text-xs uppercase tracking-[0.3em] mb-4 block">Our Culinary Artists</span>
            <h2 className="text-5xl font-serif font-bold">Discover Local Talent</h2>
          </div>
          <button className="text-white font-bold flex items-center gap-2 hover:gap-4 transition-all group">
            View All Chefs <ArrowRight size={20} className="text-brand-primary group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {chefs.map((chef) => (
            <div key={chef.id}>
              <ChefCard chef={chef} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      icon: <Utensils size={32} />,
      title: "Discover",
      desc: "Browse verified local chefs in your neighborhood.",
      color: "bg-white/5 text-brand-primary"
    },
    {
      icon: <Heart size={32} />,
      title: "Customize",
      desc: "Choose spice levels and portions just for you.",
      color: "bg-white/5 text-brand-primary"
    },
    {
      icon: <ShieldCheck size={32} />,
      title: "Secure Pay",
      desc: "Fast checkout with military-grade encryption.",
      color: "bg-white/5 text-brand-primary"
    },
    {
      icon: <ShoppingBag size={32} />,
      title: "Pick Up",
      desc: "Grab your meal fresh from a kitchen within 10km.",
      color: "bg-white/5 text-brand-primary"
    }
  ];

  return (
    <section className="py-32 bg-brand-dark/50 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <span className="text-brand-primary font-mono text-xs uppercase tracking-[0.3em] mb-4 block">The Process</span>
          <h2 className="text-5xl font-serif font-bold text-white mb-6">The Self-Pickup Journey</h2>
          <p className="text-white/40 max-w-2xl mx-auto">Simple, secure, and community-driven. We've streamlined every step to ensure you get the best home-cooked experience.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-10">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative p-10 glass rounded-[40px] text-center group hover:border-brand-primary/30 transition-colors"
            >
              <div className={`w-20 h-20 ${step.color} rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform`}>
                {step.icon}
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-4">{step.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MenuSection = () => {
  const categories = ["All", "Main Course", "Appetizers", "Desserts", "Drinks"];
  const [activeTab, setActiveTab] = useState("All");

  const menuItems = [
    { id: 1, name: "Grilled Salmon", price: "$24", category: "Main Course", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=400" },
    { id: 2, name: "Truffle Pasta", price: "$18", category: "Main Course", image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=400" },
    { id: 3, name: "Caesar Salad", price: "$12", category: "Appetizers", image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=400" },
    { id: 4, name: "Chocolate Lava", price: "$9", category: "Desserts", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=400" },
  ];

  const filteredItems = activeTab === "All" ? menuItems : menuItems.filter(item => item.category === activeTab);

  return (
    <section id="menu" className="py-32 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="text-brand-primary font-mono text-xs uppercase tracking-[0.3em] mb-4 block">Our Menu</span>
          <h2 className="text-5xl font-serif font-bold text-white mb-8">Exquisite Flavors</h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${
                  activeTab === cat 
                    ? "bg-brand-primary text-white" 
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group glass p-4 rounded-[32px]"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex justify-between items-center px-2">
                  <div>
                    <h4 className="text-white font-bold">{item.name}</h4>
                    <p className="text-white/40 text-xs">{item.category}</p>
                  </div>
                  <span className="text-brand-primary font-bold">{item.price}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    { id: 1, name: "Sarah Johnson", role: "Food Critic", text: "The best home-cooked meal I've had in years. Truly authentic and full of love.", avatar: "https://i.pravatar.cc/150?u=sarah" },
    { id: 2, name: "Michael Chen", role: "Local Resident", text: "Convenient, healthy, and supports local talent. A game changer for my weekly dinners.", avatar: "https://i.pravatar.cc/150?u=michael" },
  ];

  return (
    <section className="py-32 bg-brand-dark/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-brand-primary font-mono text-xs uppercase tracking-[0.3em] mb-4 block">Testimonials</span>
            <h2 className="text-5xl font-serif font-bold text-white mb-8">What Our Community Says</h2>
            <p className="text-white/40 mb-12 max-w-md">Hear from our satisfied foodies and local chefs who have joined the Kitchen Foods family.</p>
            <button className="px-8 py-4 border border-white/10 rounded-full text-white font-bold hover:bg-white hover:text-black transition-all">
              Read All Stories
            </button>
          </div>
          
          <div className="space-y-8">
            {reviews.map((review) => (
              <motion.div 
                key={review.id}
                whileHover={{ x: 10 }}
                className="glass p-8 rounded-[40px] flex gap-6 items-start"
              >
                <img src={review.avatar} alt={review.name} className="w-16 h-16 rounded-2xl object-cover" />
                <div>
                  <p className="text-white/70 italic mb-4">"{review.text}"</p>
                  <h4 className="text-white font-bold">{review.name}</h4>
                  <p className="text-brand-primary text-xs font-mono uppercase tracking-widest">{review.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
const Counter = ({ value, label, suffix = "" }: { value: number, label: string, suffix?: string }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="text-center">
      <div className="text-5xl font-serif font-bold text-brand-primary mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-stone-500 font-medium uppercase tracking-wider text-xs">{label}</div>
    </div>
  );
};

const ImpactCounter = ({ stats }: { stats: Stats | null }) => {
  if (!stats) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12">
          <Counter value={stats.active_chefs} label="Active Chefs" />
          <Counter value={stats.meals_served} label="Healthy Meals Served" />
          <Counter value={stats.income_generated} label="Income for Local Women" suffix="+" />
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white">
                <ChefHat size={24} />
              </div>
              <span className="text-2xl font-bold font-serif tracking-tight">Kitchen Foods</span>
            </div>
            <p className="text-stone-400 max-w-sm mb-8">
              Empowering local women through authentic culinary heritage. Join our community and taste the love in every bite.
            </p>
            <div className="flex gap-4">
              {/* Social Icons Placeholder */}
              <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-brand-primary transition-colors cursor-pointer">
                <Globe size={20} />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-stone-400">
              <li><a href="#" className="hover:text-white transition-colors">Find Chefs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chef Verification</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Safety Standards</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-stone-400">
              <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Impact Report</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-6 text-stone-500 text-sm">
          <p>© 2026 Kitchen Foods. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SplashScreen = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
      className="fixed inset-0 z-[100] bg-brand-dark flex flex-col items-center justify-center overflow-hidden"
    >
      <motion.div
        key="logo-reveal"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "backOut" }}
        className="relative flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2
          }}
          className="w-24 h-24 bg-brand-primary rounded-3xl flex items-center justify-center text-white shadow-2xl mb-8"
        >
          <ChefHat size={48} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-serif font-bold tracking-tight text-white mb-2">Kitchen Foods</h1>
          <div className="flex items-center justify-center gap-2">
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-brand-primary rounded-full"
            />
            <p className="text-white/40 font-mono text-xs uppercase tracking-[0.3em]">Excellence Loading</p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chefsRes, statsRes] = await Promise.all([
          fetch('/api/chefs'),
          fetch('/api/stats'),
          new Promise(resolve => setTimeout(resolve, 2500)) // Ensure splash shows for at least 2.5s
        ]);
        const chefsData = await chefsRes.json();
        const statsData = await statsRes.json();
        setChefs(chefsData);
        setStats(statsData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
        setTimeout(() => setShowSplash(false), 500);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      <AnimatePresence>
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>

      {!showSplash && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="min-h-screen"
        >
          <Navbar />
          <Hero />
          <DiscoverySlider chefs={chefs} />
          <MenuSection />
          <HowItWorks />
          <Testimonials />
          <ImpactCounter stats={stats} />
          <Footer />
        </motion.div>
      )}
    </div>
  );
}

