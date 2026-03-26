import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle, MapPin, Instagram, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { SalonSettings } from '../types';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SalonSettings | null>(null);
  const location = useLocation();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'salon'), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as SalonSettings);
      }
    });
    return () => unsub();
  }, []);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'À Propos', path: '/a-propos' },
    { name: 'Services', path: '/services' },
    { name: 'Galerie', path: '/galerie' },
    { name: 'Tarifs', path: '/tarifs' },
    { name: 'Contact', path: '/contact' },
  ];

  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAdminPage) return <Outlet />;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-serif font-bold tracking-tight text-primary">
                {settings?.name || 'Salon de Beauté Saly'}
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium uppercase tracking-widest hover:text-primary transition-colors ${
                    location.pathname === link.path ? 'text-primary border-b-2 border-primary' : 'text-stone-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-stone-600 hover:text-primary p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-stone-100 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-4 text-base font-medium text-stone-600 hover:text-primary hover:bg-stone-50 rounded-lg"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-serif text-white mb-6">{settings?.name || 'Salon de Beauté Saly'}</h3>
              <p className="text-stone-400 leading-relaxed max-w-sm">
                {settings?.description || 'Votre destination beauté à Saly. Coiffure, soins et esthétique dans un cadre moderne et accueillant.'}
              </p>
              <div className="flex space-x-4 mt-8">
                <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
                <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-serif text-white mb-6">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <MapPin size={18} className="mt-1 text-primary" />
                  <span>{settings?.address || 'Saly, Sénégal'}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone size={18} className="text-primary" />
                  <span>{settings?.phone || '+221 00 000 00 00'}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <MessageCircle size={18} className="text-primary" />
                  <span>WhatsApp: {settings?.whatsapp || '+221 76 649 34 41'}</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-serif text-white mb-6">Horaires</h4>
              <ul className="space-y-2">
                {settings?.hours ? (
                  Object.entries(settings.hours).map(([day, time]) => (
                    <li key={day} className="flex justify-between">
                      <span className="capitalize">{day}</span>
                      <span>{time}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex justify-between"><span>Lundi - Samedi</span> <span>09:00 - 19:00</span></li>
                    <li className="flex justify-between"><span>Dimanche</span> <span>Fermé</span></li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-16 pt-8 text-center text-sm text-stone-500">
            &copy; {new Date().getFullYear()} {settings?.name || 'Salon de Beauté Saly'}. Tous droits réservés.
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${settings?.whatsapp?.replace(/\s/g, '') || ''}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
        aria-label="Contactez-nous sur WhatsApp"
      >
        <MessageCircle size={32} fill="currentColor" />
      </a>
    </div>
  );
}
