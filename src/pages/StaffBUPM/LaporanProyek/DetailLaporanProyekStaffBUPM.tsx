import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineChevronLeft, HiXMark } from 'react-icons/hi2';

type StatusLaporan = 'Menunggu Verifikasi' | 'Revisi' | 'Diverifikasi';

const InfoRow = ({
  label,
  value,
  valueColor = "text-gray-800",
  isItalic = false,
  isLink = false,
}: {
  label: string;
  value: React.ReactNode;
  valueColor?: string;
  isItalic?: boolean;
  isLink?: boolean;
}) => (
  <div className="grid grid-cols-[160px_20px_1fr] items-start text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-500">:</span>
    <span 
      className={`font-medium ${valueColor} ${isItalic ? 'italic text-gray-600' : ''} ${isLink ? 'underline cursor-pointer hover:text-gray-600' : ''}`}
    >
      {value}
    </span>
  </div>
);

const SectionTitle = ({ title }: { title: string }) => (
  <h2 className="text-base font-bold text-gray-800 mb-4 mt-8">{title}</h2>
);

const DetailLaporanProyekStaffBUPM: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [isModalRevisiOpen, setIsModalRevisiOpen] = useState(false);

  let statusLaporan: StatusLaporan = 'Menunggu Verifikasi';
  if (id === 'LPR-002') statusLaporan = 'Revisi';
  else if (id === 'LPR-003') statusLaporan = 'Diverifikasi';

  const getStatusDisplay = () => {
    if (statusLaporan === 'Menunggu Verifikasi') return { text: 'Menunggu Verifikasi', color: 'text-orange-500' };
    if (statusLaporan === 'Revisi') return { text: 'Revisi', color: 'text-red-500' };
    if (statusLaporan === 'Diverifikasi') return { text: 'Diverifikasi', color: 'text-emerald-600' };
    return { text: '', color: '' };
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto pb-20 animate-in fade-in duration-300">
      <div className="relative mb-10 flex items-center justify-center">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute left-0 flex items-center gap-2 text-sm font-bold text-[#185325] hover:underline"
        >
          <HiOutlineChevronLeft className="stroke-2" /> Kembali
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mt-8 md:mt-0">Detail Laporan Proyek</h1>
      </div>

      <div className="px-4 sm:px-0">
        <h2 className="text-base font-bold text-gray-800 mb-4">Informasi Laporan</h2>
        <div className="flex flex-col gap-3">
          <InfoRow label="Nama Investasi" value="Ekowisata Kebun Stroberi" />
          <InfoRow label="Periode Laporan" value="24 Agustus 2025" />
          <InfoRow label="Status" value={statusDisplay.text} valueColor={statusDisplay.color} />
          
          {statusLaporan === 'Revisi' && (
            <InfoRow 
              label="Catatan" 
              value="Dokumentasi milestone belum lengkap, mohon tambahkan foto terbaru." 
              isItalic={true} 
            />
          )}
        </div>

        <SectionTitle title="Informasi Milestone" />
        <div className="flex flex-col gap-3">
          <InfoRow label="Nama Milestone" value="Milestone 1" />
          <InfoRow label="Batas Milestone" value="22/04/2024" />
          <InfoRow 
            label="Status" 
            value={
              <span className="flex items-center gap-1 text-emerald-600">
                Tercapai <span className="font-bold">✓</span>
              </span>
            } 
          />
          <InfoRow label="Dokumen Milestone" value="RencanaProyekPembangunanEkowisata.pdf" isLink={true} valueColor="text-gray-800" />
          <InfoRow 
            label="Deskripsi" 
            value="Lorem ipsum dolor sit amet consectetur. Faucibus faucibus urna nulla amet at nascetur. Enim aliquam sed nibh bibendum. Pulvinar nec risus et vulputate consequat tortor. Quisque tristique in dapibus laoreet eu augue. Maecenas quam eget habitant non. Lobortis lobortis dui phasellus sodales consectetur faucibus mauris eros odio. Diam tortor massa et venenatis ornare tristique nulla." 
            valueColor="text-gray-500 font-normal leading-relaxed text-justify"
          />
        </div>

        <SectionTitle title="Penggunaan Dana" />
        <div className="flex flex-col gap-3">
          <InfoRow label="Dana Terpakai" value="Rp 27.000.000" />
          <InfoRow label="Sisa Dana" value="Rp 3.000.000" />
        </div>

        <SectionTitle title="Dokumen Perkembangan" />
        <div className="flex flex-col gap-3">
          <span className="text-sm text-gray-800 font-medium underline cursor-pointer hover:text-gray-600 w-fit">
            dokumen_pendukung.pdf
          </span>
        </div>

        {statusLaporan === 'Menunggu Verifikasi' && (
          <div className="flex flex-col sm:flex-row gap-4 mt-14">
            <button 
              onClick={() => setIsModalRevisiOpen(true)}
              className="flex-1 py-3.5 bg-[#FF0000] text-white text-sm font-bold rounded-full hover:bg-red-700 transition-colors shadow-sm active:scale-95"
            >
              Revisi
            </button>
            <button 
              className="flex-1 py-3.5 bg-[#185325] text-white text-sm font-bold rounded-full hover:bg-[#123d1c] transition-colors shadow-sm active:scale-95"
            >
              Setujui
            </button>
          </div>
        )}
        
      </div>

      {isModalRevisiOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden border border-gray-100">
            
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#185325] mx-auto">Buat Revisi</h2>
              <button 
                onClick={() => setIsModalRevisiOpen(false)} 
                className="absolute right-4 p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors border border-gray-200"
              >
                <HiXMark className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-2">Deskripsi</label>
                <textarea 
                  rows={4} 
                  placeholder="Tulis keterangan perubahan" 
                  className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#185325] resize-none"
                ></textarea>
              </div>
              <button 
                onClick={() => {
                  setIsModalRevisiOpen(false);
                  // Disini nanti tambahin toast success / navigasi
                }}
                className="w-full py-3 mt-2 bg-[#185325] text-white text-sm font-bold rounded-full hover:bg-[#123d1c] transition-colors shadow-sm active:scale-95"
              >
                Kirim
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default DetailLaporanProyekStaffBUPM;