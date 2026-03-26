import React from 'react';
import { motion } from 'motion/react';
import { Award, Users, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function About() {
  return (
    <div className="py-20">
      {/* Header */}
      <section className="bg-primary py-24 text-white text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl mb-6">À Propos de Nous</h1>
          <p className="text-xl text-white/80 font-light">L'excellence au service de votre beauté depuis plus de 10 ans.</p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl mb-8">Notre Histoire</h2>
              <div className="space-y-6 text-stone-600 text-lg leading-relaxed">
                <p>
                  Situé au cœur de Saly, notre salon est né d'une passion pour l'art de la coiffure et des soins esthétiques. Depuis notre ouverture, nous nous efforçons de créer un espace où chaque cliente se sent unique et privilégiée.
                </p>
                <p>
                  Notre salon de beauté est spécialisé dans les soins capillaires et esthétiques. Nous mettons l’accent sur la qualité, l’hygiène et la satisfaction de nos clientes. Au fil des années, nous avons su évoluer avec les tendances tout en gardant nos valeurs fondamentales de proximité et de professionnalisme.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <img src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=400" alt="Salon 1" className="rounded-2xl w-full h-64 object-cover" referrerPolicy="no-referrer" />
              <img src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400" alt="Salon 2" className="rounded-2xl w-full h-64 object-cover mt-8" referrerPolicy="no-referrer" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Nos Valeurs</h2>
            <p className="text-stone-500 max-w-2xl mx-auto">Ce qui nous définit et guide chacune de nos prestations au quotidien.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Award, title: 'Excellence', desc: 'Nous visons la perfection dans chaque détail de nos services.' },
              { icon: ShieldCheck, title: 'Hygiène', desc: 'Un environnement sain et des outils stérilisés pour votre sécurité.' },
              { icon: Users, title: 'Proximité', desc: 'Une écoute attentive pour répondre à vos besoins spécifiques.' },
              { icon: HeartHandshake, title: 'Confiance', desc: 'Bâtir une relation durable avec nos clientes fidèles.' }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl text-center"
              >
                <div className="w-16 h-16 bg-secondary text-primary rounded-full flex items-center justify-center mb-6 mx-auto">
                  <value.icon size={28} />
                </div>
                <h3 className="text-xl mb-3">{value.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-stone-50 p-12 rounded-3xl border border-stone-100">
              <h3 className="text-3xl mb-6 font-serif">Notre Mission</h3>
              <p className="text-stone-600 text-lg leading-relaxed">
                Offrir à chaque femme un moment de détente absolue et des résultats esthétiques qui renforcent sa confiance en elle, en utilisant les meilleures techniques et produits du marché.
              </p>
            </div>
            <div className="bg-primary text-white p-12 rounded-3xl">
              <h3 className="text-3xl mb-6 font-serif">Notre Vision</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Devenir la référence incontournable de la beauté et du bien-être à Saly, reconnue pour notre innovation constante et notre service client irréprochable.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
