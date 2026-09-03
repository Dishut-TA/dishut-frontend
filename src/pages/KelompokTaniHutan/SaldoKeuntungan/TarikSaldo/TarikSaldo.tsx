import React, { useState } from 'react';
import { HiEye, HiEyeSlash } from 'react-icons/hi2';

const TarikSaldo: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [nominal, setNominal] = useState<string>('');

  const totalBalance: number = 3750000;

  const formatRupiahInput = (value: string): string => {
    const numberString = value.replace(/[^,\d]/g, '').toString();
    const split = numberString.split(',');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substring(0, sisa);
    const ribuan = split[0].substring(sisa).match(/\d{3}/gi);

    if (ribuan) {
      const separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }
    return rupiah ? `Rp ${rupiah}` : '';
  };

  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRupiahInput(e.target.value);
    setNominal(formatted);
  };

  const handleTarikSaldo = () => {
    const rawNominal = parseInt(nominal.replace(/[^0-9]/g, ''), 10);
    
    if (!rawNominal) {
      alert("Silakan masukkan nominal tarik saldo.");
      return;
    }

    if (rawNominal > totalBalance) {
      alert("Maaf, nominal yang ditarik melebihi jumlah saldo Anda.");
      return;
    }
    alert(`Permintaan tarik saldo sebesar ${nominal} sedang diproses.`);
    // Lanjutin logika integrasi API di sini
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 animate-[fadeIn_0.3s_ease-out]">
      <div className="text-center mb-8">
        <h2 className="text-primary font-bold text-2xl">Tarik Saldo</h2>
      </div>

      <div className="text-center mb-10">
        <p className="text-primary text-sm font-medium mb-2">Jumlah Saldo</p>
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-3xl font-bold text-primary">
            {isVisible 
              ? `Rp ${totalBalance.toLocaleString('id-ID')}` 
              : "Rp *********"}
          </h1>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="text-primary cursor-pointer hover:text-green-800 transition-colors"
            title={isVisible ? "Sembunyikan Saldo" : "Tampilkan Saldo"}
          >
            {isVisible ? <HiEye size={24} /> : <HiEyeSlash size={24} />}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">
            Nominal Tarik Saldo
          </label>
          <input
            type="text"
            value={nominal}
            onChange={handleNominalChange}
            placeholder="Masukan nominal"
            className="w-full border border-primary rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50/50"
          />
        </div>

        <div className="pt-2">
          <button
            onClick={handleTarikSaldo}
            className="w-full bg-primary text-white font-semibold rounded-full py-3 hover:bg-green-800 transition-colors cursor-pointer shadow-sm"
          >
            Tarik Saldo Sekarang
          </button>
        </div>
      </div>

    </div>
  );
};

export default TarikSaldo;