import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { GalleryImage } from '../types';
import { X, Maximize2 } from 'lucide-react';

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      const querySnapshot = await getDocs(collection(db, 'gallery'));
      setImages(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage)));
      setLoading(false);
    };
    fetchImages();
  }, []);

  const categories = ['Tous', ...Array.from(new Set(images.map(img => img.category)))];

  const filteredImages = activeCategory === 'Tous' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  return (
    <div className="py-20">
      {/* Header */}
      <section className="bg-primary py-24 text-white text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl mb-6">Notre Galerie</h1>
          <p className="text-xl text-white/80 font-light">Découvrez nos réalisations et l'ambiance de notre salon.</p>
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

      {/* Gallery Grid */}
      <section className="py-24 bg-secondary min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode='popLayout'>
                {filteredImages.map((img) => (
                  <motion.div
                    key={img.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-2xl transition-all"
                    onClick={() => setSelectedImage(img)}
                  >
                    <img 
                      src={img.imageUrl} 
                      alt={img.title || 'Galerie'} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur p-4 rounded-full text-white">
                        <Maximize2 size={24} />
                      </div>
                    </div>
                    {img.title && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white translate-y-full group-hover:translate-y-0 transition-transform">
                        <p className="text-sm font-medium">{img.title}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && filteredImages.length === 0 && (
            <div className="text-center py-20">
              <p className="text-stone-500 text-lg">Aucune photo trouvée dans cette catégorie.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors p-2"
              onClick={() => setSelectedImage(null)}
            >
              <X size={40} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage.imageUrl}
              alt={selectedImage.title || 'Galerie'}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              referrerPolicy="no-referrer"
            />
            {selectedImage.title && (
              <div className="absolute bottom-8 left-0 right-0 text-center text-white">
                <p className="text-xl font-serif">{selectedImage.title}</p>
                <p className="text-sm text-white/60 uppercase tracking-widest mt-2">{selectedImage.category}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
