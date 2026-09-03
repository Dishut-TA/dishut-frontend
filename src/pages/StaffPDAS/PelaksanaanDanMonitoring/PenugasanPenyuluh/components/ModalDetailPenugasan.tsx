import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineXMark, 
  HiOutlineMapPin, 
  HiOutlineListBullet,
  HiOutlineCheckCircle,
  HiOutlineMinusCircle,
  HiOutlineCamera,
  HiOutlineExclamationTriangle,
  HiOutlineChartBar,
  HiOutlinePencilSquare,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineClock
} from 'react-icons/hi2';
import { PiPlant } from 'react-icons/pi';

interface ModalDetailProps {
  isOpen: boolean;
  onClose: () => void;
  data: any | null;
}

const ModalDetailPenugasan: React.FC<ModalDetailProps> = ({ isOpen, onClose, data }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const isValidasi = data.jenis === 'Validasi Lokasi';

  const theme = {
    main: isValidasi ? 'text-emerald-700' : 'text-indigo-700',
    bgBadge: isValidasi ? 'bg-emerald-50' : 'bg-indigo-50',
    borderBadge: isValidasi ? 'border-emerald-200' : 'border-indigo-200',
    btnOutlineText: isValidasi ? 'text-emerald-700' : 'text-indigo-700',
    btnOutlineBorder: isValidasi ? 'border-emerald-700' : 'border-indigo-700',
    btnOutlineHover: isValidasi ? 'hover:bg-emerald-50' : 'hover:bg-indigo-50',
    btnSolidBg: isValidasi ? 'bg-emerald-600' : 'bg-indigo-600',
    btnSolidHover: isValidasi ? 'hover:bg-emerald-700' : 'hover:bg-indigo-700',
    iconBg: isValidasi ? 'bg-emerald-100' : 'bg-indigo-100',
  };

  const handleRedirect = () => {
    if (isValidasi) {
      navigate(`/admin/staff/monitoring/penugasan-penyuluh/detail/${data.id}`);
    } else {
      navigate(`/admin/staff/monitoring/penugasan-penyuluh/progres/${data.id}`);
    }
  };

  const SummaryRow = ({ label, value, icon }: { label: string, value: React.ReactNode, icon?: React.ReactNode }) => (
    <div className="flex items-center text-sm border-b border-gray-50 pb-3">
      <span className="w-1/3 text-gray-500 font-medium">{label}</span>
      <span className="w-2/3 font-bold text-gray-800 flex items-center gap-2">
        {icon} {value}
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex items-start justify-between p-6 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${theme.iconBg} ${theme.main}`}>
              {isValidasi ? <HiOutlineMapPin className="w-6 h-6" /> : <PiPlant className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Detail {isValidasi ? 'Validasi Lokasi' : 'Pelaksanaan Kegiatan'}
              </h2>
              <span className={`inline-block mt-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${theme.bgBadge} ${theme.main} ${theme.borderBadge}`}>
                {isValidasi ? 'Validasi Lokasi' : 'Pelaksanaan Kegiatan'}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <HiOutlineXMark className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white space-y-6">
          <div className={`border rounded-2xl p-5 ${theme.borderBadge}`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 mb-5 ${theme.main}`}>
              <HiOutlineListBullet className="w-5 h-5" /> Informasi Penugasan
            </h3>
            <div className="space-y-3">
              {isValidasi ? (
                <>
                  <SummaryRow label="ID Referensi" value={data.ref} />
                  <SummaryRow label="Lokasi Usulan" value={data.objek} />
                  <SummaryRow label="Sumber Lokasi" value={data.sumber || 'Analisis CPI'} />
                  <SummaryRow label="CDK" value={data.cdk || 'Cimanuk'} />
                  <SummaryRow label="Desa / Kecamatan" value={data.lokasi} />
                  <SummaryRow label="Luas" value="12,5 Ha" />
                </>
              ) : (
                <>
                  <SummaryRow label="ID Referensi" value={data.ref} />
                  <SummaryRow label="Nama Program" value={data.objek} />
                  <SummaryRow label="Sumber Dana" value="APBD" />
                  <SummaryRow label="Jenis Kegiatan" value={data.jenis} />
                  <SummaryRow label="Lokasi Program" value={data.lokasi} />
                  <SummaryRow label="KTH Terlibat" value={data.kth} />
                  <SummaryRow label="Target Kegiatan" value="500 tanaman" />
                </>
              )}
              <SummaryRow label="Penyuluh Ditugaskan" value={data.penyuluh} icon={<HiOutlineUser className={theme.main} />} />
              <SummaryRow label={isValidasi ? 'Tanggal Validasi' : 'Tanggal Mulai'} value={data.tgl || data.tglMulai} icon={<HiOutlineCalendar className={theme.main} />} />
              <SummaryRow label="Batas Waktu" value={data.batas || data.batasWaktu} icon={<HiOutlineClock className={theme.main} />} />
              <SummaryRow label="Status" value={<span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">{data.status}</span>} />
              <div className="flex text-sm pt-2">
                <span className="w-1/3 text-gray-500 font-medium">Catatan Penugasan</span>
                <span className="w-2/3 text-gray-800 font-medium leading-relaxed">
                  {isValidasi 
                    ? 'Lakukan verifikasi koordinat, kondisi lahan, akses jalan, dan dokumentasi lapangan.' 
                    : 'Dampingi pelaksanaan penanaman sesuai target dan laporkan progres berkala.'}
                </span>
              </div>
            </div>
          </div>

          <div className={`border rounded-2xl p-5 bg-gray-50/50 ${theme.borderBadge}`}>
            <h3 className={`text-sm font-bold mb-5 ${theme.main}`}>
              {isValidasi ? 'Checklist Hasil Validasi' : 'Progress & Hasil Kegiatan'}
            </h3>

            {isValidasi ? (
              <div className="grid grid-cols-2 gap-4 text-xs font-bold text-gray-700">
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100"><HiOutlineCheckCircle className="w-5 h-5 text-emerald-500 shrink-0"/> Koordinat lokasi</div>
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100"><HiOutlineMinusCircle className="w-5 h-5 text-gray-400 shrink-0"/> Status kepemilikan</div>
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100"><HiOutlineCheckCircle className="w-5 h-5 text-emerald-500 shrink-0"/> Kondisi lahan</div>
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100"><HiOutlineCheckCircle className="w-5 h-5 text-emerald-500 shrink-0"/> Aksesibilitas</div>
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100"><HiOutlineCheckCircle className="w-5 h-5 text-emerald-500 shrink-0"/> Foto lokasi</div>
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100"><HiOutlineMinusCircle className="w-5 h-5 text-gray-400 shrink-0"/> Catatan lapangan</div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${theme.iconBg} ${theme.main}`}>
                    <PiPlant className="w-6 h-6" />
                  </div>
                  <div className="flex-1 border-r border-gray-100 pr-4">
                    <p className="text-gray-500 font-bold mb-1">Realisasi</p>
                    <p className="text-sm font-bold text-gray-800"><span className={theme.main}>320</span> / 500 tanaman</p>
                  </div>
                  <div className="flex-1 pl-2">
                    <p className="text-gray-500 font-bold mb-1.5 flex justify-between">Progress <span className={theme.main}>64%</span></p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${theme.btnSolidBg} h-2 rounded-full`} style={{ width: '64%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 font-bold text-gray-700">
                  <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2"><div className={`p-1.5 rounded-lg ${theme.iconBg} ${theme.main}`}><HiOutlineCamera className="w-4 h-4"/></div> Foto dokumentasi</div>
                    <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500 shrink-0"/>
                  </div>
                  <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2"><div className={`p-1.5 rounded-lg ${theme.iconBg} ${theme.main}`}><HiOutlineChartBar className="w-4 h-4"/></div> Catatan progres</div>
                    <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500 shrink-0"/>
                  </div>
                  <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2"><div className={`p-1.5 rounded-lg ${theme.iconBg} ${theme.main}`}><HiOutlineMapPin className="w-4 h-4"/></div> Koordinat kegiatan</div>
                    <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500 shrink-0"/>
                  </div>
                  <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2"><div className={`p-1.5 rounded-lg ${theme.iconBg} ${theme.main}`}><HiOutlineExclamationTriangle className="w-4 h-4"/></div> Kendala lapangan</div>
                    <HiOutlineMinusCircle className="w-5 h-5 text-amber-500 shrink-0"/>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-6">
              <button className={`py-3 bg-white border ${theme.btnOutlineBorder} ${theme.btnOutlineText} ${theme.btnOutlineHover} text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer`}>
                <HiOutlinePencilSquare className="w-5 h-5" /> Ubah Penugasan
              </button>
              <button onClick={handleRedirect} className={`py-3 ${theme.btnSolidBg} ${theme.btnSolidHover} text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer`}>
                {isValidasi ? <HiOutlineListBullet className="w-5 h-5" /> : <HiOutlineChartBar className="w-5 h-5" />}
                {isValidasi ? 'Lihat Hasil Validasi' : 'Lihat Progres'}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ModalDetailPenugasan;