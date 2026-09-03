import React, { useState } from 'react';
import { HiOutlineChevronDown, HiCheck, HiOutlineCloudDownload } from 'react-icons/hi';

interface BankOption {
  id: string;
  name: string;
  color: string;
}

const bankOptions: BankOption[] = [
  { id: 'bri', name: 'Bank Rakyat Indonesia (BRI)', color: 'text-blue-600' },
  { id: 'bca', name: 'Bank Central Asia (BCA)', color: 'text-blue-800' },
  { id: 'bni', name: 'Bank Negara Indonesia (BNI)', color: 'text-orange-600' },
  { id: 'mandiri', name: 'Bank Mandiri', color: 'text-blue-900' },
];

const IsiSaldo: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [nominal, setNominal] = useState<string>('');
  const [selectedBank, setSelectedBank] = useState<BankOption | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleLanjut = () => {
    if (nominal && selectedBank) {
      setStep(2);
    } else {
      alert("Mohon isi nominal dan pilih metode pembayaran");
    }
  };

  const formatRupiah = (value: string): string => {
    const numberString = value.replace(/[^,\d]/g, '').toString();
    const split = numberString.split(',');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substring(0, sisa);
    const ribuan = split[0].substring(sisa).match(/\d{3}/gi);

    if (ribuan) {
      const separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }
    return rupiah ? `Rp. ${rupiah}` : '';
  };

  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRupiah(e.target.value);
    setNominal(formatted);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-[fadeIn_0.3s_ease-out]">
      <div className="text-center mb-10">
        <h2 className="text-primary font-bold text-2xl md:text-3xl">Isi Saldo SIGAP Jabar</h2>
      </div>

      {step === 1 && (
        <div className="max-w-md mx-auto space-y-6">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Nominal Top Up
            </label>
            <input
              type="text"
              value={nominal}
              onChange={handleNominalChange}
              placeholder="Masukan nominal"
              className="w-full border border-primary rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50/50"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-primary mb-2">
              Pilih Metode Pembayaran
            </label>
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full border border-primary rounded-full px-4 py-3 text-sm flex justify-between items-center cursor-pointer bg-gray-50/50"
            >
              <span className={selectedBank ? "text-gray-800" : "text-gray-400"}>
                {selectedBank ? selectedBank.name : "Pilih metode.."}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-px h-4 bg-gray-300"></div>
                <HiOutlineChevronDown className="text-gray-500 text-lg" />
              </div>
            </div>

            {isDropdownOpen && (
              <div className="absolute w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg z-10 py-2">
                {bankOptions.map((bank) => (
                  <div
                    key={bank.id}
                    onClick={() => {
                      setSelectedBank(bank);
                      setIsDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-green-50 transition-colors ${
                      selectedBank?.id === bank.id ? 'bg-green-100/50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`font-bold italic ${bank.color} text-xs border border-gray-200 px-1 rounded`}>
                        {bank.id.toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{bank.name}</span>
                    </div>
                    {selectedBank?.id === bank.id && (
                      <HiCheck className="text-primary text-lg" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              onClick={handleLanjut}
              className="w-full bg-primary text-white font-semibold rounded-full py-3 hover:bg-green-800 transition-colors cursor-pointer"
            >
              Lanjutkan
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                Order ID <span className="text-[#8B7355] text-lg">#91902478hwdo8ahd</span>
              </h3>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              Selesaikan pembayaran dalam <span className="font-bold text-gray-800">00.15.39</span>
            </div>

            <p className="text-sm text-gray-600">
              Lakukan pembayaran untuk menyelesaikan pesanan kamu
            </p>

            <div>
              <p className="text-sm text-gray-500 mb-1">Total Bayar</p>
              <h1 className="text-3xl font-bold text-primary">{nominal}</h1>
            </div>

            <div className="pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Panduan Pembayaran</p>
              <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                <li>Buka aplikasi pembayaran QRIS yang mendukung</li>
                <li>Unduh atau pindai atau download QRIS di layar kamu</li>
                <li>Konfirmasi pembayaran di aplikasi</li>
                <li>Pembayaran Berhasil</li>
              </ol>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-6">
            <div className="flex gap-4 mb-2">
              <button className="bg-[#93C572] text-white px-8 py-2 rounded-full font-medium cursor-pointer">
                QR
              </button>
              <button className="text-gray-500 px-8 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors cursor-pointer">
                VA
              </button>
            </div>

            <p className="text-sm text-primary font-medium">Pindai atau Download QR</p>

            <div className="bg-white w-64 h-64 flex items-center justify-center">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Pembayaran+SIGAP+Jabar+${nominal.replace(/\D/g, '')}`} 
                alt="QR Code Pembayaran" 
                className="w-full h-full object-contain"
              />
            </div>

            <button className="flex items-center gap-2 px-12 py-3 rounded-full border border-primary text-primary font-medium hover:bg-green-50 transition-colors cursor-pointer">
              Download QR <HiOutlineCloudDownload className="text-xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IsiSaldo;