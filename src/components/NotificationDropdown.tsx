import React, { useState } from 'react';
import { HiOutlineCheckCircle, HiOutlineXMark } from 'react-icons/hi2';
import ConfirmDanaModal from './ConfirmDanaModal';
import toast from 'react-hot-toast';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<any>(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      namaProyek: 'Rehabilitasi Citarum',
      pihakPendana: 'PT Bank Jabar Banten',
      nominal: 'Rp 80.000.000'
    },
    {
      id: 2,
      namaProyek: 'Rehabilitasi Citarum',
      pihakPendana: 'PT Bank Jabar Banten',
      nominal: 'Rp 80.000.000'
    }
  ]);

  const handleKonfirmasiClick = (notif: any) => {
    setSelectedNotif(notif);
    setIsModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsModalOpen(false);
    onClose(); 
    toast.success('Penyaluran dana berhasil dikonfirmasi!');
    
    setNotifications(prev => prev.filter(n => n.id !== selectedNotif.id));
  };

  const handleRemoveNotif = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={onClose} />
      )}
      <div 
        className={`absolute -right-10 sm:right-0 mt-3 w-[calc(100vw-2rem)] max-w-90 bg-white rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.15)] border border-gray-100 p-4 z-50 transform origin-top-right transition-all duration-300 ease-out
          ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 -translate-y-2 pointer-events-none'}
        `}
      >
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-bold text-gray-800">Notifikasi</h3>
          <span className="text-xs text-[#185325] bg-[#DCECE0] px-2 py-0.5 rounded-full font-bold">
            {notifications.length} Baru
          </span>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar pb-2">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div key={notif.id} className="border border-dashed border-gray-300 hover:border-[#185325]/40 rounded-xl p-4 relative bg-white transition-colors group">
                <button 
                  onClick={() => handleRemoveNotif(notif.id)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-800 transition-colors"
                >
                  <HiOutlineXMark className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-[#DCECE0] p-1 rounded-full">
                    <HiOutlineCheckCircle className="w-4 h-4 text-[#185325]" />
                  </div>
                  <h4 className="text-[#185325] font-bold text-sm">Dana CSR Masuk!</h4>
                </div>
                
                <p className="text-xs text-gray-600 leading-relaxed mb-4 pr-2">
                  {notif.pihakPendana} telah mengirim <strong>{notif.nominal}</strong> untuk proyek <strong>{notif.namaProyek}.</strong>
                </p>
                
                <div className="flex justify-end gap-2 sm:gap-3">
                  <button className="px-4 sm:px-5 py-2 bg-gray-100 text-gray-400 text-[11px] sm:text-xs font-bold rounded-full cursor-not-allowed">
                    Lihat Resi
                  </button>
                  <button 
                    onClick={() => handleKonfirmasiClick(notif)}
                    className="px-4 sm:px-5 py-2 bg-[#185325] hover:bg-[#123d1c] text-white text-[11px] sm:text-xs font-bold rounded-full transition-transform active:scale-95 shadow-sm whitespace-nowrap"
                  >
                    Konfirmasi
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-sm text-gray-500">
              Tidak ada notifikasi baru.
            </div>
          )}
        </div>
      </div>

      <ConfirmDanaModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSubmit}
        data={selectedNotif}
      />
    </>
  );
};

export default NotificationDropdown;