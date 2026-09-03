import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiEye, 
  HiEyeSlash, 
  HiOutlinePlus, 
  HiOutlineArrowRightOnRectangle, 
  HiOutlineArrowRight 
} from 'react-icons/hi2';
import TransactionItem from './components/TransactionItem';
import { getKthWalletAPI } from '@/services/investasi.service';
import toast from 'react-hot-toast';

const mockTransactions = [
  { id: 1, type: 'Transfer Bank', date: '10/09/2024 - 10.00', amount: -1000000, bank: 'Bank BCA' },
  { id: 2, type: 'Isi Saldo', date: '01/01/2024 - 19.00', amount: 8000000, bank: 'Bank BCA' },
  { id: 3, type: 'Isi Saldo', date: '01/01/2024 - 19.00', amount: 1000000, bank: 'Bank BCA' },
  { id: 4, type: 'Transfer Bank', date: '10/09/2024 - 10.00', amount: -15000000, bank: 'Bank BCA' },
];

const SaldoKeuntungan = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        setIsLoading(true);
        const data = await getKthWalletAPI();
        setTotalBalance(data.saldo || 0);
      } catch (error: any) {
        toast.error(error.message || 'Gagal memuat saldo');
      } finally {
        setIsLoading(false);
      }
    };
    fetchWallet();
  }, []);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(amount).replace('Rp', 'Rp.');
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 animate-[fadeIn_0.3s_ease-out]">
      <div className="text-center mb-10">
        <h2 className="text-primary font-bold text-lg md:text-xl mb-2">Saldo Pendanaan</h2>
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-3xl font-bold text-[#9C6644] tracking-tight transition-all">
            {isLoading ? "Memuat..." : (isVisible ? "Rp. *******" : formatRupiah(totalBalance))}
          </h1>
          <button 
            onClick={() => setIsVisible(!isVisible)} 
            className="text-[#9C6644] hover:text-primary transition-colors cursor-pointer p-1"
          >
            {isVisible ? <HiEye size={24} /> : <HiEyeSlash size={24} />}
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-12 mb-12">
        {/* <button 
          className="group flex flex-col items-center gap-2 text-primary hover:text-tertiary transition-colors cursor-pointer" 
          onClick={() => navigate('/admin/kth/saldo/isi')}
        >
          <div className="w-12 h-12 rounded-full border border-primary flex items-center justify-center group-hover:bg-primary/5 transition-all">
            <HiOutlinePlus size={22} />
          </div>
          <span className="text-xs font-semibold">Isi Saldo</span>
        </button> */}
        
        <button 
          className="group flex flex-col items-center gap-2 text-primary hover:text-tertiary transition-colors cursor-pointer" 
          onClick={() => navigate('/admin/kth/saldo/tarik')}
        >
          <div className="w-12 h-12 rounded-full border border-primary flex items-center justify-center group-hover:bg-primary/5 transition-all">
            <HiOutlineArrowRightOnRectangle size={22} className="-rotate-90" />
          </div>
          <span className="text-xs font-semibold">Tarik Saldo</span>
        </button>
      </div>

      <div className="">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-primary font-bold text-lg">Riwayat Transaksi</h3>
          <button
            onClick={() => navigate('/admin/kth/saldo/riwayat-transaksi')}
            className="text-primary hover:text-tertiary cursor-pointer rounded-full border border-primary hover:border-tertiary py-1.5 px-4 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            Lihat Semua <HiOutlineArrowRight size={14} />
          </button>
        </div>

        <div className="space-y-0">
          {mockTransactions.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default SaldoKeuntungan;