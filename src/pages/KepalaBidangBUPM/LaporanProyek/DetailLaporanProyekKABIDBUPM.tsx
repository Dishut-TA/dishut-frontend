import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineChevronLeft } from 'react-icons/hi2';

const InfoRow = ({
  label,
  value,
  valueColor = "text-gray-800",
  isItalic = false,
  isLink = false,
  isDeskripsi = false,
}: {
  label: string;
  value: React.ReactNode;
  valueColor?: string;
  isItalic?: boolean;
  isLink?: boolean;
  isDeskripsi?: boolean;
}) => (
  <div className="grid grid-cols-[160px_20px_1fr] items-start text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-500">:</span>
    <span 
      className={`font-medium ${valueColor} ${isItalic ? 'italic text-gray-600' : ''} ${isLink ? 'underline cursor-pointer hover:text-gray-600' : ''} ${isDeskripsi ? 'text-gray-500 font-normal leading-relaxed text-justify' : ''}`}
    >
      {value}
    </span>
  </div>
);

const SectionTitle = ({ title }: { title: string }) => (
  <h2 className="text-base font-bold text-gray-800 mb-4 mt-8">{title}</h2>
);

const DetailLaporanProyekKABIDBUPM: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full mx-auto pb-20 animate-in fade-in duration-300 relative">
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
          <InfoRow label="Status" value="Diverifikasi Staff BUPM" valueColor="text-emerald-600" />
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
          <InfoRow 
            label="Dokumen Milestone" 
            value="RencanaProyekPembangunanEkowisata.pdf" 
            isLink={true} 
            valueColor="text-gray-800" 
          />
          <InfoRow 
            label="Deskripsi" 
            value="Lorem ipsum dolor sit amet consectetur. Faucibus faucibus urna nulla amet at nascetur. Enim aliquam sed nibh bibendum. Pulvinar nec risus et vulputate consequat tortor. Quisque tristique in dapibus laoreet eu augue. Maecenas quam eget habitant non. Lobortis lobortis dui phasellus sodales consectetur faucibus mauris eros odio. Diam tortor massa et venenatis ornare tristique nulla." 
            isDeskripsi={true}
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
        
      </div>
    </div>
  );
};

export default DetailLaporanProyekKABIDBUPM;