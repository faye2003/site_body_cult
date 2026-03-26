import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Star, Heart, Sparkles } from 'lucide-react';
import { collection, getDocs, limit, query, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Service, SalonSettings } from '../types';

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<SalonSettings | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      const q = query(collection(db, 'services'), limit(4));
      const querySnapshot = await getDocs(q);
      setServices(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
    };
    fetchServices();

    const unsub = onSnapshot(doc(db, 'settings', 'salon'), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as SalonSettings);
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center text-center px-4">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1920"
            alt="Salon de Beauté"
            className="w-full h-full object-cover brightness-50"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl text-white mb-6 leading-tight">
            Révélez votre beauté naturelle à <span className="text-accent italic">Saly</span>
          </h1>
          <p className="text-xl text-stone-200 mb-10 font-light tracking-wide max-w-2xl mx-auto">
            {settings?.description || 'Coiffure, soins et esthétique dans un cadre moderne et accueillant.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={`https://wa.me/${settings?.whatsapp?.replace(/\s/g, '') || ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center space-x-2"
            >
              <span>Prendre rendez-vous</span>
              <ArrowRight size={18} />
            </a>
            <Link to="/services" className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white hover:text-primary">
              Voir nos services
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Quick Presentation */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary uppercase tracking-[0.3em] text-sm font-semibold mb-4 block">Bienvenue</span>
              <h2 className="text-4xl md:text-5xl mb-8">Votre sanctuaire de bien-être</h2>
              <p className="text-stone-600 text-lg leading-relaxed mb-8">
                Bienvenue dans notre salon de beauté à Saly. Nous vous proposons des services professionnels de coiffure, soins et esthétique dans un cadre moderne et accueillant. Notre équipe passionnée met tout en œuvre pour vous offrir une expérience unique et personnalisée.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="flex items-start space-x-3">
                  <div className="bg-secondary p-2 rounded-lg text-primary"><Star size={20} /></div>
                  <div>
                    <h4 className="font-bold">Qualité</h4>
                    <p className="text-sm text-stone-500">Produits haut de gamme</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-secondary p-2 rounded-lg text-primary"><Heart size={20} /></div>
                  <div>
                    <h4 className="font-bold">Passion</h4>
                    <p className="text-sm text-stone-500">Équipe experte</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800" 
                alt="Intérieur du salon" 
                className="rounded-2xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-8 -left-8 bg-primary text-white p-8 rounded-2xl hidden md:block">
                <p className="text-4xl font-serif mb-1">10+</p>
                <p className="text-sm uppercase tracking-widest opacity-80">Années d'expérience</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-primary uppercase tracking-[0.3em] text-sm font-semibold mb-4 block">Nos Prestations</span>
          <h2 className="text-4xl md:text-5xl mb-16">Sublimez votre style</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.length > 0 ? (
              services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow group"
                >
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-primary group-hover:text-white transition-colors">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-xl mb-4">{service.name}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed mb-6 line-clamp-2">
                    {service.description}
                  </p>
                  <Link to="/services" className="text-primary font-medium flex items-center justify-center space-x-1 hover:space-x-2 transition-all">
                    <span>En savoir plus</span>
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              ))
            ) : (
              // Fallback if no services in DB yet
              ['Coiffure', 'Manucure', 'Pédicure', 'Maquillage'].map((name, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-sm">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-6 mx-auto">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-xl mb-4">{name}</h3>
                  <p className="text-stone-500 text-sm">Services professionnels de {name.toLowerCase()} à Saly.</p>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-16">
            <Link to="/services" className="btn-secondary">
              Voir tous nos services
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=1920" 
            alt="Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl mb-8">Prête pour votre transformation ?</h2>
          <p className="text-xl text-white/80 mb-12 font-light">
            Réservez votre séance dès maintenant et laissez nos experts prendre soin de vous.
          </p>
          <a 
            href={`https://wa.me/${settings?.whatsapp?.replace(/\s/g, '') || ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-accent hover:text-white transition-all inline-block"
          >
            Prendre rendez-vous sur WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
