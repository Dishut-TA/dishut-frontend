import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPermissionById } from '@/services/rbac.service';
import { HiArrowLeft, HiOutlineKey } from 'react-icons/hi2';
import type { PermissionType } from '@/utils/interface';

const DetailHakAkses: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [permission, setPermission] = useState<PermissionType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        const data = await getPermissionById(id);
        setPermission(data);
      } catch (err) { console.error(err); } 
      finally { setIsLoading(false); }
    };
    fetchDetail();
  }, [id]);

  if (isLoading) return <div className="p-8 text-center text-gray-500">Memuat detail izin...</div>;
  if (!permission) return <div className="p-8 text-center text-red-500">Data izin tidak ditemukan.</div>;

  return (
    <div className="p-4 md:p-6 lg:p-2 w-full mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#185325] transition-colors mb-2 font-medium">
        <HiArrowLeft className="w-4 h-4" /> Kembali
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-8">
        <div className="flex items-start gap-4">
          <div className="p-4 bg-green-50 rounded-xl text-[#185325]">
            <HiOutlineKey className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 capitalize">{permission.nama.replace(/[-_]/g, ' ')}</h2>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600"><span className="font-semibold w-24 inline-block">Sistem ID:</span> {permission.nama}</p>
              <p className="text-sm text-gray-600"><span className="font-semibold w-24 inline-block">Guard Name:</span> {permission.nama_penjaga}</p>
              <p className="text-sm text-gray-600"><span className="font-semibold w-24 inline-block">Dibuat:</span> {new Date(permission.dibuat_pada).toLocaleDateString('id-ID')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailHakAkses;