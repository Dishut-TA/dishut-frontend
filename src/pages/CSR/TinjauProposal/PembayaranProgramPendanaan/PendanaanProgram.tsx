import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  HiOutlineChevronLeft, 
  HiOutlineDocumentDuplicate, 
  HiOutlineCloud,
  HiCheck
} from 'react-icons/hi2';
import { FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getProgramCsrByIdAPI, updateProgramCsrStatusAPI } from '@/services/program-csr.service';

type PaymentTab = 'QR' | 'VA';

const PendanaanProgram: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [step, setStep] = useState<1 | 2>(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [activeTab, setActiveTab] = useState<PaymentTab>('QR');
  
  const [programData, setProgramData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const banks = [
    { id: 'bri', name: 'Bank Rakyat Indonesia (BRI)', code: 'BRI', color: 'bg-blue-600' },
    { id: 'bca', name: 'Bank Central Asia (BCA)', code: 'BCA', color: 'bg-blue-800' },
    { id: 'bni', name: 'Bank Negara Indonesia (BNI)', code: 'BNI', color: 'bg-orange-500' },
    { id: 'mandiri', name: 'Bank Mandiri', code: 'MDR', color: 'bg-blue-900' },
  ];

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        if (id) {
          const res = await getProgramCsrByIdAPI(id);
          setProgramData(res.data || res.payload || res);
        }
      } catch (error: any) {
        toast.error("Gagal memuat informasi pendanaan program.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgram();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatRupiah = (angka: any) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(angka || 0));
  };

  const handleSelesaikanPembayaran = async () => {
    if (!id) return;
    setIsSubmitting(true);
    const loadingToast = toast.loading('Memproses status pembayaran...');

    try {
      // PERBAIKAN ALUR: Setelah bayar lunas, barulah statusnya menjadi 'Selesai'
      await updateProgramCsrStatusAPI(id, { status: 'Selesai' });
      
      toast.success('Pembayaran Berhasil! Pendanaan Selesai.', { id: loadingToast });
      navigate('/admin/csr/tinjau-proposal');
    } catch (error: any) {
      toast.error(error.message || 'Gagal memperbarui status pembayaran.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-[#185325] font-bold bg-[#F8F9F8]">
        <span className="w-6 h-6 border-2 border-[#185325] border-t-transparent rounded-full animate-spin mr-3"></span> 
        Memuat data pembayaran...
      </div>
    );
  }

  if (!programData) {
    return <div className="text-center text-gray-500 py-20">Data program pendanaan tidak ditemukan.</div>;
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-[#F8F9F8] pt-10 pb-20 px-5 font-sans animate-in fade-in duration-300">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-[#185325] transition-colors mb-10 cursor-pointer"
          >
            <HiOutlineChevronLeft className="w-4 h-4 stroke-2" /> Kembali
          </button>

          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-[#185325] text-center mb-10">
              Pendanaan Program
            </h1>

            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-[160px_20px_1fr] md:grid-cols-[200px_20px_1fr] text-lg font-semibold text-[#185325]">
                <span>Nama Program</span>
                <span>:</span>
                <span>{programData.nama_program || '-'}</span>
              </div>
              <div className="grid grid-cols-[160px_20px_1fr] md:grid-cols-[200px_20px_1fr] text-lg font-semibold text-[#185325]">
                <span>Nominal Pendanaan</span>
                <span>:</span>
                <span>{formatRupiah(programData.anggaran)}</span>
              </div>
            </div>

            <div className="mb-6 relative" ref={dropdownRef}>
              <label className="block text-sm font-bold text-[#185325] mb-2">
                Pilih Metode Pembayaran
              </label>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full flex justify-between items-center bg-transparent border-2 ${isDropdownOpen || selectedBank ? 'border-[#185325]' : 'border-gray-300'} rounded-full px-5 py-3.5 text-sm outline-none transition-colors cursor-pointer`}
              >
                <span className={selectedBank ? "text-gray-800 font-medium" : "text-gray-400"}>
                  {selectedBank ? banks.find(b => b.id === selectedBank)?.name : "Pilih metode..."}
                </span>
                <FiChevronDown className={`text-xl ${isDropdownOpen ? 'rotate-180' : ''} text-[#185325] transition-transform`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden py-2 animate-[fadeIn_0.2s_ease-out]">
                  {banks.map((bank) => {
                    const isSelected = selectedBank === bank.id;
                    return (
                      <div 
                        key={bank.id} 
                        onClick={() => { setSelectedBank(bank.id); setIsDropdownOpen(false); }}
                        className={`flex items-center justify-between px-5 py-3.5 text-sm cursor-pointer transition-colors mx-2 rounded-xl
                          ${isSelected ? "bg-[#DCECE0]/70 text-[#185325] font-bold" : "text-gray-700 hover:bg-gray-50"}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-5 flex items-center justify-center rounded-[3px] text-[9px] font-bold text-white ${bank.color}`}>
                            {bank.code}
                          </div>
                          <span>{bank.name}</span>
                        </div>
                        {isSelected && <HiCheck className="w-5 h-5 text-[#185325]" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedBank && (
              <div className="animate-[fadeIn_0.3s_ease-out]">
                <button 
                  onClick={() => setStep(2)}
                  className="w-full bg-[#185325] hover:bg-[#123d1c] text-white font-bold rounded-full py-4 transition-colors cursor-pointer shadow-md active:scale-[0.98]"
                >
                  Lanjutkan Pembayaran
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9F8] pt-10 pb-20 px-5 font-sans animate-in fade-in duration-300">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-[28px] font-bold text-[#185325] text-center mb-12">
          Pembayaran Program Rehabilitasi
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#185325] flex items-center gap-2 mb-3">
                Order ID <span className="text-[#8D6E63] font-normal text-lg">#CSR-INV-{programData.id}</span>
              </h2>
              <p className="text-sm text-[#185325] mb-4">
                Selesaikan pembayaran dalam <span className="font-bold">00.15.39</span>
              </p>
              <p className="text-sm text-[#185325] mb-2">
                Lakukan pembayaran untuk menyelesaikan pesanan kamu
              </p>
              <div className="flex items-center gap-3 mt-4">
                <span className="text-sm text-[#185325]">Total Bayar</span>
                <span className="text-2xl md:text-3xl font-bold text-[#185325]">{formatRupiah(programData.anggaran)}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm text-[#185325] mb-2 font-bold">Panduan Pembayaran</h3>
              <ol className="list-decimal list-inside text-sm text-[#185325] space-y-1.5">
                {activeTab === 'QR' ? (
                  <>
                    <li>Buka aplikasi pembayaran QRIS yang mendukung</li>
                    <li>Unduh atau pindai QRIS di layar kamu</li>
                    <li>Konfirmasi pembayaran di aplikasi</li>
                    <li>Pembayaran Berhasil</li>
                  </>
                ) : (
                  <>
                    <li>Buka aplikasi pembayaran VA yang mendukung</li>
                    <li>Salin nomor VA di layar kamu</li>
                    <li>Konfirmasi pembayaran di aplikasi</li>
                    <li>Pembayaran Berhasil</li>
                  </>
                )}
              </ol>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex w-64 rounded-full border border-gray-300 p-1 bg-transparent mb-8">
              <button
                onClick={() => setActiveTab('QR')}
                className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer
                  ${activeTab === 'QR' ? 'bg-[#98D69A] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                QR
              </button>
              <button
                onClick={() => setActiveTab('VA')}
                className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer
                  ${activeTab === 'VA' ? 'bg-[#98D69A] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                VA
              </button>
            </div>

            {/* Konten Tab Aktif */}
            <div className="w-full flex flex-col items-center animate-[fadeIn_0.3s_ease-out]">
              {activeTab === 'QR' ? (
                <>
                  <p className="text-sm text-[#185325] mb-4">Pindai atau Download QR</p>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=BayarCSR_${programData.id}_${programData.anggaran}`} 
                      alt="QR Code" 
                      className="w-56 h-56 object-contain"
                    />
                  </div>
                  <button className="flex items-center justify-center gap-2 w-64 py-3 rounded-full border border-[#185325] text-[#185325] font-semibold text-sm hover:bg-[#185325] hover:text-white transition-colors cursor-pointer">
                    Download QR <HiOutlineCloud className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleSelesaikanPembayaran}
                    disabled={isSubmitting}
                    className="w-full max-w-75 bg-[#185325] hover:bg-[#123d1c] text-white font-bold rounded-full py-3.5 transition-colors cursor-pointer shadow-md active:scale-[0.98] mt-6 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Memproses...' : 'Selesai Pembayaran'}
                  </button>
                </>
              ) : (
                <div className="w-full flex flex-col items-center mt-4">
                  <p className="text-sm text-[#185325] mb-3">Virtual Account</p>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl font-bold text-[#185325]">
                      18247000{programData.id}3183
                    </span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`18247000${programData.id}3183`);
                        toast.success("Nomor VA disalin ke clipboard!");
                      }} 
                      className="text-[#185325] hover:text-gray-600 transition-colors cursor-pointer" 
                      title="Salin VA"
                    >
                      <HiOutlineDocumentDuplicate className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-[#185325] text-center max-w-62.5 mb-8 leading-relaxed">
                    Lakukan pembayaran ke no VA diatas sesuai nominal sebesar <span className="font-bold">{formatRupiah(programData.anggaran)}</span>
                  </p>
                  
                  <button 
                    onClick={handleSelesaikanPembayaran}
                    disabled={isSubmitting}
                    className="w-full max-w-75 bg-[#185325] hover:bg-[#123d1c] text-white font-bold rounded-full py-3.5 transition-colors cursor-pointer shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                    {isSubmitting ? 'Memproses...' : 'Selesai Pembayaran'}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PendanaanProgram;