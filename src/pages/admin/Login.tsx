import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { LogIn, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'fayem7409@gmail.com') {
        navigate('/admin/dashboard');
      }
    });
    return () => unsub();
  }, [navigate]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user.email === 'fayem7409@gmail.com') {
        navigate('/admin/dashboard');
      } else {
        alert("Accès refusé. Vous n'êtes pas l'administrateur de ce site.");
        await auth.signOut();
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center"
      >
        <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-8">
          <Sparkles size={40} />
        </div>
        <h1 className="text-3xl font-serif mb-4 text-stone-900">Administration</h1>
        <p className="text-stone-500 mb-10 leading-relaxed">
          Connectez-vous pour gérer le contenu de votre salon de beauté.
        </p>
        
        <button
          onClick={handleLogin}
          className="w-full bg-white border-2 border-stone-200 text-stone-700 px-6 py-4 rounded-xl font-bold flex items-center justify-center space-x-3 hover:bg-stone-50 hover:border-primary transition-all group"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          <span>Se connecter avec Google</span>
          <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
        
        <div className="mt-12 pt-8 border-t border-stone-100">
          <p className="text-xs text-stone-400 uppercase tracking-widest">
            Salon de Beauté Saly &copy; {new Date().getFullYear()}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
