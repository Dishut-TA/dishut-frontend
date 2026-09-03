import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LihatDetailView } from './components/LihatDetailView';
import { FormValidasiView } from './components/FormValidasiView';

const DetailValidasi: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const data = location.state?.data;
  const currentStatus = location.state?.status || data?.status || 'Ditugaskan';

  if (!data) {
    return (
      <div className="w-full mx-auto bg-[#F8FAFC] min-h-screen p-8 text-center text-gray-500">
        Data tidak ditemukan. Silakan kembali ke halaman sebelumnya.
        <br />
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-[#008A4B] text-white rounded-lg">Kembali</button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto bg-[#F8FAFC] min-h-screen font-sans">
      {currentStatus === 'Selesai' ? (
        <LihatDetailView data={data} navigate={navigate} />
      ) : (
        <FormValidasiView data={data} navigate={navigate} />
      )}
    </div>
  );
};

export default DetailValidasi;