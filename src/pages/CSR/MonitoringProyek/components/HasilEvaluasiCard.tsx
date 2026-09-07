import React from 'react';
import { HiOutlineChartBar, HiOutlineNoSymbol } from 'react-icons/hi2';
import type { HasilEvaluasiCsr } from '@/services/program-csr.service';

interface HasilEvaluasiCardProps {
  hasil: HasilEvaluasiCsr;
  onHentikan: () => void;
}

const HasilEvaluasiCard: React.FC<HasilEvaluasiCardProps> = ({ hasil, onHentikan }) => {
  const {
    ambang_batas_tumbuh,
    persentase_tumbuh_terakhir,
    di_bawah_ambang_batas,
    boleh_dihentikan,
    alasan_tidak_boleh,
    status_program,
    penghentian,
  } = hasil;

  const sudahDihentikan = status_program === 'Dihentikan';
  const warna = persentase_tumbuh_terakhir === null
    ? 'text-gray-400'
    : di_bawah_ambang_batas
      ? 'text-red-600'
      : 'text-[#185325]';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <HiOutlineChartBar className="w-5 h-5 text-[#185325]" />
        <h2 className="text-sm font-bold text-gray-800">Hasil Evaluasi Keberhasilan Tanam</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-500">Persentase Tumbuh</span>
          <span className={`text-3xl font-bold ${warna}`}>
            {persentase_tumbuh_terakhir !== null ? `${persentase_tumbuh_terakhir}%` : 'Belum dievaluasi'}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-500">Ambang Batas</span>
          <span className="text-3xl font-bold text-gray-800">{ambang_batas_tumbuh}%</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-500">Status Pendanaan</span>
          <span className={`text-lg font-bold ${sudahDihentikan ? 'text-red-600' : 'text-[#185325]'}`}>
            {status_program || '-'}
          </span>
        </div>
      </div>

      {sudahDihentikan ? (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-sm font-bold text-red-700 mb-1">Pendanaan telah dihentikan</p>
          <p className="text-sm text-red-800 italic">
            {penghentian?.alasan || 'Tidak ada catatan.'}
          </p>
          {penghentian?.dihentikan_at && (
            <p className="text-xs text-red-600 mt-2">
              {new Date(penghentian.dihentikan_at).toLocaleString('id-ID')}
            </p>
          )}
        </div>
      ) : boleh_dihentikan ? (
        <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-red-50 border border-red-100 rounded-xl">
          <p className="flex-1 text-sm text-red-800 leading-relaxed">
            Persentase tumbuh berada di bawah ambang batas {ambang_batas_tumbuh}%. Sebagai
            pihak pendana, Anda dapat menghentikan pendanaan program ini.
          </p>
          <button
            onClick={onHentikan}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <HiOutlineNoSymbol className="w-5 h-5" />
            Hentikan Pendanaan
          </button>
        </div>
      ) : (
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
          <p className="text-sm text-gray-600">
            {alasan_tidak_boleh || 'Pendanaan berjalan normal.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default HasilEvaluasiCard;
