import { useEffect, useState } from 'react';
import localforage from 'localforage';

export const useOfflineSync = () => {
  // Melacak status internet saat ini
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Fungsi ini otomatis berjalan saat HP kembali mendapat sinyal
    const handleOnline = async () => {
      setIsOnline(true);
      
      try {
        // Cek apakah ada data yang tertahan di memori HP
        const antreanData = await localforage.getItem<any[]>('antrean_rencana_program');
        
        if (antreanData && antreanData.length > 0) {
          console.log('Sinyal kembali! Mengupload data tertunda...', antreanData);
          
          // DI SINI: Logika API Call (Axios/Fetch) ke backend kamu
          // Contoh: await axios.post('/api/program', antreanData);
          
          // Jika berhasil, hapus antrean dari memori HP
          await localforage.removeItem('antrean_rencana_program');
          alert(`Berhasil sinkronisasi ${antreanData.length} data offline ke server!`);
        }
      } catch (error) {
        console.error('Gagal sinkronisasi data offline:', error);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // Pasang "pendengar" event bawaan browser
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline };
};