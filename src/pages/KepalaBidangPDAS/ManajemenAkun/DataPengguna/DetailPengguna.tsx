import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById } from '@/services/authService'; 
import { 
  HiOutlineUser, 
  HiOutlineIdentification, 
  HiOutlineCalendarDays, 
  HiArrowLeft,
} from 'react-icons/hi2';
import { MdOutlineMail } from "react-icons/md";
import type { UserProfile } from '@/utils/interface';

const DetailPengguna: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetail = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await getUserById(id);
        setProfileData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetail();
  }, [id]);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Memuat detail pengguna...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!profileData) return null;

  const formattedDate = new Date(profileData.dibuat_pada).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const nip = profileData.profil?.nip || profileData.nip;
  const fotoAsli = profileData.profil?.foto_profile || profileData.foto_profile;
  const fotoUrl = fotoAsli 
    ? fotoAsli 
    : `https://ui-avatars.com/api/?name=${profileData.nama_pengguna}&background=D5F0DE&color=185325&size=128&bold=true`;

  return (
    <div className="p-4 md:p-6 lg:p-2 w-full mx-auto space-y-6">
      
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#185325] transition-colors mb-2 font-medium"
      >
        <HiArrowLeft className="w-4 h-4" /> Kembali
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Detail Pengguna</h1>
        <p className="text-sm text-gray-500 mt-1">Melihat informasi detail dari akun ini</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-greenAdmin h-32 w-full relative">
          <div className="absolute -bottom-12 left-8">
            <img 
              src={fotoUrl} 
              alt="Avatar" 
              className="w-24 h-24 rounded-full border-4 border-white object-cover bg-white shadow-md"
            />
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          <h2 className="text-xl font-bold text-gray-800 capitalize">
            {profileData.nama_pengguna?.replace(/_/g, ' ')}
          </h2>
          {profileData.peran && profileData.peran.length > 0 && (
            <span className="inline-block px-3 py-1 mt-2 text-xs font-semibold text-black bg-[#D5F0DE] rounded-full uppercase">
              {profileData.peran[0].nama?.replace(/_/g, ' ')}
            </span>
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div className="p-2 bg-white rounded-md shadow-sm text-greenAdmin">
                <HiOutlineUser className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Username</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">{profileData.nama_pengguna}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div className="p-2 bg-white rounded-md shadow-sm text-greenAdmin">
                <MdOutlineMail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Email Address</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">{profileData.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div className="p-2 bg-white rounded-md shadow-sm text-greenAdmin">
                <HiOutlineIdentification className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Nomor Induk Pegawai (NIP)</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">
                  {nip ? nip : <span className="text-gray-400 italic">Belum diatur</span>}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div className="p-2 bg-white rounded-md shadow-sm text-greenAdmin">
                <HiOutlineCalendarDays className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Terdaftar Pada Sistem Sejak</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">{formattedDate}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPengguna;