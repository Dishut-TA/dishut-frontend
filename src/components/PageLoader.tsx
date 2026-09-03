import React from 'react';
import { motion } from 'framer-motion';

const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-slate-50/60 backdrop-blur-md">
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-16 h-16 border-4 border-slate-200 border-t-[#185325] rounded-full"
        />
        
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          className="absolute w-4 h-4 bg-[#185325] rounded-full shadow-lg shadow-[#185325]/40"
        />
      </div>
      
      <motion.p
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-xs font-bold text-slate-600 tracking-widest uppercase"
      >
        Memuat Halaman
      </motion.p>
    </div>
  );
};

export default PageLoader;