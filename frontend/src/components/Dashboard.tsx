import React, { useContext, useState } from 'react';
import { Plus, Calendar, MapPin, Users, ChevronRight, Search, Utensils, Coffee, Leaf, IceCream, Soup, CheckSquare } from 'lucide-react';
import { AppContext, Request } from './Layout';
import { RequestForm } from './RequestForm';

export const Dashboard: React.FC = () => {
  const { requests, setView, setSelectedRequest, addRequest } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleRequestClick = (req: Request) => {
    setSelectedRequest(req);
    setView('request-details');
  };

  const categories = [
    { id: 'rice-curry', name: 'Rice & Curry', icon: Soup, color: 'bg-orange-100 text-orange-600' },
    { id: 'short-eats', name: 'Short Eats', icon: CheckSquare, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'salads', name: 'Salads', icon: Leaf, color: 'bg-green-100 text-green-600' },
    { id: 'desserts', name: 'Desserts', icon: IceCream, color: 'bg-pink-100 text-pink-600' },
    { id: 'beverages', name: 'Beverages', icon: Coffee, color: 'bg-blue-100 text-blue-600' },
    { id: 'other', name: 'Other', icon: Utensils, color: 'bg-purple-100 text-purple-600' },
  ];

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleFormCancel = () => {
    setSelectedCategory(null);
  };

  const handleFormSubmit = (data: Partial<Request>) => {
    const newRequest: Request = {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title || 'New Request',
      date: data.date || new Date().toISOString().split('T')[0],
      guests: data.guests || 1,
      budget: data.budget || 0,
      status: 'open',
      bids: 0,
      location: 'Current Location', // Defaulting for now
      dietary: data.dietary || [],
      description: data.description
    };
    addRequest(newRequest);
    setSelectedCategory(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12 pb-20">

      {/* Hero Section */}
      <div className="text-center py-8">
        <h1 className="text-5xl md:text-7xl font-black text-neutral-900 tracking-tight mb-8">
          What do you feel like<br />
          <span className="text-orange-600">eating today?</span>
        </h1>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative mb-20">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search for specific food items (e.g. String Hoppers, Lamprais)..."
            className="w-full py-4 pl-12 pr-4 rounded-full border border-neutral-200 shadow-sm focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none text-lg transition-all"
          />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all group
                                ${selectedCategory === cat.name
                  ? 'bg-neutral-900 border-neutral-900 text-white shadow-xl scale-105 ring-4 ring-neutral-100 z-10'
                  : 'bg-white border-neutral-100 shadow-sm hover:shadow-md hover:border-orange-200 text-neutral-900'
                }
                            `}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-transform ${selectedCategory === cat.name ? 'bg-white/20 text-white' : `${cat.color} group-hover:scale-110`
                }`}>
                <cat.icon size={24} />
              </div>
              <span className="font-medium">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Section: Toggle between Form and List */}
      <div>
        {selectedCategory ? (
          <div className="max-w-4xl mx-auto">
            <RequestForm
              category={selectedCategory}
              onCancel={handleFormCancel}
              onSubmit={handleFormSubmit}
            />
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">Your Active Requests</h2>
            </div>

            <div className="grid gap-4">
              {requests.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-neutral-300">
                  <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                    <Calendar size={24} />
                  </div>
                  <h3 className="text-base font-medium text-neutral-900">No active requests</h3>
                  <p className="text-sm text-neutral-500 mt-1">Select a category above to create one!</p>
                </div>
              ) : (
                requests.map((req) => (
                  <div
                    key={req.id}
                    onClick={() => handleRequestClick(req)}
                    className="bg-white p-6 rounded-xl border border-neutral-200 hover:border-orange-200 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-neutral-900 group-hover:text-orange-600 transition-colors">{req.title}</h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide
                        ${req.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>
                            {req.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            {new Date(req.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users size={14} />
                            {req.guests} Guests
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin size={14} />
                            {req.location}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-neutral-900">{req.bids}</div>
                          <div className="text-xs text-neutral-500 uppercase font-medium tracking-wide">Active Bids</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-neutral-50 group-hover:bg-orange-50 flex items-center justify-center text-neutral-400 group-hover:text-orange-600 transition-colors">
                          <ChevronRight size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

