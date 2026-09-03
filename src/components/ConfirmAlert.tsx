import React from 'react';
import { HiOutlineExclamationTriangle, HiOutlineQuestionMarkCircle } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion'; 

interface ConfirmAlertProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmAlert: React.FC<ConfirmAlertProps> = ({
  isOpen, title, message,
  confirmText = 'Ya, Lanjutkan', cancelText = 'Batal',
  isDanger = false, isLoading = false,
  onConfirm, onCancel
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
          {/* Latar Belakang Gelap (Fade In/Out) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isLoading ? onCancel : undefined} // Klik luar untuk tutup (opsional)
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Kotak Alert (Bouncy Zoom In/Out) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100 p-6 text-center relative z-10"
          >
            {/* Icon Dinamis dengan animasi berdenyut pelan saat muncul */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
              className="flex justify-center mb-5"
            >
              {isDanger ? (
                <div className="p-4 bg-red-50 rounded-full text-red-500 shadow-inner">
                  <HiOutlineExclamationTriangle className="w-9 h-9" />
                </div>
              ) : (
                <div className="p-4 bg-green-50 rounded-full text-[#185325] shadow-inner">
                  <HiOutlineQuestionMarkCircle className="w-9 h-9" />
                </div>
              )}
            </motion.div>

            <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">{message}</p>

            <div className="flex gap-3 w-full">
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 py-3 text-sm font-bold text-slate-600 bg-slate-100 rounded-full hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 py-3 text-sm font-bold text-white rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex justify-center items-center ${
                  isDanger 
                    ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30' 
                    : 'bg-[#185325] hover:bg-[#123d1c] shadow-lg shadow-[#185325]/30'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                    Proses...
                  </span>
                ) : confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmAlert;