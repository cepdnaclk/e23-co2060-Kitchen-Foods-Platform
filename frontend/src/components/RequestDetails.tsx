import React, { useContext, useState } from 'react';
import { ArrowLeft, Star, Clock, Check, MoreHorizontal, MessageCircle } from 'lucide-react';
import { AppContext, MOCK_BIDS, ChefBid } from './Layout';
import { motion, AnimatePresence } from 'motion/react';

export const RequestDetails: React.FC = () => {
  const { selectedRequest, setView } = useContext(AppContext);
  const [hoveredChef, setHoveredChef] = useState<string | null>(null);

  const handleAccept = (chefName: string) => {
    // In a real app, this would make an API call
    alert(`You have accepted ${chefName}'s bid! The chef will be notified.`);
    setView('dashboard');
  };

  if (!selectedRequest) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={() => setView('dashboard')}
        className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-6 font-medium text-sm"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Request Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 sticky top-24">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">{selectedRequest.title}</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-500">Status</span>
                <span className="font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase text-xs tracking-wide">{selectedRequest.status}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-500">Date</span>
                <span className="font-medium text-neutral-900">{new Date(selectedRequest.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-500">Guests</span>
                <span className="font-medium text-neutral-900">{selectedRequest.guests}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-500">Budget</span>
                <span className="font-medium text-neutral-900">${selectedRequest.budget}</span>
              </div>
              <div className="pt-2">
                <span className="text-neutral-500 block mb-2">Dietary Requirements</span>
                <div className="flex flex-wrap gap-2">
                  {selectedRequest.dietary.map((d, i) => (
                    <span key={i} className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs">{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Bids List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Received Bids ({MOCK_BIDS.length})</h2>
            <div className="flex gap-2 text-sm text-neutral-500">
              <span>Sort by:</span>
              <select className="bg-transparent font-medium text-neutral-900 border-none outline-none p-0 cursor-pointer">
                <option>Best Match</option>
                <option>Price: Low to High</option>
                <option>Rating: High to Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {MOCK_BIDS.map((bid) => (
              <div 
                key={bid.id}
                className="relative group perspective-1000" // perspective for 3d effect if needed
                onMouseEnter={() => setHoveredChef(bid.id)}
                onMouseLeave={() => setHoveredChef(null)}
              >
                {/* Main Card */}
                <div className="bg-white p-5 rounded-xl border border-neutral-200 hover:border-orange-200 hover:shadow-lg transition-all relative z-10 flex items-start gap-4">
                  <img 
                    src={bid.chefImage} 
                    alt={bid.chefName} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-neutral-900">{bid.chefName}</h3>
                        <div className="flex items-center gap-1 text-orange-500 text-sm font-medium">
                          <Star size={14} fill="currentColor" />
                          {bid.rating}
                          <span className="text-neutral-400 font-normal ml-1">({Math.floor(Math.random() * 50) + 10} reviews)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-neutral-900">${bid.price}</div>
                        <div className="text-xs text-neutral-500">Total Price</div>
                      </div>
                    </div>

                    <p className="text-neutral-600 text-sm mt-3 line-clamp-2">{bid.description}</p>
                    
                    <div className="mt-4 flex items-center gap-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAccept(bid.chefName);
                        }}
                        className="flex-1 bg-neutral-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
                      >
                        Accept Offer
                      </button>
                      <button className="px-3 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-neutral-600 transition-colors">
                        <MessageCircle size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hover Popover - Shows previous meals */}
                <AnimatePresence>
                  {hoveredChef === bid.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 right-0 top-full mt-2 z-20 bg-white p-4 rounded-xl shadow-xl border border-neutral-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-sm text-neutral-900">Recent Creations by {bid.chefName.split(' ')[0]}</h4>
                        <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded-full">
                          Top Rated Chef
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {bid.recentMeals.map((meal, idx) => (
                          <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-neutral-100 relative group/img">
                            <img src={meal} alt="Meal" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex gap-2 flex-wrap">
                        {bid.specialties.map((tag, i) => (
                          <span key={i} className="text-xs border border-neutral-200 px-2 py-1 rounded text-neutral-600 bg-neutral-50">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
