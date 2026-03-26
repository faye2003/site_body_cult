import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Service } from '../types';
import { Sparkles } from 'lucide-react';

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const querySnapshot = await getDocs(collection(db, 'services'));
      setServices(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
      setLoading(false);
    };
    fetchServices();
  }, []);

  const categories = ['Tous', ...Array.from(new Set(services.map(s => s.category)))];

  const filteredServices = activeCategory === 'Tous' 
    ? services 
    : services.filter(s => s.category === activeCategory);

  return (
    <div className="py-20">
      {/* Header */}
      <section className="bg-primary py-24 text-white text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl mb-6">Nos Services</h1>
          <p className="text-xl text-white/80 font-light">Découvrez l'ensemble de nos prestations pour sublimer votre beauté.</p>
        </motion.div>
      </section>

      {/* Filter */}
      <section className="py-12 bg-white sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <div className="flex justify-center space-x-4 min-w-max pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-secondary min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
            >
              <AnimatePresence mode='popLayout'>
                {filteredServices.map((service) => (
                  <motion.div
                    key={service.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all group"
                  >
                    <div className="h-64 overflow-hidden relative">
                      <img 
                        src={service.imageUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800'} 
                        alt={service.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-primary">
                        {service.category}
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center space-x-2 mb-4 text-accent">
                        <Sparkles size={18} />
                        <span className="text-xs uppercase tracking-widest font-bold">Prestation Premium</span>
                      </div>
                      <h3 className="text-2xl mb-4">{service.name}</h3>
                      <p className="text-stone-500 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && filteredServices.length === 0 && (
            <div className="text-center py-20">
              <p className="text-stone-500 text-lg">Aucun service trouvé dans cette catégorie.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
