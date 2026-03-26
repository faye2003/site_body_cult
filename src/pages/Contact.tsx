import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { doc, onSnapshot, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { SalonSettings } from '../types';

export default function Contact() {
  const [settings, setSettings] = useState<SalonSettings | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'salon'), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as SalonSettings);
      }
    });
    return () => unsub();
  }, []);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'messages'), {
        ...data,
        createdAt: serverTimestamp(),
        status: 'unread'
      });
      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-20">
      {/* Header */}
      <section className="bg-primary py-24 text-white text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl mb-6">Contactez-nous</h1>
          <p className="text-xl text-white/80 font-light">Nous sommes à votre écoute pour toute question ou prise de rendez-vous.</p>
        </motion.div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl mb-12">Nos Coordonnées</h2>
              
              <div className="space-y-10">
                <div className="flex items-start space-x-6">
                  <div className="bg-secondary p-4 rounded-2xl text-primary">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-serif mb-2">Adresse</h4>
                    <p className="text-stone-600 leading-relaxed">
                      {settings?.address || 'Saly, Sénégal'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="bg-secondary p-4 rounded-2xl text-primary">
                    <Phone size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-serif mb-2">Téléphone</h4>
                    <p className="text-stone-600 leading-relaxed">
                      {settings?.phone || '+221 00 000 00 00'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="bg-secondary p-4 rounded-2xl text-primary">
                    <Mail size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-serif mb-2">Email</h4>
                    <p className="text-stone-600 leading-relaxed">
                      {settings?.email || 'contact@salonsaly.com'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="bg-secondary p-4 rounded-2xl text-primary">
                    <Clock size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-serif mb-2">Horaires d'ouverture</h4>
                    <ul className="text-stone-600 space-y-1">
                      {settings?.hours ? (
                        Object.entries(settings.hours).map(([day, time]) => (
                          <li key={day} className="flex justify-between w-64">
                            <span className="capitalize">{day}</span>
                            <span>{time}</span>
                          </li>
                        ))
                      ) : (
                        <>
                          <li className="flex justify-between w-64"><span>Lundi - Samedi</span> <span>09:00 - 19:00</span></li>
                          <li className="flex justify-between w-64"><span>Dimanche</span> <span>Fermé</span></li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-8 bg-secondary rounded-3xl">
                <h4 className="text-xl font-serif mb-4 flex items-center space-x-2">
                  <MessageCircle size={24} className="text-[#25D366]" />
                  <span>Besoin d'une réponse rapide ?</span>
                </h4>
                <p className="text-stone-600 mb-6">
                  Contactez-nous directement sur WhatsApp pour une prise de rendez-vous instantanée.
                </p>
                <a 
                  href={`https://wa.me/${settings?.whatsapp?.replace(/\s/g, '') || ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform inline-block"
                >
                  Discuter sur WhatsApp
                </a>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-stone-50 p-10 rounded-3xl border border-stone-100"
            >
              <h3 className="text-3xl mb-8 font-serif">Envoyez-nous un message</h3>
              
              {isSuccess ? (
                <div className="bg-green-50 text-green-700 p-6 rounded-2xl border border-green-100 flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full"><Send size={20} /></div>
                  <p className="font-medium">Merci ! Votre message a été envoyé avec succès. Nous vous répondrons très bientôt.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Nom complet</label>
                    <input 
                      {...register('name', { required: 'Ce champ est requis' })}
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="Votre nom"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Email</label>
                      <input 
                        {...register('email', { 
                          required: 'Ce champ est requis',
                          pattern: { value: /^\S+@\S+$/i, message: 'Email invalide' }
                        })}
                        type="email" 
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="votre@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Téléphone</label>
                      <input 
                        {...register('phone', { required: 'Ce champ est requis' })}
                        type="tel" 
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="+221 ..."
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message as string}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Message</label>
                    <textarea 
                      {...register('message', { required: 'Ce champ est requis' })}
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Comment pouvons-nous vous aider ?"
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message as string}</p>}
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <span>Envoyer le message</span>
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="h-[500px] w-full bg-stone-100">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15467.43852899451!2d-16.9936838!3d14.4443916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xee9288f5f5f5f5f5%3A0x5f5f5f5f5f5f5f5f!2sSaly%2C%20Senegal!5e0!3m2!1sen!2sfr!4v1625000000000!5m2!1sen!2sfr" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Maps Saly"
        ></iframe>
      </section>
    </div>
  );
}
