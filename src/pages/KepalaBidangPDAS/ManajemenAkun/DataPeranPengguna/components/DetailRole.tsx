import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoleById } from '@/services/rbac.service';
import { HiArrowLeft, HiOutlineShieldCheck } from 'react-icons/hi2';
import type { RoleType } from '@/utils/interface';

const DetailRole: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState<RoleType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        const data = await getRoleById(id);
        setRole(data);
      } catch (err) { console.error(err); } 
      finally { setIsLoading(false); }
    };
    fetchDetail();
  }, [id]);

  if (isLoading) return <div className="p-8 text-center text-gray-500">Memuat detail peran...</div>;
  if (!role) return <div className="p-8 text-center text-red-500">Data peran tidak ditemukan.</div>;
  
  const capitalizeWords = (text: string) => {
    return text
      .replace(/-/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="p-4 md:p-6 lg:p-2 w-full mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#185325] transition-colors mb-2 font-medium">
        <HiArrowLeft className="w-4 h-4" /> Kembali
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-secondary p-8 flex items-center gap-4">
          <div className="p-3 bg-white/50 rounded-lg backdrop-blur-sm">
            <HiOutlineShieldCheck className="w-8 h-8 text-green-800" />
          </div>
          <div>
            <h2 className="text-2xl font-bold uppercase">{role.nama.replace(/_/g, ' ')}</h2>
            <p className="text-sm text-black font-medium mt-1">Guard: {role.nama_penjaga}</p>
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Daftar Hak Akses (Permissions) Terkait</h3>
          <div className="flex flex-wrap gap-3">
            {role.izin && role.izin.length > 0 ? (
              role.izin.map((izin) => (
                <div key={izin.id} className="px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {capitalizeWords(izin.nama.replace(/-/g, ' '))}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">Belum ada izin spesifik yang diberikan pada peran ini.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailRole;