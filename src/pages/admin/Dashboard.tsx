import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc, query, orderBy } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { 
  LayoutDashboard, 
  Scissors, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X,
  MessageSquare,
  Clock,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Service, Price, GalleryImage, SalonSettings, ContactMessage } from '../../types';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [services, setServices] = useState<Service[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [settings, setSettings] = useState<SalonSettings | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== 'fayem7409@gmail.com') {
        navigate('/admin');
      }
    });

    // Real-time listeners
    const unsubServices = onSnapshot(collection(db, 'services'), (snap) => {
      setServices(snap.docs.map(d => ({ id: d.id, ...d.data() } as Service)));
    });
    const unsubPrices = onSnapshot(collection(db, 'pricing'), (snap) => {
      setPrices(snap.docs.map(d => ({ id: d.id, ...d.data() } as Price)));
    });
    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snap) => {
      setGallery(snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryImage)));
    });
    const unsubSettings = onSnapshot(doc(db, 'settings', 'salon'), (d) => {
      if (d.exists()) setSettings(d.data() as SalonSettings);
    });
    const unsubMessages = onSnapshot(query(collection(db, 'messages'), orderBy('createdAt', 'desc')), (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage)));
    });

    setLoading(false);

    return () => {
      unsubAuth();
      unsubServices();
      unsubPrices();
      unsubGallery();
      unsubSettings();
      unsubMessages();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'services') {
        if (editingItem) await updateDoc(doc(db, 'services', editingItem.id), formData);
        else await addDoc(collection(db, 'services'), formData);
      } else if (activeTab === 'pricing') {
        if (editingItem) await updateDoc(doc(db, 'pricing', editingItem.id), formData);
        else await addDoc(collection(db, 'pricing'), formData);
      } else if (activeTab === 'gallery') {
        if (editingItem) await updateDoc(doc(db, 'gallery', editingItem.id), formData);
        else await addDoc(collection(db, 'gallery'), formData);
      } else if (activeTab === 'settings') {
        await setDoc(doc(db, 'settings', 'salon'), formData);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({});
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const handleDelete = async (id: string, collectionName: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      try {
        await deleteDoc(doc(db, collectionName, id));
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  const toggleMessageStatus = async (id: string, currentStatus: string) => {
    try {
      await updateDoc(doc(db, 'messages', id), {
        status: currentStatus === 'read' ? 'unread' : 'read'
      });
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const openModal = (item: any = null) => {
    setEditingItem(item);
    setFormData(item || {});
    setIsModalOpen(true);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 text-stone-400 flex flex-col fixed h-full">
        <div className="p-8">
          <h1 className="text-xl font-serif text-white font-bold">Admin Salon</h1>
        </div>
        
        <nav className="flex-grow px-4 space-y-2">
          {[
            { id: 'services', icon: Scissors, label: 'Services' },
            { id: 'pricing', icon: LayoutDashboard, label: 'Tarifs' },
            { id: 'gallery', icon: ImageIcon, label: 'Galerie' },
            { id: 'messages', icon: MessageSquare, label: 'Messages' },
            { id: 'settings', icon: Settings, label: 'Paramètres' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id ? 'bg-primary text-white' : 'hover:bg-stone-800 hover:text-white'
              }`}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-64 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-serif capitalize">{activeTab}</h2>
            <p className="text-stone-500">Gérez le contenu de la page {activeTab}.</p>
          </div>
          {activeTab !== 'settings' && activeTab !== 'messages' && (
            <button 
              onClick={() => openModal()}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Ajouter</span>
            </button>
          )}
        </header>

        {/* Tab Content */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
          {activeTab === 'services' && (
            <table className="w-full text-left">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  <th className="px-6 py-4 font-medium text-stone-500">Image</th>
                  <th className="px-6 py-4 font-medium text-stone-500">Nom</th>
                  <th className="px-6 py-4 font-medium text-stone-500">Catégorie</th>
                  <th className="px-6 py-4 font-medium text-stone-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <img src={s.imageUrl} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    </td>
                    <td className="px-6 py-4 font-medium">{s.name}</td>
                    <td className="px-6 py-4"><span className="bg-stone-100 px-3 py-1 rounded-full text-xs">{s.category}</span></td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openModal(s)} className="p-2 text-stone-400 hover:text-primary"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(s.id, 'services')} className="p-2 text-stone-400 hover:text-red-500"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'pricing' && (
            <table className="w-full text-left">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  <th className="px-6 py-4 font-medium text-stone-500">Nom</th>
                  <th className="px-6 py-4 font-medium text-stone-500">Prix</th>
                  <th className="px-6 py-4 font-medium text-stone-500">Catégorie</th>
                  <th className="px-6 py-4 font-medium text-stone-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {prices.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 font-medium">{p.name}</td>
                    <td className="px-6 py-4">{p.price.toLocaleString()} FCFA</td>
                    <td className="px-6 py-4"><span className="bg-stone-100 px-3 py-1 rounded-full text-xs">{p.category}</span></td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openModal(p)} className="p-2 text-stone-400 hover:text-primary"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(p.id, 'pricing')} className="p-2 text-stone-400 hover:text-red-500"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'gallery' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8">
              {gallery.map((img) => (
                <div key={img.id} className="relative group rounded-2xl overflow-hidden aspect-square">
                  <img src={img.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                    <button onClick={() => openModal(img)} className="bg-white p-2 rounded-full text-primary"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(img.id, 'gallery')} className="bg-white p-2 rounded-full text-red-500"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="divide-y divide-stone-100">
              {messages.map((msg) => (
                <div key={msg.id} className={`p-8 hover:bg-stone-50 transition-colors ${msg.status === 'unread' ? 'bg-primary/5' : ''}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold flex items-center space-x-2">
                        <span>{msg.name}</span>
                        {msg.status === 'unread' && <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tighter">Nouveau</span>}
                      </h4>
                      <p className="text-stone-500 text-sm">{msg.email} • {msg.phone}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-stone-400 flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{msg.createdAt?.toDate().toLocaleDateString()}</span>
                      </span>
                      <button 
                        onClick={() => toggleMessageStatus(msg.id, msg.status || 'unread')}
                        className={`p-2 rounded-full transition-colors ${msg.status === 'read' ? 'text-primary bg-primary/10' : 'text-stone-300 hover:text-primary'}`}
                      >
                        {msg.status === 'read' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                      </button>
                      <button onClick={() => handleDelete(msg.id, 'messages')} className="p-2 text-stone-300 hover:text-red-500"><Trash2 size={20} /></button>
                    </div>
                  </div>
                  <p className="text-stone-700 leading-relaxed bg-white p-4 rounded-xl border border-stone-100">{msg.message}</p>
                </div>
              ))}
              {messages.length === 0 && <div className="p-20 text-center text-stone-500">Aucun message reçu.</div>}
            </div>
          )}

          {activeTab === 'settings' && (
            <form onSubmit={handleSave} className="p-12 max-w-2xl space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Nom du Salon</label>
                  <input 
                    value={formData.name || ''} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Email</label>
                  <input 
                    value={formData.email || ''} 
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Téléphone</label>
                  <input 
                    value={formData.phone || ''} 
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">WhatsApp</label>
                  <input 
                    value={formData.whatsapp || ''} 
                    onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Adresse</label>
                <input 
                  value={formData.address || ''} 
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Description courte</label>
                <textarea 
                  value={formData.description || ''} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>
              
              <div>
                <h4 className="font-serif text-xl mb-4">Horaires</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'].map(day => (
                    <div key={day} className="flex items-center space-x-4">
                      <span className="w-24 capitalize text-sm">{day}</span>
                      <input 
                        value={formData.hours?.[day] || ''} 
                        onChange={e => setFormData({
                          ...formData, 
                          hours: { ...formData.hours, [day]: e.target.value }
                        })}
                        placeholder="09:00 - 19:00"
                        className="flex-grow px-3 py-2 rounded-lg border border-stone-200 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary w-full flex items-center justify-center space-x-2">
                <Save size={20} />
                <span>Enregistrer les paramètres</span>
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-stone-100 flex justify-between items-center">
                <h3 className="text-2xl font-serif">{editingItem ? 'Modifier' : 'Ajouter'} {activeTab}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600"><X size={24} /></button>
              </div>
              
              <form onSubmit={handleSave} className="p-8 space-y-6">
                {activeTab === 'services' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom du service</label>
                      <input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea required value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-200" rows={3}></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">URL de l'image</label>
                      <input value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-200" placeholder="https://..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Catégorie</label>
                      <input required value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-200" placeholder="Coiffure, Manucure..." />
                    </div>
                  </>
                )}

                {activeTab === 'pricing' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom de la prestation</label>
                      <input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Prix (FCFA)</label>
                      <input required type="number" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-stone-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Catégorie</label>
                      <input required value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-200" placeholder="Coiffure, Manucure..." />
                    </div>
                  </>
                )}

                {activeTab === 'gallery' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">URL de l'image</label>
                      <input required value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-200" placeholder="https://..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Titre (optionnel)</label>
                      <input value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Catégorie</label>
                      <input required value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-200" placeholder="Avant/Après, Salon, Prestations..." />
                    </div>
                  </>
                )}

                <div className="flex space-x-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-grow py-3 rounded-xl border border-stone-200 font-bold">Annuler</button>
                  <button type="submit" className="flex-grow btn-primary">Enregistrer</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
