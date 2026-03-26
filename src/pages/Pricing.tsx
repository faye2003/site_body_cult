import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Price } from '../types';
import { Scissors } from 'lucide-react';

export default function Pricing() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      const querySnapshot = await getDocs(collection(db, 'pricing'));
      setPrices(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Price)));
      setLoading(false);
    };
    fetchPrices();
  }, []);

  const categories = Array.from(new Set(prices.map(p => p.category)));

  return (
    <div className="py-20">
      {/* Header */}
      <section className="bg-primary py-24 text-white text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl mb-6">Nos Tarifs</h1>
          <p className="text-xl text-white/80 font-light">Des prix transparents pour des prestations d'exception.</p>
        </motion.div>
      </section>

      {/* Pricing List */}
      <section className="py-24 bg-secondary min-h-[60vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : prices.length > 0 ? (
            <div className="space-y-16">
              {categories.map((cat, catIndex) => (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIndex * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 md:p-12 shadow-sm"
                >
                  <div className="flex items-center space-x-4 mb-10">
                    <div className="w-12 h-12 bg-secondary text-primary rounded-full flex items-center justify-center">
                      <Scissors size={24} />
                    </div>
                    <h2 className="text-3xl font-serif">{cat}</h2>
                  </div>

                  <div className="space-y-6">
                    {prices
                      .filter(p => p.category === cat)
                      .map((price) => (
                        <div key={price.id} className="flex justify-between items-end group">
                          <div className="flex-grow">
                            <h4 className="text-lg font-medium text-stone-800 group-hover:text-primary transition-colors">{price.name}</h4>
                            <div className="border-b border-dotted border-stone-200 flex-grow mx-4 mb-1"></div>
                          </div>
                          <span className="text-xl font-serif text-primary font-bold whitespace-nowrap">
                            {price.price.toLocaleString()} FCFA
                          </span>
                        </div>
                      ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
              <p className="text-stone-500 text-lg">Aucun tarif n'a été ajouté pour le moment.</p>
            </div>
          )}

          <div className="mt-16 text-center">
            <p className="text-stone-500 italic mb-8">
              * Les tarifs peuvent varier selon la longueur et l'épaisseur des cheveux ou la complexité de la prestation.
            </p>
            <a 
              href="https://wa.me/+221000000000" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Demander un devis personnalisé
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
